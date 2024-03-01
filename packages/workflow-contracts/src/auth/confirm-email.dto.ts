/**
 * Email confirmation (By TOKEN) DTO request validation
 */
export class ConfirmEmailByTokenDTO
	extends IntersectionType(UserEmailDto, UserTokenDto)
	implements UserEmail, UserToken {}

/**
 * Email confirmation (By CODE) DTO request validation
 */
export class ConfirmEmailByCodeDTO
	extends IntersectionType(UserEmailDto, UserCodeDTO)
	implements UserEmail, UserCode, CompanyContext
{
	@ApiProperty({ type: () => String })
	@IsNotEmpty()
	@IsUUID()
	readonly companyId: Company['id'];
}
