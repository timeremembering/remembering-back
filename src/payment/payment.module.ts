import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerCustomModule } from 'src/mailer/mailer.module';
import { AiGeneration } from 'src/tree/entities/ai-generation.entity';
import { Album } from 'src/tree/entities/album.entity';
import { Candle } from 'src/tree/entities/candle.entity';

import { FileManagerService } from '../file-manager/file-manager.service';
import { AppLogger } from '../shared/logger/logger.service';
import { AdditionalTreeSlots } from '../tree/entities/additional-tree-slots.entity';
import { Tree } from '../tree/entities/tree.entity';
import { TreeSlot } from '../tree/entities/tree-slot.entity';
import { TreeType } from '../tree/entities/tree-type.entity';
import { TreeTypePrice } from '../tree/entities/tree-type-price.entity';
import { TreeModule } from '../tree/tree.module';
import { TreeService } from '../tree/tree.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { AdditionalSlotsPricing } from './entities/additional-slots-pricing.entity';
import { CasketPricing } from './entities/casket-pricing.entity';
import { Transaction } from './entities/transaction.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ConfigModule,
    TreeModule,
    JwtModule,
    MailerCustomModule,
    TypeOrmModule.forFeature([
      Tree,
      TreeType,
      TreeTypePrice,
      Transaction,
      TreeSlot,
      Album,
      Candle,
      AdditionalTreeSlots,
      AdditionalSlotsPricing,
      CasketPricing,
      User,
      AiGeneration,
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    TreeService,
    UserService,
    FileManagerService,
    AppLogger,
  ],
})
export class PaymentModule {}
