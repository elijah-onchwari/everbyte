import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@everbyte/config';
import {
  UserModule,
  CompanyModule,
  AuthModule,
  EmailModule,
  EmailTemplateModule,
  LoggerModule,
  PermissionModule,
  RoleModule,
  RolePermissionModule,
  UserCompanyModule,
  UserRoleModule,
} from '@everbyte/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CoreModule } from '@everbyte/core';

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
    // SharedModule,
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
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
  ],
})
export class AppModule {}
