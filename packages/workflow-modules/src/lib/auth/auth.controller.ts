import {
	Body,
	Controller,
	HttpStatus,
	Post,
	UsePipes,
	ValidationPipe,
	Headers
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IUser, RegisterUserDTO } from '@everbyte/contracts';
import { CommandBus } from '@nestjs/cqrs';
import { AuthRegisterCommand } from './commands/auth.register.command';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly authService: AuthService
	) {}

	/**
	 * Register a new user.
	 *
	 * @param input - User registration data.
	 * @param languageCode - Language code.
	 * @param origin - Origin
	 * @returns
	 */
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The record has been successfully created.'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, the response body may contain clues as to what went wrong'
	})
	@Post('/register')
	// @Public()
	@UsePipes(new ValidationPipe({ transform: true }))
	async register(
		@Body() dto: RegisterUserDTO,
		@Headers('origin') origin: string
	): Promise<IUser> {
		return await this.commandBus.execute(
			new AuthRegisterCommand({
				originalUrl: origin,
				...dto
			})
		);
	}
}
