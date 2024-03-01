import { UserToken } from '@everbyte/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * User token input DTO validation
 */
export class UserTokenDto implements UserToken {
	@ApiProperty({ type: () => String, required: true })
	@IsNotEmpty()
	@IsString()
	@Transform((params: TransformFnParams) =>
		params.value ? params.value.trim() : null
	)
	readonly token: string;
}
