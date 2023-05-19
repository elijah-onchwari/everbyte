import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@everbyte/config';
import { DeleteResult } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { UserDeleteCommand } from '../user.delete.command';
import { UserService } from '@modules/user/user.service';

@CommandHandler(UserDeleteCommand)
export class UserDeleteHandler implements ICommandHandler<UserDeleteCommand> {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService
	) {}

	public async execute(command: UserDeleteCommand): Promise<DeleteResult> {
		const { userId } = command;
		if (!this.configService.isProd()) {
			throw new ForbiddenException();
		}
		return await this.userService.delete(userId);
	}
}
