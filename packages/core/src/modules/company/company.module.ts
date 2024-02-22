import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';

@Module({
  imports: [
    RouterModule.register([
			{ path: '/company', module: CompanyModule }
		]),
    TypeOrmModule.forFeature([Company]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
