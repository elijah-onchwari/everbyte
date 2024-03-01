import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthLoginCommand } from '../auth.login.command';
import { AuthService } from '../../auth.service';
import { AuthResponse, SignInRequest } from '@everbyte/contracts';

@CommandHandler(AuthLoginCommand)
export class AuthLoginHandler implements ICommandHandler<AuthLoginCommand> {
	constructor(private readonly authService: AuthService) {}

	public async execute(
		command: AuthLoginCommand
	): Promise<AuthResponse | null> {
		const { input } = command;
		const { email, password }: SignInRequest = input;

		return await this.authService.signIn({ email, password });
	}
}
