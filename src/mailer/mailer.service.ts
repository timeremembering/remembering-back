import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerCustomService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(
    user: { name: string; email: string },
    lang: string,
  ) {
    const templatePath = `./payment/payment.${lang}.hbs`;

    await this.mailerService.sendMail({
      from: 'inforememberingt@gmail.com',
      to: user.email,
      subject: 'Remembering Time',
      template: templatePath,
      context: {
        name: user.name,
        language: lang,
      },
    });
  }

  async sendSupportEmail(user: {
    email: string;
    message: string;
    category: string;
  }) {
    const templatePath = `./support/support.hbs`;
    await this.mailerService.sendMail({
      from: 'inforememberingt@gmail.com',
      to: 'timeremembering@gmail.com',
      subject: 'Remembering Time Support',
      template: templatePath,
      context: user,
    });
  }

  async sendRegistrationEmail(data: {id: string, name: string; email: string, url: string}) {
    const templatePath = `./registration/registration.hbs`;
    
    await this.mailerService.sendMail({
      from: 'inforememberingt@gmail.com',
      to: data.email,
      subject: 'Remembering Time',
      template: templatePath,
      context: data,
    });
  }

  async sendForgotPasswordEmail(data: {
    email: string;
    name: string;
    token: string;
    url: string;
  }) {
    const templatePath = `./forgot-password/forgot-password.hbs`;
    await this.mailerService.sendMail({
      from: 'inforememberingt@gmail.com',
      to: data.email,
      subject: 'Remembering Time',
      template: templatePath,
      context: data,
    });
  }
}
