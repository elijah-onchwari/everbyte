import { IBase } from './base.interface';
import { IRole } from './role.interface';

export interface IRolePermission extends IBase {
	roleId: string;
	permission: string;
	role: IRole;
	enabled: boolean;
	description: string;
}

export interface IRolePermissionMigrateInput extends IBase {
	permission: string;
	role: string;
	isImporting: boolean;
	sourceId: string;
	description: string;
}

export interface IRolePermissionCreateInput extends IBase {
	role?: IRole;
	roleId: string;
	permission: string;
	enabled: boolean;
}

export interface IRolePermissionUpdateInput extends IRolePermissionCreateInput {
	enabled: boolean;
}

export enum UserPermission {
	ADMIN_DASHBOARD_VIEW = 'ADMIN_DASHBOARD_VIEW',
	COMPANY_SETTING = 'COMPANY_SETTING'
}

export const PermissionGroups = {
	//Permissions which can be given to any role
	GENERAL: [UserPermission.ADMIN_DASHBOARD_VIEW],

	//Readonly permissions, are only enabled for Super Admin/Admin role
	ADMINISTRATION: [UserPermission.COMPANY_SETTING]
};
