import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserPassword } from '@everbyte/contracts';

/**
 * User password input DTO validation
 */
export class UserPasswordDto implements UserPassword {
	@ApiProperty({ type: () => String, required: true })
	@IsNotEmpty()
	readonly password: string;
}
