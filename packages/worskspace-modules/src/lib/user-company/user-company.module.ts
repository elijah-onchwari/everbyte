import { Module } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { UserCompanyController } from './user-company.controller';

@Module({
  controllers: [UserCompanyController],
  providers: [UserCompanyService]
})
export class UserCompanyModule {}
