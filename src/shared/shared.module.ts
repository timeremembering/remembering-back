import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configModuleOptions } from './configs/module-options';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppLoggerModule } from './logger/logger.module';



@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        ...(!process.env.DATABASE_URL
          ? {
              host: process.env.DB_HOST,
              port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null,
              database: process.env.DB_NAME,
              username: process.env.DB_USER,
              password: process.env.DB_PASS,
            }
          : { url: process.env.DATABASE_URL }),
        entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
        timezone: 'Z',
        ssl: process.env.APP_ENV === 'development' ||  process.env.APP_ENV === 'production' ,
        extra: (process.env.APP_ENV === 'development'|| process.env.APP_ENV === 'production')  && {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        synchronize: false,
        debug: configService.get<string>('env') === 'development',
      }),
    }),
    AppLoggerModule,
  ],
  exports: [AppLoggerModule, ConfigModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },

    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class SharedModule {}
