import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { strategies } from './strategies';
import { UserModule } from '../user';

@Module({
	imports: [
		UserModule,
		CqrsModule
	],
	controllers: [AuthController],
	providers: [AuthService, ...CommandHandlers, ...strategies]
})
export class AuthModule {}
