import { ICompany } from './company.interface';
import { IUser } from './user.interface';

export interface IUserCompany {
	isDefault: boolean;
	isActive: boolean;
	userId: string;
	companyId: string;
	user?: IUser;
	company?: ICompany;
}
