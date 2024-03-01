import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { IUserCreateInput } from '@everbyte/contracts';
import { UserEmailDto } from './user-email.dto';

/**
 * Create User DTO validation
 */
export class CreateUserDTO extends UserEmailDto implements IUserCreateInput {
	/**
	 * Optional: User's first name.
	 */
	@ApiPropertyOptional({ type: () => String })
	@ApiPropertyOptional()
	@IsOptional()
	@Transform((params: TransformFnParams) =>
		params.value ? params.value.trim() : null
	)
	readonly firstName: string;

	/**
	 * Optional: User's last name.
	 */
	@ApiProperty({ type: () => String })
	@ApiPropertyOptional()
	@IsOptional()
	@Transform((params: TransformFnParams) =>
		params.value ? params.value.trim() : null
	)
	readonly lastName: string;

	/**
	 * Required: User's mobile number
	 */
	@ApiProperty({ type: () => String })
	@IsNotEmpty()
	@Transform((params: TransformFnParams) =>
		params.value ? params.value.trim() : null
	)
	readonly mobileNumber: string;
}
