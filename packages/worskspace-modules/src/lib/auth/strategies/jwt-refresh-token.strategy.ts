import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { UserService } from './../../user/user.service';
import { environment } from '@everbyte/config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh-token'
) {
	constructor(private readonly userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
			// secretOrKey: environment.JWT_REFRESH_TOKEN_SECRET,
			secretOrKey: environment.jwtRefreshTokenSecret,
			passReqToCallback: true,
			ignoreExpiration: false
		});
	}

	async validate(request: Request, payload: JwtPayload, done: Function) {
		try {
			const { body } = request;
			const refresh_token = body.refresh_token;

			const user = await this.userService.getUserIfRefreshTokenMatches(
				refresh_token,
				payload
			);
			if (!user) {
				return done(new UnauthorizedException('unauthorized'), false);
			} else {
				done(null, user);
			}
		} catch (err) {
			return done(
				new UnauthorizedException('unauthorized', err.message),
				false
			);
		}
	}
}
