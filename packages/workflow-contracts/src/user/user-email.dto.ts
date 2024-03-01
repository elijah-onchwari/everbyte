import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { UserEmail } from '@everbyte/contracts';

/**
 * User email input DTO validation
 */
export class UserEmailDto implements UserEmail {
	/**
	 * Required: User's email
	 */
	@ApiProperty({ type: () => String, required: true })
	@IsNotEmpty()
	@IsEmail()
	@Transform((params: TransformFnParams) =>
		params.value ? params.value.trim() : null
	)
	readonly email: string;
}
