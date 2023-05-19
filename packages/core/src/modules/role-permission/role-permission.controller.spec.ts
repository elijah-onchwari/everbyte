import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';

describe('RolePermissionController', () => {
  let controller: RolePermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolePermissionController],
      providers: [RolePermissionService],
    }).compile();

    controller = module.get<RolePermissionController>(RolePermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
