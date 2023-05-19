import { ConfigModule, ConfigService } from '@everbyte/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './core/core.module';
import { EmailModule } from './modules/email/email.module';
import { LoggerModule } from './modules/logger/logger.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { UserCompanyModule } from './modules/user-company/user-company.module';
import { EmailTemplateModule } from './modules/email-template/email-template.module';
import { SharedModule } from './shared/shared.module';
import { CompanyModule } from './modules/company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
	imports: [
		ConfigModule,
		UserModule,
		AuthModule,
		CoreModule,
		EmailModule,
		LoggerModule,
		RoleModule,
		PermissionModule,
		RolePermissionModule,
		UserRoleModule,
		UserCompanyModule,
		EmailTemplateModule,
		SharedModule,
		CompanyModule,
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				console.log('[configService]', configService.dataSourceOptions);
				return configService.dataSourceOptions;
			},
			dataSourceFactory: async (options) => {
				return await new DataSource(options).initialize();
			}
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
