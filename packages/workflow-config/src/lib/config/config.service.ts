import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { environment } from '../environments/environment';
import { RedisOptions } from 'ioredis';
import { IEnvironment } from '@everbyte/contracts';
import { IConfiguration } from '@everbyte/contracts';
import { getConfig } from './config-manager';

@Injectable()
export class ConfigService {
	private readonly environment: IEnvironment = environment;
	private readonly configs: IConfiguration;

	constructor() {
		this.configs = getConfig();
	}
	/**
	 * Get the  app port
	 */
	get port(): number {
		return Number(environment.port);
	}
	/**
	 * Get the app  url
	 */
	get appUrl(): string {
		return String(environment.appUrl);
	}

	get dataSourceOptions(): TypeOrmModuleOptions {
		return this.configs.dataSourceOptions;
	}
	get redisOptions(): RedisOptions {
		return this.configs.redisOptions;
	}

	isProd(): boolean {
		return this.environment.production;
	}
}
