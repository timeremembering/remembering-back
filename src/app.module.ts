import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { MailerCustomModule } from './mailer/mailer.module';
import { PaymentModule } from './payment/payment.module';
import { ReferralModule } from './referral/referral.module';
import { SharedModule } from './shared/shared.module';
import { TreeModule } from './tree/tree.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MailerCustomModule,
    SharedModule,
    UserModule,
    AuthModule,
    TreeModule,
    FileManagerModule,
    ReferralModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
