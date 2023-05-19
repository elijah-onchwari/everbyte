import { IBaseEntity } from './base.interface';
import { IUserCompany } from './user-company.interface';

export interface IUser extends IBaseEntity {
	firstName: string;
	lastName: string;
	fullName?: string;
	email: string;
	mobile: string;
	isActive?: boolean;
	companyId?: string;
	companies?: IUserCompany[];
}

export interface IBaseRelationsEntity {
	readonly relations?: string[];
}

export interface IUserFindInput extends IBaseEntity {
	firstName?: string;
	lastName?: string;
	email?: string;
	mobile?: string;
}

export interface IUserRegistrationInput extends Partial<IUser> {
	password?: string;
	confirmPassword?: string;
	inviteId?: string;
}

/**
 * email verfication token payload
 */
export interface IVerificationTokenPayload extends IUserEmailInput {
	id: string;
}

export interface IUserInviteCodeConfirmationInput
	extends IUserEmailInput,
		IUserCodeInput {}

export interface IUserEmailInput {
	email: string;
}

export interface IUserPasswordInput {
	password: string;
}

export interface IUserTokenInput {
	token: string;
}

export interface IUserCodeInput {
	code: number;
}

export interface IUserLoginInput extends IUserEmailInput, IUserPasswordInput {}

export interface IAuthResponse {
	user: IUser;
	token: string;
	refresh_token?: string;
}
export interface IUserCreateInput {
	firstName?: string;
	lastName?: string;
	email?: string;
	mobileNo?: string;
}

export interface IUserUpdateInput extends IUserCreateInput {
	id?: string;
}

export enum ProviderEnum {
	GOOGLE = 'google',
	FACEBOOK = 'facebook'
}

export interface IUserViewModel extends IBaseEntity {
	fullName: string;
	email: string;
	mobile: string;
	companyId?: string;
}
