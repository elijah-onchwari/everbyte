import { UserEmail, UserToken } from '@everbyte/contracts';
import { ICommand } from '@nestjs/cqrs';

export class WorkspaceSigninVerifyTokenCommand implements ICommand {
	static readonly type = '[Password Less] Workspace Signin Verify Token';

	constructor(public readonly input: UserEmail & UserToken) {}
}
