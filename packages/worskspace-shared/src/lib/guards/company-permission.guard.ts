import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPermission } from '@everbyte/contracts';
import {
	isNotEmpty,
	PERMISSIONS_METADATA,
	removeDuplicates
} from '@everbyte/common';
// import { CompanyService } from '../../company/company.service';
import { CompanyBaseGuard } from './company-base.guard';
import { RequestContext } from '@everbyte/core';

@Injectable()
export class CompanyPermissionGuard
	extends CompanyBaseGuard
	implements CanActivate
{
	constructor(
		protected readonly _reflector: Reflector,
		// private readonly _companyService: CompanyService
	) {
		super(_reflector);
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const currentCompanyId = RequestContext.currentCompanyId();
		let isAuthorized = false;
		if (!currentCompanyId) {
			return isAuthorized;
		}

		// Basically if this guard is true then try the check company permissions.
		isAuthorized = await super.canActivate(context);
		if (!isAuthorized) {
			return isAuthorized;
		}

		//Enabled AllowSuperAdminRole from .env file
		// if (environment.allowSuperAdminRole === true) {
		// 	//Super admin and admin has allowed to access request
		// 	const isSuperAdmin = RequestContext.hasRoles([
		// 		RolesEnum.SUPER_ADMIN
		// 	]);
		// 	if (isSuperAdmin === true) {
		// 		isAuthorized = isSuperAdmin;
		// 		return isAuthorized;
		// 	}
		// }
		/*
		 * Retrieve metadata for a specified key for a specified set of permissions
		 */
		const permissions =
			removeDuplicates(
				this._reflector.getAllAndOverride<UserPermission[]>(
					PERMISSIONS_METADATA,
					[context.getHandler(), context.getClass()]
				)
			) || [];
		if (isNotEmpty(permissions)) {
			// const company = await this._companyService.findOneByIdString(
			// 	currentCompanyId,
			// 	{
			// 		relations: {
			// 			rolePermissions: true
			// 		}
			// 	}
			// );
			// TODO - 3: Remove this
			// isAuthorized = !!company.rolePermissions.find(
			// 	(p) => permissions.indexOf(p.permission) > -1 && p.enabled
			// );
			isAuthorized = true;
		}
		if (!isAuthorized) {
			console.log(
				'Unauthorized access blocked. CompanyId:',
				currentCompanyId,
				' Permissions Checked:',
				permissions
			);
		}
		return isAuthorized;
	}
}
