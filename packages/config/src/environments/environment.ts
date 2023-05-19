import { IEnvironment } from '@everbyte/contracts';
import * as dotenv from 'dotenv';
dotenv.config();

export const environment: IEnvironment = {
	production: false,
	demo: false,

	port: parseInt(process.env.PORT, 10) || 3000,
	appUrl: process.env.APP_URL || 'http://localhost:3000',
	clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',

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
