import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  IsRoleAlreadyExistConstraint,
  IsRoleShouldExistConstraint,
  IsTenantBelongsToUserConstraint,
} from './constraints';
import { Role } from '@workflow/data';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [
    IsRoleAlreadyExistConstraint,
    IsRoleShouldExistConstraint,
    IsTenantBelongsToUserConstraint,
  ],
})
export class ValidatorModule {}
