import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNotEmptyObject,
	IsObject,
	MinLength,
	ValidateNested
} from 'class-validator';
import { SignUpRequest } from '@everbyte/contracts';
// import { Match } from '@everbyte/shared';
import { CreateUserDTO } from './create-user.dto';
import { Type } from 'class-transformer';

/**
 * Register User DTO validation
 */

export class RegisterUserDTO implements SignUpRequest {
	@ApiProperty({ type: () => String, required: true })
	@IsNotEmpty({ message: 'Password should not be empty' })
	@MinLength(4, {
		message: 'Password should be at least 4 characters long.'
	})
	readonly password: string;

	@ApiProperty({ type: () => String, required: true })
	@IsNotEmpty({ message: 'Confirm password should not be empty' })
	// @Match(RegisterUserDTO, (it) => it.password, {
	// 	message: 'The password and confirmation password must match.'
	// })
	readonly confirmPassword: string;

	@ApiProperty({ type: () => CreateUserDTO })
	@IsObject()
	@IsNotEmptyObject()
	@IsNotEmpty({ message: 'User should not be empty' })
	@ValidateNested()
	@Type(() => CreateUserDTO)
	readonly user: CreateUserDTO;
}
