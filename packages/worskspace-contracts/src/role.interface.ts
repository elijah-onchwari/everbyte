import { IUser } from './user.interface';
import { IRolePermission } from './role-permission.interface';
import { IBase } from './base.interface';

export interface IRole extends IRoleCreateInput {
	isSystem?: boolean;
	rolePermissions?: IRolePermission[];
	users?: IUser[];
}

export interface IRoleCreateInput extends IBase {
	name: string;
}

export interface IRoleFindInput extends IBase {
	name?: string;
	isSystem?: boolean;
}

export enum UserRole {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	CLIENT = 'CLIENT'
}

export interface IRoleMigrateInput extends IBase {
	name: string;
	isImporting: boolean;
	sourceId: string;
}

export interface IRelationalRole {
	readonly role?: IRole;
	readonly roleId?: IRole['id'];
}
