import { Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Injectable()
export class RolePermissionService {
  create(createRolePermissionDto: CreateRolePermissionDto) {
    return 'This action adds a new rolePermission';
  }

  findAll() {
    return `This action returns all rolePermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolePermission`;
  }

  update(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
    return `This action updates a #${id} rolePermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolePermission`;
  }
}
