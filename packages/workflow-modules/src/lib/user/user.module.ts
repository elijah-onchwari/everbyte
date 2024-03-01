import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { User } from '@workflow/data';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@workflow/config';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => TypeOrmModule.forFeature([User])),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [UserService, ...CommandHandlers],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
