import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(createRolePermissionDto);
  }

  @Get()
  findAll() {
    return this.rolePermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolePermissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.rolePermissionService.update(+id, updateRolePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolePermissionService.remove(+id);
  }
}
