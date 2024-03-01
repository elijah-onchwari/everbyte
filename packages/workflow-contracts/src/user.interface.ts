import { IBase, CompanyContext } from './base.interface';

export interface IUser extends CompanyContext {
	email: string;
	mobileNumber: string;
	firstName: string;
	lastName: string;
	fullName?: string;
}

export interface IUserFindInput extends IBase {
	firstName?: string;
	lastName?: string;
	email?: string;
	mobile?: string;
}

export interface SignUpRequest {
	user: IUser;
	password?: string;
	confirmPassword?: string;
	originalUrl?: string;
	createdById?: string;
}

export interface SignInRequest extends UserEmail, UserPassword {}

export interface IVerificationTokenPayload extends UserEmail {
	id: string;
}

export interface IUserInviteCodeConfirmationInput extends UserEmail, UserCode {}

export interface UserEmail {
	email: string;
}

export interface UserPassword {
	password: string;
}

export interface UserToken {
	token: string;
}

export interface UserCode {
	code: number;
}

export interface AuthResponse {
	user: IUser;
	token: string;
	refresh_token?: string;
}
export interface IUserCreateInput {
	email: string;
	mobileNumber: string;
	firstName?: string;
	lastName?: string;
}

export interface IUserUpdateInput
	extends Omit<IUserCreateInput, 'email' | 'mobileNumber'> {
	email?: string;
	mobileNumber?: string;
}

export interface IUserViewModel extends IBase {
	fullName: string;
	email: string;
	mobile: string;
	companyId?: string;
}

export enum AuthProvider {
	GOOGLE = 'google',
	FACEBOOK = 'facebook'
}
