import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProvider } from 'src/common/providers/auth.provider';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { MailerCustomModule } from 'src/mailer/mailer.module';
import { AdditionalTreeSlots } from 'src/tree/entities/additional-tree-slots.entity';
import { AiGeneration } from 'src/tree/entities/ai-generation.entity';
import { Album } from 'src/tree/entities/album.entity';
import { Candle } from 'src/tree/entities/candle.entity';
import { TreeSlot } from 'src/tree/entities/tree-slot.entity';
import { TreeType } from 'src/tree/entities/tree-type.entity';
import { TreeTypePrice } from 'src/tree/entities/tree-type-price.entity';
import { TreeModule } from 'src/tree/tree.module';
import { Tree } from 'typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserAclService } from './services/user-acl.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      User,
      Tree,
      TreeType,
      TreeTypePrice,
      AdditionalTreeSlots,
      TreeSlot,
      Album,
      Candle,
      AiGeneration,
    ]),
    ConfigModule,
    MailerCustomModule,
    forwardRef(() => TreeModule),
  ],
  providers: [
    UserService,
    JwtAuthStrategy,
    UserAclService,
    UserRepository,
    AuthProvider,
    FileManagerService
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
