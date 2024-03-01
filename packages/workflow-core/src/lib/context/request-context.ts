import { HttpException, HttpStatus } from '@nestjs/common';
import * as cls from 'cls-hooked';
import { Request, Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { SerializedRequestContext } from './types';
import { IUser, UserPermission, UserRole } from '@everbyte/contracts';
import { env } from 'process';

export class RequestContext {
	protected readonly _id: number;
	protected readonly _res: Response;
	private readonly _req: Request;

	/**
	 * Constructor for the SampleClass.
	 * @param options - An object containing optional parameters for initializing the instance.
	 * @param options.id - Optional ID number for the instance. If not provided, a random ID is generated.
	 * @param options.req - Optional Request object.
	 * @param options.res - Optional Response object.
	 */
	constructor(options: {
		id?: number;
		req?: Request;
		res?: Response;
		isAuthorized?: boolean;
	}) {
		// Destructure options to extract individual properties.
		const { req, res, id } = options;

		// If 'id' is not provided, generate a random ID.
		this._id = id || Date.now();

		// Assign values to instance properties.
		this._req = req;
		this._res = res;
	}

	/**
	 *
	 * @param ctx
	 * @returns
	 */
	static deserialize(ctxObject: SerializedRequestContext): RequestContext {
		return new RequestContext({
			req: ctxObject._req
		});
	}

	/**
	 * Creates a shallow copy of the current instance of the RequestContext class.
	 * @returns A new instance of RequestContext with the same property values as the original.
	 */
	copy(): RequestContext {
		// Create a new object with the same prototype as the current instance
		// and copy the properties of the current instance to the new object
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	}

	/**
	 *
	 * @returns
	 */
	static currentRequestContext(): RequestContext {
		const session = cls.getNamespace(RequestContext.name);
		if (session && session.active) {
			return session.get(RequestContext.name);
		}
		return null;
	}

	/**
	 *
	 * @returns
	 */
	static currentRequest(): Request {
		const requestContext = RequestContext.currentRequestContext();
		if (requestContext) {
			return requestContext._req;
		}
		return null;
	}

	/**
	 *
	 * @returns
	 */
	static currentRequestId(): number | null {
		const requestContext = RequestContext.currentRequestContext();
		if (requestContext) {
			return requestContext._id;
		}
		return null;
	}

	/**
	 *
	 * @returns
	 */
	static currentCompanyId(): string {
		try {
			const user: IUser = RequestContext.currentUser();
			return user.companyId;
		} catch (error) {
			return null;
		}
	}

	/**
	 *
	 * @returns
	 */
	static currentUserId(): string {
		try {
			const user: IUser = RequestContext.currentUser();
			if (user) {
				return user.id;
			}
			return null;
		} catch (error) {
			return null;
		}
	}

	/**
	 *
	 * @returns
	 */
	static currentRoleId(): string {
		try {
			const user: IUser = RequestContext.currentUser();
			if (user) {
				// return user.roleId;
			}
			return null;
		} catch (error) {
			return null;
		}
	}

	/**
	 *
	 * @param throwError
	 * @returns
	 */
	static currentUser(throwError?: boolean): IUser {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			// tslint:disable-next-line
			const user: IUser = requestContext._req['user'];

			if (user) {
				return user;
			}
		}

		if (throwError) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		return null;
	}

	/**
	 *
	 * @param permission
	 * @param throwError
	 * @returns
	 */
	static hasPermission(
		permission: UserPermission,
		throwError?: boolean
	): boolean {
		return this.hasPermissions([permission], throwError);
	}

	static hasPermissions(
		findPermissions: UserPermission[],
		throwError?: boolean
	): boolean {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			try {
				// tslint:disable-next-line
				const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
					requestContext._req as any
				);

				if (token) {
					const { permissions } = verify(token, env.JWT_SECRET) as {
						id: string;
						permissions: UserPermission[];
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
			} catch (error) {
				// Do nothing here, we throw below anyway if needed
				console.log(error);
			}
		}

		if (throwError) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		return false;
	}

	static hasAnyPermission(
		findPermissions: UserPermission[],
		throwError?: boolean
	): boolean {
		const requestContext = RequestContext.currentRequestContext();

		if (requestContext) {
			try {
				// tslint:disable-next-line
				const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
					requestContext._req as any
				);

				if (token) {
					const { permissions } = verify(token, env.JWT_SECRET) as {
						id: string;
						permissions: UserPermission[];
					};
					const found = permissions.filter(
						(value) => findPermissions.indexOf(value) >= 0
					);
					if (found.length > 0) {
						return true;
					}
				}
			} catch (error) {
				// Do nothing here, we throw below anyway if needed
				console.log(error);
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
			try {
				// tslint:disable-next-line
				return ExtractJwt.fromAuthHeaderAsBearerToken()(
					requestContext._req as any
				);
			} catch (error) {
				// Do nothing here, we throw below anyway if needed
				console.log(error);
			}
		}

		if (throwError) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		return null;
	}

	static hasRole(role: UserRole, throwError?: boolean): boolean {
		return this.hasRoles([role], throwError);
	}

	static hasRoles(roles: UserRole[], throwError?: boolean): boolean {
		const context = RequestContext.currentRequestContext();
		if (context) {
			try {
				const token = this.currentToken();
				if (token) {
					const { role } = verify(token, env.JWT_SECRET) as {
						id: string;
						role: UserRole;
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
