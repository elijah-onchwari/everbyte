import { IUser } from '@everbyte/contracts';
import { ICommand } from '@nestjs/cqrs';

export class UserDeleteCommand implements ICommand {
	static readonly type = '[User] Account Delete';

	constructor(
		public readonly userId: IUser['id'],
	) {}
}
