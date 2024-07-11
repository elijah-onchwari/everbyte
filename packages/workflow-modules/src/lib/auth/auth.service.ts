import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AuthResponse,
  IUser,
  SignInRequest,
  SignUpRequest,
} from '@everbyte/contracts';
import bcrypt from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { environment } from '@workflow/config';
import { UserEmail, UserToken } from '@everbyte/contracts';
import { UserService } from '../user';
import { User } from '@workflow/data';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService
  ) {}

  /**
   * Shared method involved in
   * 1. Sign up
   * 2. Addition of new user to organization
   * 3. User invite accept scenario
   *
   * @param input
   * @param languageCode
   * @returns
   */
  async signUp(input: SignUpRequest): Promise<User> {
    let company = input.user.company;
    // 1. If createdById is provided, get the creating user and use their tenant
    if (input.createdById) {
      const creatingUser = await this.userService.findOneByIdString(
        input.createdById,
        {
          relations: {
            company: true,
          },
        }
      );
      company = creatingUser.company;
    }

    // 2. Register new user
    const userToCreate = this.userRepository.create({
      ...input.user,
      company,
      ...(input.password
        ? { hash: await this.getPasswordHash(input.password) }
        : {}),
    });
    const createdUser = await this.userRepository.save(userToCreate);

    // 3. Email is automatically verified after accepting an invitation
    // if (input.inviteId) {
    // 	await this.userRepository.update(createdUser.id, {
    // 		emailVerifiedAt: freshTimestamp()
    // 	});
    // }

    // 4. Find the latest registered user with role
    const user = await this.userRepository.findOne({
      // where: {
      // 	id: createdUser.id
      // }
      // relations: {
      // 	role: true
      // }
    });

    // 5. If organizationId is provided, add the user to the organization
    // if (isNotEmpty(input.organizationId)) {
    // 	await this.userOrganizationService.addUserToOrganization(
    // 		user,
    // 		input.organizationId
    // 	);
    // }

    // 6. Create Import Records while migrating for a relative user
    // const { isImporting = false, sourceId = null } = input;
    // if (isImporting && sourceId) {
    // 	const { sourceId } = input;
    // 	this.commandBus.execute(
    // 		new ImportRecordUpdateOrCreateCommand({
    // 			entityType: this.typeOrmUserRepository.metadata.tableName,
    // 			sourceId,
    // 			destinationId: user.id
    // 		})
    // 	);
    // }

    // // Extract integration information
    // let integration = pick(input, [
    // 	'appName',
    // 	'appLogo',
    // 	'appSignature',
    // 	'appLink',
    // 	'appEmailConfirmationUrl',
    // 	'companyLink',
    // 	'companyName'
    // ]);

    // 7. If the user's email is not verified, send an email verification
    // if (!user.emailVerifiedAt) {
    // 	this.emailConfirmationService.sendEmailVerification(
    // 		user,
    // 		integration
    // 	);
    // }

    // 8. Send a welcome email to the user
    // this.emailService.welcomeUser(
    // 	input.user,
    // 	input.originalUrl,
    // 	integration
    // );

    return user;
  }

  /**
   * User Login Request
   *
   * @param email
   * @param password
   * @returns
   */
  async signIn({
    email,
    password,
  }: SignInRequest): Promise<AuthResponse | null> {
    try {
      const user = await this.userService.findOneByOptions({
        where: {
          email,
          active: true,
          // isArchived: false
        },
        // relations: {
        // 	employee: true,
        // 	role: true
        // },
        order: {
          createdAt: 'DESC',
        },
      });

      // If employees are inactive
      // if (isNotEmpty(user.employee) && user.employee.isActive === false) {
      // 	throw new UnauthorizedException();
      // }
      // If password is not matching with any user
      if (!(await bcrypt.compare(password, user.hash))) {
        throw new UnauthorizedException();
      }

      const access_token = await this.getJwtAccessToken(user);
      const refresh_token = await this.getJwtRefreshToken(user);

      await this.userService.setCurrentRefreshToken(refresh_token, user.id);

      return {
        user,
        token: access_token,
        refresh_token: refresh_token,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async getPasswordHash(password: string): Promise<string> {
    //TODO - Add saltRounds to the config
    return bcrypt.hash(password, 10);
  }

  /**
   * Get JWT access token
   *
   * @param payload
   * @returns
   */
  public async getJwtAccessToken(request: Partial<IUser>) {
    try {
      // Extract the user ID from the request
      const userId = request.id;

      // Retrieve the user's data from the userService
      const user = await this.userService.findOneByIdString(userId, {
        relations: {
          // employee: true,
          // role: {
          // 	rolePermissions: true
          // }
        },
        order: {
          createdAt: 'DESC',
        },
      });

      // Create a payload for the JWT token
      const payload: JwtPayload = {
        id: user.id,
        companyId: user.companyId,
      };

      // Check if the user has a role
      // if (user.role) {
      // 	payload.role = user.role.name;

      // 	// Check if the role has rolePermissions
      // 	if (user.role.rolePermissions) {
      // 		payload.permissions = user.role.rolePermissions
      // 			.filter(
      // 				(rolePermission: IRolePermission) =>
      // 					rolePermission.enabled
      // 			)
      // 			.map(
      // 				(rolePermission: IRolePermission) =>
      // 					rolePermission.permission
      // 			);
      // 	} else {
      // 		payload.permissions = null;
      // 	}
      // } else {
      // 	payload.role = null;
      // }

      // Generate an access token using the payload and a secret
      const accessToken = sign(payload, environment.jwtSecret, {});

      // Return the generated access token
      return accessToken;
    } catch (error) {
      // Handle any errors that occur during the process
      console.log('Error while getting jwt access token', error);
    }
  }
  /**
   * Get JWT refresh token
   *
   * @param user
   * @returns
   */
  public async getJwtRefreshToken(user: Partial<IUser>) {
    try {
      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        companyId: user.companyId || null,
        // role: user.role ? user.role.name : null
      };
      const refreshToken = sign(
        payload,
        environment.jwtRefreshTokenSecret,
        // environment.JWT_REFRESH_TOKEN_SECRET,
        {
          // expiresIn: `${environment.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`
          expiresIn: `${environment.jwtRefreshTokenExpirationTime}s`,
        }
      );
      return refreshToken;
    } catch (error) {
      console.log('Error while getting jwt refresh token', error);
    }
  }

  async getAuthenticatedUser(id: string, thirdPartyId?: string): Promise<User> {
    return thirdPartyId
      ? this.userService.getIfExistsThirdParty(thirdPartyId)
      : this.userService.getIfExists(id);
  }

  /**
   * Verify workspace signin token
   *
   * @param input - The user email and token input.
   * @returns An object containing user information and tokens.
   */
  async workspaceSigninVerifyToken(
    input: UserEmail & UserToken
  ): Promise<AuthResponse | null> {
    try {
      const { email, token } = input;

      // Check for missing email or token
      if (!email || !token) {
        throw new UnauthorizedException();
      }

      const payload: JwtPayload | string = this.verifyToken(token);
      if (typeof payload === 'object') {
        const { userId, tenantId, code } = payload;
        const user = await this.userRepository.findOneOrFail({
          where: {
            id: userId,
            email,
            // companyId,
            // code,
            // codeExpireAt: MoreThanOrEqual(new Date()),
            active: true,
            // isArchived: false
          },
          relations: {
            // employee: true,
            // role: true
          },
        });

        await this.userRepository.update(
          {
            email,
            id: userId,
            // companyId,
            // code,
            active: true,
          },
          {
            // code: null,
            // codeExpireAt: null
          }
        );

        // If employees are inactive
        // if (
        // 	isNotEmpty(user.employee) &&
        // 	user.employee.isActive === false
        // ) {
        // 	throw new UnauthorizedException();
        // }

        const access_token = await this.getJwtAccessToken(user);
        const refresh_token = await this.getJwtRefreshToken(user);
        await this.userService.setCurrentRefreshToken(
          refresh_token,
          // user.id
          'userId'
        );

        return {
          user,
          token: access_token,
          refresh_token: refresh_token,
        };
      }
      throw new UnauthorizedException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('JWT token has been expired.');
      }
      console.log(
        'Error while signin workspace for specific tenant: %s',
        error?.message
      );
      throw new UnauthorizedException(error?.message);
    }
  }

  /**
   * Verify the JWT token and return the payload.
   * @param token - The JWT token to verify.
   * @returns The token payload or throws an error.
   */
  private verifyToken(token: string): JwtPayload | string {
    try {
      return verify(token, environment.jwtSecret);
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('JWT token has expired.');
      }
      console.log('Error while verifying JWT token: %s', error?.message);
      throw new UnauthorizedException(error?.message);
    }
  }

  /**
   * Sends a unique authentication code to the user's email for workspace sign-in.
   *
   * @param input - User email input along with partial app integration configuration.
   * @param locale - Language/locale for email content.
   * @returns {Promise<void>} - A promise indicating the completion of the operation.
   */
  async sendWorkspaceSigninCode(input: UserEmail): Promise<void> {
    const { email } = input;

    // Check if the email is provided
    if (!email) {
      console.log(
        'Error while sending workspace magic login code: Email is required'
      );
      return;
    }

    console.log('Email: ', email);

    try {
      // Count the number of users with the given email
      const count = await this.userRepository.countBy({
        email,
      });

      // If no user found with the email, return
      if (count === 0) {
        console.log(
          `Error while sending workspace magic login code: No user found with the email ${email}`
        );
        return;
      }

      // Generate a random alphanumeric code
      let magicCode: string;

      let isDemoCode = false;

      // Check if the environment variable 'DEMO' is set to 'true' and the Node.js environment is set to 'development'
      const IS_DEMO =
        process.env.DEMO === 'true' && process.env.NODE_ENV === 'development';

      console.log('Auth Is Demo: ', IS_DEMO);

      // If it's a demo environment, handle special cases
      if (IS_DEMO) {
        // const demoAdminEmail =
        // 	environment.demoCredentialConfig?.adminEmail ||
        // 	'local.admin@ever.co';

        const demoAdminEmail = 'admin@everbyte.co';
        console.log('Demo Admin Email: ', demoAdminEmail);

        // Check the value of the 'email' variable against certain demo email addresses
        if (email === demoAdminEmail) {
          // magicCode =
          // 	environment.demoCredentialConfig?.employeePassword ||
          // 	'123456';
          magicCode = '123456';
          isDemoCode = true;
        }
      }

      if (!isDemoCode) {
        magicCode = '123456';
        // magicCode = generateRandomAlphaNumericCode(
        // 	ALPHA_NUMERIC_CODE_LENGTH
        // );
      }

      // Calculate the expiration time for the code
      const codeExpireAt = new Date(
        Date.now() + 600 * 1000
        // (environment.MAGIC_CODE_EXPIRATION_TIME || 600) * 1000
      );

      // Update the user record with the generated code and expiration time
      await this.userRepository.update(
        { email },
        // { code: magicCode, codeExpireAt }
        { email }
      );

      console.log(
        `Email: '${email}' magic code: '${magicCode}' expires at: '${codeExpireAt}'`
      );

      // If it's not a demo code, send the magic code to the user's email
      if (!isDemoCode) {
        // // Extract integration information
        // let appIntegration = pick(input, [
        // 	'appName',
        // 	'appLogo',
        // 	'appSignature',
        // 	'appLink',
        // 	'companyLink',
        // 	'companyName',
        // 	'appMagicSignUrl'
        // ]);
        // // Override the default config by merging in the provided values.
        // const integration = deepMerge(
        // 	environment.appIntegrationConfig,
        // 	appIntegration
        // );
        // let magicLink: string;
        // if (integration.appMagicSignUrl) {
        // 	magicLink = `${integration.appMagicSignUrl}?email=${email}&code=${magicCode}`;
        // }
        // console.log('Magic Link: ', magicLink);
        // Send the magic code to the user's email
        // this.emailService.sendMagicLoginCode({
        // 	email,
        // 	magicCode,
        // 	magicLink,
        // 	integration
        // });
      }
    } catch (error) {
      console.log(
        `Error while sending workspace magic login code for email: ${email}`,
        error?.message
      );
    }
  }
}
