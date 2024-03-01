import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { UserPermission } from 'role-permission.interface';

export class HasPermissionsQueryDto {
	@ApiProperty({ type: () => Array, isArray: true, required: true })
	@IsEnum(UserPermission, { each: true })
	@IsArray()
	permissions: UserPermission[] = [];
}
