import { SignInRequest } from '@everbyte/contracts';
import { ICommand } from '@nestjs/cqrs';

export class AuthLoginCommand implements ICommand {
	static readonly type = '[Auth] Login';

	constructor(public readonly input: SignInRequest) {}
}
