import { UserCode } from '@everbyte/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
// import { CustomLength } from '@everbyte/shared';

/**
 * User code input DTO validation
 */
export class UserCodeDTO implements UserCode {
	@ApiProperty({ type: () => Number })
	@IsNumber()
	// @CustomLength(6)
	readonly code: number;
}
