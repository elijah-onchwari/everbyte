import { Controller } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';

@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}
}
