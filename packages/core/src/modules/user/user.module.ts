import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@everbyte/config';

@Module({
	imports: [ConfigModule, TypeOrmModule.forFeature([User]), CqrsModule],
	controllers: [UserController],
	providers: [UserService, ...CommandHandlers],
	exports: [TypeOrmModule, UserService]
})
export class UserModule {}
