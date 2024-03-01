import { Injectable } from '@nestjs/common';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { UpdateUserCompanyDto } from './dto/update-user-company.dto';

@Injectable()
export class UserCompanyService {
  create(createUserCompanyDto: CreateUserCompanyDto) {
    return 'This action adds a new userCompany';
  }

  findAll() {
    return `This action returns all userCompany`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCompany`;
  }

  update(id: number, updateUserCompanyDto: UpdateUserCompanyDto) {
    return `This action updates a #${id} userCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCompany`;
  }
}
