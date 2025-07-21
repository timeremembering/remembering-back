import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { MailerCustomService } from 'src/mailer/mailer.service';
import { AdditionalSlotsPricing } from 'src/payment/entities/additional-slots-pricing.entity';
import { CasketPricing } from 'src/payment/entities/casket-pricing.entity';
import { Transaction } from 'src/payment/entities/transaction.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { PaymentService } from 'src/payment/payment.service';
import { AdditionalTreeSlots } from 'src/tree/entities/additional-tree-slots.entity';
import { AiGeneration } from 'src/tree/entities/ai-generation.entity';
import { Album } from 'src/tree/entities/album.entity';
import { Candle } from 'src/tree/entities/candle.entity';
import { Tree } from 'src/tree/entities/tree.entity';
import { TreeSlot } from 'src/tree/entities/tree-slot.entity';
import { TreeType } from 'src/tree/entities/tree-type.entity';
import { TreeTypePrice } from 'src/tree/entities/tree-type-price.entity';
import { TreeService } from 'src/tree/tree.service';

import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { STRATEGY_JWT_AUTH } from './constants/strategy.constant';
import { AuthController } from './controllers/auth.controller';
import { Tokens } from './entities/tokens.entity';
import { AuthService } from './services/auth.service';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH }),
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('jwt.publicKey'),
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          algorithm: 'RS256',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PaymentModule,
    TypeOrmModule.forFeature([
      Tokens,
      Transaction,
      AdditionalSlotsPricing,
      CasketPricing,
      AiGeneration,
      Tree,
      Album,
      Candle,
      TreeType,
      TreeTypePrice,
      TreeSlot,
      AdditionalTreeSlots,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    PaymentService,
    TreeService,
    MailerCustomService,
    FileManagerService,
  ],
})
export class AuthModule {}
