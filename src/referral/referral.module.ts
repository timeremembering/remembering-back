import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { Referral } from './entities/referral.entity';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';

@Module({
  imports: [TypeOrmModule.forFeature([Referral]), UserModule],
  controllers: [ReferralController],
  providers: [ReferralService],
})
export class ReferralModule {}
