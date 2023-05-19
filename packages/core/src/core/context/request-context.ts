import { HttpException, HttpStatus } from '@nestjs/common';
import * as cls from 'cls-hooked';
import { IUser, PermissionsEnum, RolesEnum } from '@everbyte/contracts';
import { ExtractJwt } from 'passport-jwt';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { isNotEmpty } from '@everbyte/common';

export class RequestContext {
	readonly id: number;
	request: Request;
	response: Response;

	constructor(request: Request, response: Response) {
		this.id = Math.random();
		this.request = request;
		this.response = response;
	}

	static currentRequestContext(): RequestContext {
		const session = cls.getNamespace(RequestContext.name);
		if (session && session.active) {
			return session.get(RequestContext.name);
		}

		return null;
	}

	static currentRequest(): Request {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			return requestContext.request;
		}

		return null;
	}

	static currentCompanyId(): string {
		try {
			const user: IUser = RequestContext.currentUser();
			return user.companyId;
		} catch (error) {
			return null;
		}
	}

	static currentUserId(): string {
		const user: IUser = RequestContext.currentUser();
		if (user) {
			return user.id;
		}
		return null;
	}

	static currentRoleId(): string {
		const user: IUser = RequestContext.currentUser();
		// TODO - 1: Remove this
		const u = { ...user, roleId: RolesEnum.SUPER_ADMIN };
		if (u) {
			return u.roleId;
		}
		return null;
	}

	static currentProfileId(): string {
		try {
			const user: IUser = RequestContext.currentUser();
			// TODO - 2: Remove this
			if (isNotEmpty(user)) {
				// if (
				// 	!RequestContext.hasPermission(
				// 		PermissionsEnum.CHANGE_SELECTED_EMPLOYEE
				// 	)
				// ) {
				// 	return user.employeeId;
				// }

				return user.id;
			}
			return null;
		} catch (error) {
			return null;
		}
	}

	static currentUser(throwError?: boolean): IUser {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			// tslint:disable-next-line
			const user: IUser = requestContext.request['user'];

			if (user) {
				return user;
			}
		}

		if (throwError) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		return null;
	}

	static hasPermission(
		permission: PermissionsEnum,
		throwError?: boolean
	): boolean {
		return this.hasPermissions([permission], throwError);
	}

	static hasPermissions(
		findPermissions: PermissionsEnum[],
		throwError?: boolean
	): boolean {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			// tslint:disable-next-line
			const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
				requestContext.request as any
			);

			if (token) {
				const { permissions } = verify(
					token,
					'jwt_secret'
					// environment.JWT_SECRET
				) as {
					id: string;
					permissions: PermissionsEnum[];
				};
				if (permissions) {
					const found = permissions.filter(
						(value) => findPermissions.indexOf(value) >= 0
					);

					if (found.length === findPermissions.length) {
						return true;
					}
				} else {
					return false;
				}
			}
		}

		if (throwError) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}
		return false;
	}

	static hasAnyPermission(
		findPermissions: PermissionsEnum[],
		throwError?: boolean
	): boolean {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			// tslint:disable-next-line
			const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
				requestContext.request as any
			);

			if (token) {
				const { permissions } = verify(
					token,
					'jwt_secret'
					// environment.JWT_SECRET
				) as {
					id: string;
					permissions: PermissionsEnum[];
				};
				const found = permissions.filter(
					(value) => findPermissions.indexOf(value) >= 0
				);
				if (found.length > 0) {
					return true;
				}
			}
		}

		if (throwError) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}
		return false;
	}

	static currentToken(throwError?: boolean): any {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			// tslint:disable-next-line
			return ExtractJwt.fromAuthHeaderAsBearerToken()(
				requestContext.request as any
			);
		}

		if (throwError) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}
		return null;
	}

	static hasRole(role: RolesEnum, throwError?: boolean): boolean {
		return this.hasRoles([role], throwError);
	}

	static hasRoles(roles: RolesEnum[], throwError?: boolean): boolean {
		const context = RequestContext.currentRequestContext();
		if (context) {
			try {
				const token = this.currentToken();
				if (token) {
					//  environment.JWT_SECRET
					const { role } = verify(token,'jwt_secret') as {
						id: string;
						role: RolesEnum;
					};
					return role ? roles.includes(role) : false;
				}
			} catch (error) {
				if (error instanceof JsonWebTokenError) {
					return false;
				} else {
					throw error;
				}
			}
		}
		if (throwError) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}
		return false;
	}
}
