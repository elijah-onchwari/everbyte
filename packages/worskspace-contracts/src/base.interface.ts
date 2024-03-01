import { Company } from "./company.interface";

export interface HasRelations {
	readonly relations?: string[];
}

export interface SoftDeletable {
	deletedAt?: Date;
}

export interface IBase extends SoftDeletable {
	id?: string;
	active?: boolean;
	readonly createdAt?: Date;
	readonly updatedAt?: Date;
}

export interface CompanyContext extends IBase {
	companyId?: Company['id'];
	company?: Company;
}

export interface PaginationParams {
	limit?: number;
	page?: number;
}

/**
 * Select find options for specific entity.
 * Property paths (column names) to be selected by "find".
 */
export type IOptionsSelect<T> = {
	[P in keyof T]?: NonNullable<T[P]> | boolean;
};

/**
 * Generic pagination interface
 */
export interface IPagination<T> {
	/**
	 * Items included in the current listing
	 */
	readonly items: T[];

	/**
	 * Total number of available items
	 */
	readonly total: number;
}

/*
 * Common query parameter
 */
export interface IListQueryInput<T> {
	/**
	 * Model entity defined relations
	 */
	readonly relations?: string[];
	readonly findInput?: T | any;
	readonly where?: any;
}
