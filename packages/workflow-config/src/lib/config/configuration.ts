import * as dotenv from 'dotenv';
dotenv.config();
import { IConfiguration } from '@everbyte/contracts';

/**
 *  configurations.
 */
export const initialConfiguration: IConfiguration = {
	port: parseInt(process.env.PORT, 10) || 3000,
	appUrl: process.env.APP_URL || 'http://localhost:3000',
	dataSourceOptions: {
		type: 'postgres',
		host: process.env.TYPEORM_HOST || 'localhost',
		username: process.env.TYPEORM_USERNAME || 'postgres',
		password: process.env.TYPEORM_PASSWORD || 'postgres',
		database: process.env.TYPEORM_DATABASE || 'everbyte',
		port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
		logging: 'all',
		logger: 'file',
		synchronize: false,
		uuidExtension: 'pgcrypto',
	},
	redisOptions: {
		host: process.env.REDIS_HOST || 'localhost',
		port: parseInt(process.env.REDIS_PORT, 10) || 6379,
		db: parseInt(process.env.REDIS_DATABASE, 10) || 0
	}
};
