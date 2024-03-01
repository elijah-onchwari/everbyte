import { IEnvironment } from '@everbyte/contracts';
import dotenv from 'dotenv';
dotenv.config();

export const environment: IEnvironment = {
	production: true,
	demo: false,

	port: parseInt(process.env.PORT, 10) || 3000,
	appUrl: process.env.APP_URL,
	clientUrl: process.env.CLIENT_URL,

	jwtSecret: process.env.JWT_SECRET || 'secretKey',
	jwtTokenExpirationTime:
		parseInt(process.env.JWT_TOKEN_EXPIRATION_TIME) || 86400 * 1, // default JWT token expire time (1 day)

	jwtRefreshTokenSecret:
		process.env.JWT_REFRESH_TOKEN_SECRET || 'refreshSecretKey',
	jwtRefreshTokenExpirationTime:
		parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) || 86400 * 7, // default JWT refresh token expire time (7 days)

	/**
	 * Email verification options
	 */
	jwtVerificationTokenSecret:
		process.env.JWT_VERIFICATION_TOKEN_SECRET || 'verificationSecretKey',
	jwtVerificationTokenExpirationTime:
		parseInt(process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME) ||
		86400 * 7, // default verification expire token time (7 days)

	/**
	 * Email Reset
	 */
	jwtEmailResetExpirationTime:
		parseInt(process.env.EMAIL_RESET_EXPIRATION_TIME) || 1800, // default email reset expiration time (30 minutes)
	saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 12,

	email: {
		host: process.env.EMAIL_HOST,
		port: parseInt(process.env.EMAIL_PORT, 10) || 587,
		secure: Boolean(process.env.EMAIL_SECURE),
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		},
		fromAddress: process.env.EMAIL_FROM
	}
};
