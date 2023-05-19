import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ILogger } from './ILogger';
import { RedisOptions } from 'ioredis';

export interface IConfiguration {
	port: number;
	appUrl: string;
	dataSourceOptions: TypeOrmModuleOptions;
	redisOptions: RedisOptions;
	logger?: ILogger;
}
