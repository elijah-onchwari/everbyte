import { IUserCompany } from './user-company.interface';
import { IBase } from './base.interface';
export interface Company extends IBase {
	name: string;
	users: IUserCompany[];
}
