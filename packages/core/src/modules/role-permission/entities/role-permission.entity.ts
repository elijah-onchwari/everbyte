import { BaseEntity, Role } from '@database/entities/internal';
import { IRolePermission, PermissionsEnum } from '@everbyte/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Index, Column, ManyToOne, RelationId } from 'typeorm';

@Entity('role_permissions')
export class RolePermission extends BaseEntity implements IRolePermission {
	@ApiProperty({ type: () => String, enum: PermissionsEnum })
	@Index()
	@Column()
	permission: string;

	@ApiPropertyOptional({ type: () => Boolean, default: false })
	@Column({ nullable: true, default: false })
	enabled: boolean;

	@ApiPropertyOptional({ type: () => String })
	@Column({ nullable: true })
	description: string;

	/*
    |--------------------------------------------------------------------------
    | @ManyToOne
    |--------------------------------------------------------------------------
    */
	@ManyToOne(() => Role, (role) => role.rolePermissions, {
		onDelete: 'CASCADE'
	})
	role: Role;

	@ApiProperty({ type: () => String })
	@RelationId((it: RolePermission) => it.role)
	@Index()
	@Column()
	roleId: string;
}
