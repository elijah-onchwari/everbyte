import { IntersectionType } from '@nestjs/swagger';
import { SignInRequest } from '@everbyte/contracts';
import { UserPasswordDto } from './user-password.dto';
import { UserEmailDto } from './user-email.dto';

/**
 * User login DTO validation
 */
export class UserLoginDto
	extends IntersectionType(UserEmailDto, UserPasswordDto)
	implements SignInRequest {}
