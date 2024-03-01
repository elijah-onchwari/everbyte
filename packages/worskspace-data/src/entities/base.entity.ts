import { IBase } from '@everbyte/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

export abstract class Model {
	constructor(intialData: Partial<Model> = null) {
		if (intialData !== null) {
			Object.assign(this, intialData);
		}
	}
}
export abstract class BaseEntity extends Model implements IBase {
	@ApiPropertyOptional({ type: () => String })
	@PrimaryGeneratedColumn('uuid')
	id?: string;

	@ApiProperty({ type: () => String })
	@CreateDateColumn()
	createdAt?: Date;

	@ApiProperty({ type: () => String })
	@UpdateDateColumn()
	updatedAt?: Date;

	@ApiPropertyOptional({ type: Boolean, default: true })
	@IsBoolean()
	@Index()
	@Column({ type: 'boolean', default: true })
	active?: boolean;
}
