import { IRolePermission, UserPermission } from '@everbyte/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Index, Column, ManyToOne, RelationId } from 'typeorm';
import { Role } from './role.entity';
import { BaseEntity } from './base.entity';

@Entity('role_permissions')
export class RolePermission extends BaseEntity implements IRolePermission {
	@ApiProperty({ type: () => String, enum: UserPermission })
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
