import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRepository } from './repository/company.repository';
import { CreateCompanyDto, Company as ICompany } from '@everbyte/contracts';
import { Company } from '@everbyte/data';
import { CrudService } from '@everbyte/core';

@Injectable()
export class CompanyService extends CrudService<Company> {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: CompanyRepository
  ) {
    super(companyRepository);
  }
  async createCompany(dto: CreateCompanyDto): Promise<ICompany> {
    return await this.create(dto);
  }
}
