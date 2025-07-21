import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { MailerCustomService } from './mailer.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
          imports: [ConfigModule], 
          useFactory: async (configService: ConfigService) => ({
            transport: {
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: configService.get<string>('MAIL_USER'),
                pass: configService.get<string>('MAIL_PASS'),
              },
            },
            defaults: {
              from: '"No Reply" <no-reply@example.com>',
            },
            template: {
              dir: join(__dirname.replace('/dist', ''), 'templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
          inject: [ConfigService], 
        }),
      ],
      providers: [MailerCustomService],
      exports: [MailerCustomService],
})
export class MailerCustomModule {}
