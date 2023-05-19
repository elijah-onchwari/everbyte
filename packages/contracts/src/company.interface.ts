import { IUserCompany } from './user-company.interface';
import { IBaseEntity } from './base.interface';
export interface ICompany extends IBaseEntity {
	name: string;
	users: IUserCompany[];
}
