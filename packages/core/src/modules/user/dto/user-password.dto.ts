import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IUserPasswordInput } from '@everbyte/contracts';

/**
 * User password input DTO validation
 */
export class UserPasswordDTO implements IUserPasswordInput {
	@ApiProperty({ type: () => String, required: true })
	@IsNotEmpty()
	readonly password: string;
}
