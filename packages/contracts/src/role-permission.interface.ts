import { IBaseEntity } from './base.interface';
import { IRole } from './role.interface';

export interface IRolePermission extends IBaseEntity {
	roleId: string;
	permission: string;
	role: IRole;
	enabled: boolean;
	description: string;
}

export interface IRolePermissionMigrateInput extends IBaseEntity {
	permission: string;
	role: string;
	isImporting: boolean;
	sourceId: string;
	description: string;
}

export interface IRolePermissionCreateInput extends IBaseEntity {
	role?: IRole;
	roleId: string;
	permission: string;
	enabled: boolean;
}

export interface IRolePermissionUpdateInput extends IRolePermissionCreateInput {
	enabled: boolean;
}

export enum PermissionsEnum {
	ADMIN_DASHBOARD_VIEW = 'ADMIN_DASHBOARD_VIEW',
	COMPANY_SETTING = 'COMPANY_SETTING'
}

export const PermissionGroups = {
	//Permissions which can be given to any role
	GENERAL: [PermissionsEnum.ADMIN_DASHBOARD_VIEW],

	//Readonly permissions, are only enabled for Super Admin/Admin role
	ADMINISTRATION: [PermissionsEnum.COMPANY_SETTING]
};
