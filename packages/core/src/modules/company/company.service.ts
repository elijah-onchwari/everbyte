import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '@core/abstracts';
import { Company } from './entities/company.entity';
import { CompanyRepository } from './repository/company.repository';
import { CreateCompanyDto, ICompany } from './dto/company.dto';

@Injectable()
export class CompanyService extends CrudService<Company> {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: CompanyRepository,
  ) {
    super(companyRepository);
  }
  async createCompany(dto: CreateCompanyDto): Promise<ICompany> {
    const tenant = await this.create(dto)

    return tenant;
  }
}
