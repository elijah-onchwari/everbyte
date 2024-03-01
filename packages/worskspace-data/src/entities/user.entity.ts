import { IUser, IUserCompany } from '@everbyte/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { UserCompany } from './user-company.entity';

@Entity('users')
export class User extends BaseEntity implements IUser {
	@ApiProperty({ type: () => String })
	@IsOptional()
	@IsString()
	@Index()
	@Column({ type: 'varchar', name: 'first_name' })
	firstName: string;

	@ApiProperty({ type: () => String })
	@IsOptional()
	@IsString()
	@Index()
	@Column({ type: 'varchar', name: 'last_name' })
	lastName: string;

	@ApiProperty({ type: () => String })
	@IsOptional()
	@IsEmail()
	@Index({ unique: true })
	@Column({ type: 'varchar' })
	email: string;

	@ApiProperty({ type: () => String })
	@IsOptional()
	@IsString()
	@Index({ unique: true })
	@Column({ type: 'varchar', name: 'mobile_number', length: 20 })
	mobileNumber: string;

	fullName?: string;
	companyId?: string;
	company?: Company;
	hash?: string;
	/*
	|--------------------------------------------------------------------------
	| @OneToMany
	|--------------------------------------------------------------------------
	*/

	/**
	 * User companies
	 */
	@ApiProperty({ type: () => User, isArray: true })
	@OneToMany(() => UserCompany, (userCompany) => userCompany.user, {
		cascade: true
	})
	@JoinColumn()
	companies?: UserCompany[];
}
