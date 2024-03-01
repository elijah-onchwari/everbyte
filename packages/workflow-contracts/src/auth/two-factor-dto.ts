import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { UserCode, UserEmail, UserToken } from '@everbyte/contracts';
import {
	UserCodeDTO,
	UserEmailDto,
	UserTokenDto
} from '../../../core/src/modules/user/dto';

/**
 *
 */
export class WorkspaceSigninEmailVerifyDTO
	extends IntersectionType(UserEmailDto, UserCodeDTO)
	implements UserEmail, UserCode
{
	@ApiPropertyOptional({ type: () => Boolean })
	@IsOptional()
	@IsBoolean()
	readonly includeTeams: boolean;
}

/**
 *
 */
export class WorkspaceSigninDTO
	extends IntersectionType(UserEmailDto, UserTokenDto)
	implements UserEmail, UserToken
{
	token: string;
	email: string;
}
