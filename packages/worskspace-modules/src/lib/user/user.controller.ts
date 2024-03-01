import {
	Controller,
	HttpStatus,
	HttpCode,
	Post,
	Body,
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
import { CreateUserDTO, IUser } from '@everbyte/contracts';
import { UserService } from './user.service';
import { UserCreateCommand } from './commands';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly commandBus: CommandBus
	) {}

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
	// @UseGuards(TenantPermissionGuard, PermissionGuard)
	// @Permissions(PermissionsEnum.ORG_USERS_EDIT)
	@HttpCode(HttpStatus.CREATED)
	@Post()
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: CreateUserDTO): Promise<IUser> {
		return await this.commandBus.execute(new UserCreateCommand(dto));
	}
}
