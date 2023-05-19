import { IBaseEntity } from '@everbyte/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	CreateDateColumn,
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
export abstract class BaseEntity extends Model implements IBaseEntity {
	@ApiPropertyOptional({ type: () => String })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ type: () => String })
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty({ type: () => String })
	@UpdateDateColumn()
	updatedAt: Date;
}
