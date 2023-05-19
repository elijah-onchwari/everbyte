import { BaseEntity,UserCompany } from '@database/entities/internal';
import { IUser, IUserCompany } from '@everbyte/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity implements IUser {
	@ApiProperty({ type: () => String })
	@Index()
	@Column({ type: 'varchar', name: 'first_name' })
	firstName: string;

	@ApiProperty({ type: () => String })
	@Index()
	@Column({ type: 'varchar', name: 'last_name' })
	lastName: string;

	@ApiProperty({ type: () => String })
	@Index({ unique: true })
	@Column({ type: 'varchar', name: 'email' })
	email: string;

	@ApiProperty({ type: () => String })
	@Index()
	@Column({ type: 'varchar', name: 'mobile' })
	mobile: string;

	@ApiProperty({ type: () => Boolean })
	@Index()
	@Column({ type: 'boolean', name: 'is_active', default: true })
	isActive?: boolean;

	fullName?: string;
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
	companies?: IUserCompany[];
}
