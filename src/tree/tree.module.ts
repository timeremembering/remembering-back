import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user.service';

import { FileManagerModule } from '../file-manager/file-manager.module';
import { FileManagerService } from '../file-manager/file-manager.service';
import { AppLogger } from '../shared/logger/logger.service';
import { UserModule } from '../user/user.module';
import { AdditionalTreeSlots } from './entities/additional-tree-slots.entity';
import { AiGeneration } from './entities/ai-generation.entity';
import { Album } from './entities/album.entity';
import { Candle } from './entities/candle.entity';
import { Tree } from './entities/tree.entity';
import { TreeSlot } from './entities/tree-slot.entity';
import { TreeType } from './entities/tree-type.entity';
import { TreeTypePrice } from './entities/tree-type-price.entity';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tree,
      TreeType,
      TreeTypePrice,
      AdditionalTreeSlots,
      TreeSlot,
      Album,
      Candle,
      AiGeneration,
    ]),
    forwardRef(() => UserModule),
    FileManagerModule,
    ConfigModule,
  ],
  controllers: [TreeController],
  providers: [TreeService, FileManagerService, AppLogger],
  exports: [TreeService],
})
export class TreeModule {}
