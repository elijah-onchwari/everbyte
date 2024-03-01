import { IUserUpdateInput } from '@everbyte/contracts';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

/**
 * Update User DTO validation
 */
export class UpdateUserDTO
	extends PartialType(OmitType(CreateUserDTO, ['email'] as const))
	implements IUserUpdateInput
{
	@ApiPropertyOptional({ type: () => Boolean })
	@IsOptional()
	@IsBoolean()
	readonly active: boolean;
}
