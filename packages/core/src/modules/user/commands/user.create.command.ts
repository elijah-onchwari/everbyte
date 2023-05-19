import { ICommand } from '@nestjs/cqrs';
import { IUserCreateInput } from '@everbyte/contracts';

export class UserCreateCommand implements ICommand {
	static readonly type = '[User] Create';

	constructor(
		public readonly input: IUserCreateInput
	) {}
}
