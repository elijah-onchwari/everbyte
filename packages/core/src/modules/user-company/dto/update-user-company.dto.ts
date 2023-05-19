import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCompanyDto } from './create-user-company.dto';

export class UpdateUserCompanyDto extends PartialType(CreateUserCompanyDto) {}
