import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';

@Module({
  controllers: [RolePermissionController],
  providers: [RolePermissionService]
})
export class RolePermissionModule {}
