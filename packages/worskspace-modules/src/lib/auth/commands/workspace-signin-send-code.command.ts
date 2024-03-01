import { ICommand } from '@nestjs/cqrs';
import { UserEmail } from '@everbyte/contracts';

export class WorkspaceSigninSendCodeCommand implements ICommand {
	static readonly type =
		'[Password Less] Send Workspace Signin Authentication Code';

	constructor(public readonly input: UserEmail) {}
}
