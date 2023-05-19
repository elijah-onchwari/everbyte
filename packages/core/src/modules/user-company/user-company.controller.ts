import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { UpdateUserCompanyDto } from './dto/update-user-company.dto';

@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @Post()
  create(@Body() createUserCompanyDto: CreateUserCompanyDto) {
    return this.userCompanyService.create(createUserCompanyDto);
  }

  @Get()
  findAll() {
    return this.userCompanyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCompanyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCompanyDto: UpdateUserCompanyDto) {
    return this.userCompanyService.update(+id, updateUserCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCompanyService.remove(+id);
  }
}
