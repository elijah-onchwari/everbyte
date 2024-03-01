
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Index, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IRole, IRolePermission, UserRole } from '@everbyte/contracts';
import { RolePermission } from './role-permission.entity';

@Entity('roles')
export class Role extends BaseEntity implements IRole {
	@ApiProperty({ type: () => String, enum: UserRole })
	@Index()
	@Column()
	name: string;

	@ApiProperty({ type: () => Boolean, default: false })
	@Column({ default: false })
	isSystem?: boolean;

	@ApiProperty({ type: () => RolePermission, isArray: true })
	@OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {
		cascade: true
	})
	rolePermissions?: IRolePermission[];

	/**
	 * Role Users
	 */
	// @ApiProperty({ type: () => User, isArray: true })
	// @Exclude({ toPlainOnly: true })
	// @OneToMany(() => User, (user) => user.role)
	// users?: IUser[];
}
