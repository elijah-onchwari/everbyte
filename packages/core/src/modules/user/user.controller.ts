import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Query,
	UseGuards,
	HttpCode,
	Post,
	Body,
	Delete,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiBearerAuth
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult, FindOptionsWhere } from 'typeorm';
import { IPagination, IUser } from '@everbyte/contracts';
import { CrudController, PaginationParams } from '@core/abstracts';
import { UUIDValidationPipe, ParseJsonPipe } from '@shared/pipes';
import { PermissionGuard, CompanyPermissionGuard } from '@shared/guards';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserCreateCommand, UserDeleteCommand } from './commands';
import { CreateUserDTO, FindMeQueryDTO } from './dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController extends CrudController<User> {
	constructor(
		private readonly userService: UserService,
		private readonly commandBus: CommandBus
	) {
		super(userService);
	}

	/**
	 * GET current login user
	 *
	 * @param options
	 * @returns
	 */
	@ApiOperation({ summary: 'Find current user.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found current user',
		type: User
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('/me')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async findMe(@Query() options: FindMeQueryDTO): Promise<IUser> {
		return await this.userService.findMe(options.relations);
	}

	/**
	 * GET user by email
	 *
	 * @param email
	 * @returns
	 */
	@ApiOperation({ summary: 'Find user by email address.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found user by email address',
		type: User
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('/email/:email')
	async findByEmail(@Param('email') email: string): Promise<IUser | null> {
		return await this.userService.getUserByEmail(email);
	}

	/**
	 * GET user count for specific tenant
	 *
	 * @returns
	 */
	@UseGuards(CompanyPermissionGuard, PermissionGuard)
	// @Permissions(PermissionsEnum.ORG_USERS_VIEW)
	@Get('count')
	async getCount(@Query() options: FindOptionsWhere<User>): Promise<number> {
		return await this.userService.countBy(options);
	}

	/**
	 * GET users for specific tenant using pagination
	 *
	 * @param options
	 * @returns
	 */
	@UseGuards(CompanyPermissionGuard, PermissionGuard)
	// @Permissions(PermissionsEnum.ORG_USERS_VIEW)
	@Get('pagination')
	async pagination(
		@Query() options: PaginationParams<User>
	): Promise<IPagination<IUser>> {
		return await this.userService.paginate(options);
	}

	/**
	 * GET users for specific tenant
	 *
	 * @param options
	 * @returns
	 */
	@ApiOperation({ summary: 'Find all users.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found users',
		type: User
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@UseGuards(CompanyPermissionGuard, PermissionGuard)
	// @Permissions(PermissionsEnum.ORG_USERS_VIEW)
	@Get()
	async findAll(
		@Query() options: PaginationParams<User>
	): Promise<IPagination<IUser>> {
		return await this.userService.findAll(options);
	}

	/**
	 * GET user by id
	 *
	 * @param id
	 * @param data
	 * @returns
	 */
	@ApiOperation({ summary: 'Find User by id.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found one record',
		type: User
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get(':id')
	async findById(
		@Param('id', UUIDValidationPipe) id: string,
		@Query('data', ParseJsonPipe) data?: any
	): Promise<IUser> {
		const { relations } = data;
		return await this.userService.findOneByIdString(id, { relations });
	}

	/**
	 * CREATE user for specific tenant
	 *
	 * @param entity
	 * @returns
	 */
	@ApiOperation({ summary: 'Create new record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The record has been successfully created.' /*, type: T*/
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@UseGuards(CompanyPermissionGuard, PermissionGuard)
	// @Permissions(PermissionsEnum.ORG_USERS_EDIT)
	@HttpCode(HttpStatus.CREATED)
	@Post()
	@UsePipes(new ValidationPipe())
	async create(@Body() entity: CreateUserDTO): Promise<IUser> {
		return await this.commandBus.execute(new UserCreateCommand(entity));
	}

	/**
	 * UPDATE user by id
	 *
	 * @param id
	 * @param entity
	 * @returns
	 */
	// @HttpCode(HttpStatus.ACCEPTED)
	// @UseGuards(CompanyPermissionGuard, PermissionGuard)
	// // @Permissions(PermissionsEnum.ORG_USERS_EDIT, PermissionsEnum.PROFILE_EDIT)
	// @Put(':id')
	// @UsePipes(new ValidationPipe({ transform: true }))
	// async update(
	// 	@Param('id', UUIDValidationPipe) id: IUser['id'],
	// 	@Body() entity: UpdateUserDTO
	// ): Promise<IUser> {
	// 	return await this.userService.updateProfile(id, {
	// 		id,
	// 		...entity
	// 	});
	// }

	/**
	 * DELTE user account
	 *
	 * @param id
	 * @returns
	 */
	@ApiOperation({
		summary: 'Delete record'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'The record has been successfully deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@UseGuards(CompanyPermissionGuard, PermissionGuard)
	// @Permissions(PermissionsEnum.ACCESS_DELETE_ACCOUNT)
	@Delete(':id')
	async delete(
		@Param('id', UUIDValidationPipe) id: IUser['id']
	): Promise<DeleteResult> {
		return await this.commandBus.execute(new UserDeleteCommand(id));
	}

	/**
	 * DELETE all user data from all tables
	 *
	 * @returns
	 */
	@ApiOperation({ summary: 'Delete all user data.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Deleted all user data.',
		type: User
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@UseGuards(CompanyPermissionGuard, PermissionGuard)
	// @Permissions(PermissionsEnum.ACCESS_DELETE_ALL_DATA)
	@Delete('/reset')
	async factoryReset() {
		return;
	}
}
