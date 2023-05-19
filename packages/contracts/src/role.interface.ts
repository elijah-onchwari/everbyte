import { IUser } from './user.interface';
import { IRolePermission } from './role-permission.interface';
import { IBaseEntity } from './base.interface';

export interface IRole extends IRoleCreateInput {
	isSystem?: boolean;
	rolePermissions?: IRolePermission[];
	users?: IUser[];
}

export interface IRoleCreateInput extends IBaseEntity {
	name: string;
}

export interface IRoleFindInput extends IBaseEntity {
	name?: string;
	isSystem?: boolean;
}

export enum RolesEnum {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	CLIENT = 'CLIENT'
}

export interface IRoleMigrateInput extends IBaseEntity {
	name: string;
	isImporting: boolean;
	sourceId: string;
}

export interface IRelationalRole {
	readonly role?: IRole;
	readonly roleId?: IRole['id'];
}
