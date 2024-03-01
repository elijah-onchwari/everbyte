import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IUserCompany, IUser, Company as ICompany } from '@everbyte/contracts';
import { User } from './user.entity';
import { Company } from './company.entity';
@Entity('user_companies')
export class UserCompany implements IUserCompany {
	@ApiProperty({ type: () => Boolean, default: true })
	@Index()
	@Column({ type: 'boolean', name: 'is_default', default: true })
	isDefault: boolean;

	@ApiProperty({ type: () => Boolean, default: true })
	@Index()
	@Column({ type: 'boolean', name: 'is_active', default: true })
	isActive: boolean;

	@PrimaryColumn({ type: 'uuid', name: 'user_id' })
	userId: string;

	@PrimaryColumn({ type: 'uuid', name: 'company_id' })
	companyId: string;
	/*
    |--------------------------------------------------------------------------
    | @ManyToOne
    |--------------------------------------------------------------------------
    */

	/**
	 * User
	 */

	@ManyToOne(() => User, (user) => user.companies, {
		nullable: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user?: IUser;

	@ManyToOne(() => Company, (company) => company.users, {
		nullable: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
	company?: ICompany;
}
