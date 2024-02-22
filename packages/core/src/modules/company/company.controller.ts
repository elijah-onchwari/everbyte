import { Controller, Post, Body, HttpStatus,UsePipes, ValidationPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto, ICompany } from './dto/company.dto';

@ApiTags('Company')
@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  /**
   * CREATE Owner Company
   *
   * @returns
   */
  @ApiOperation({
    summary: 'Create new Company. The user who creates the company is given the super admin role.',
    security: [
      {
        role: ['SUPER_ADMIN']
      }
    ]
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input, The response body may contain clues as to what went wrong'
  })
  @Post()
  @UsePipes(new ValidationPipe())
  async createCompany(@Body() dto: CreateCompanyDto): Promise<ICompany> {
    return await this.companyService.createCompany(dto);
  }
}
