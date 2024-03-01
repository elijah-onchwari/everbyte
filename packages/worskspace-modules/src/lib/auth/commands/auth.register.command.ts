import { ICommand } from '@nestjs/cqrs';
import { SignUpRequest } from '@everbyte/contracts';

export class AuthRegisterCommand implements ICommand {
	static readonly type = '[Auth] Signup';

	constructor(public readonly input: SignUpRequest) {}
}
