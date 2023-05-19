import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@database/entities/internal';
import {
	IsRoleAlreadyExistConstraint,
	IsRoleShouldExistConstraint,
	IsTenantBelongsToUserConstraint
} from './constraints';

@Module({
	imports: [TypeOrmModule.forFeature([Role])],
	providers: [
		IsRoleAlreadyExistConstraint,
		IsRoleShouldExistConstraint,
		IsTenantBelongsToUserConstraint
	]
})
export class ValidatorModule {}
