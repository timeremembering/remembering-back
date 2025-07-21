import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { errorMessages } from '../common/constants/error';
import { FileManagerService } from '../file-manager/file-manager.service';
import { RequestContext } from '../shared/request-context/request-context.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { CreateCandleDto } from './dto/create-candle.dto';
import { CreateTreeDto } from './dto/create-tree.dto';
import {
  CreateTreeSlotDto,
  UpdateTreeSlotDto,
} from './dto/create-tree-slot.dto';
import { CreateTreeTypeDto } from './dto/create-tree-type.dto';
import { UpdateCandleDto } from './dto/update-candle.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { UpdateTreeSlotCommentDto } from './dto/update-tree-slot-comment.dto';
import { UpdateTreeTypeDto } from './dto/update-tree-type.dto';
import { AdditionalTreeSlots } from './entities/additional-tree-slots.entity';
import { AiGeneration } from './entities/ai-generation.entity';
import { Album } from './entities/album.entity';
import { Candle } from './entities/candle.entity';
import { Tree } from './entities/tree.entity';
import { TreeSlot } from './entities/tree-slot.entity';
import { TreeType } from './entities/tree-type.entity';
import { TreeTypePrice } from './entities/tree-type-price.entity';
import { treeTypesConstant } from './tree.constants';
import { TreeFileType } from './tree.types';

@Injectable()
export class TreeService {
  constructor(
    @InjectRepository(AiGeneration)
    protected readonly aiGenerationRepository: Repository<AiGeneration>,
    @InjectRepository(Tree)
    protected readonly treeRepository: Repository<Tree>,
    @InjectRepository(Album)
    protected readonly albumRepository: Repository<Album>,
    @InjectRepository(Candle)
    protected readonly candleRepository: Repository<Candle>,
    @InjectRepository(TreeType)
    protected readonly treeTypeRepository: Repository<TreeType>,
    @InjectRepository(TreeTypePrice)
    protected readonly treeTypePriceRepository: Repository<TreeTypePrice>,
    @InjectRepository(TreeSlot)
    protected readonly treeSlotRepository: Repository<TreeSlot>,
    @InjectRepository(AdditionalTreeSlots)
    protected readonly additionalTreeSlotRepository: Repository<AdditionalTreeSlots>,
    @Inject(forwardRef(() => UserService))
    protected readonly userService: UserService,
    protected readonly fileManagerService: FileManagerService,
  ) {}

  public async getAllUserTree(userId: string): Promise<Tree[]> {
    const currentUser: User = await this.userService.getUserById(userId);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    return await this.treeRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        type: true,
      },
    });
  }

  public async getAllUsersTree(ctx, limit, offset): Promise<Tree[]> {
    const currentUser = await this.userService.getUsers(ctx, limit, offset);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    return await this.treeRepository.find({
      relations: {
        type: true,
      },
    });
  }

  public async createTree(treeInfo: CreateTreeDto): Promise<Tree> {
    const { tree_type_id, user_id, ...rest } = treeInfo;

    const currentUser: User = await this.userService.getUserById(user_id);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const currentTreeType: TreeType = await this.treeTypeRepository.findOneBy({
      id: tree_type_id,
    });

    if (!currentTreeType) {
      throw new NotFoundException(errorMessages.TREE_TYPE_NOT_EXIST);
    }

    const newTree: Tree = this.treeRepository.create({
      user: currentUser,
      type: currentTreeType,
      available_slot:
        currentTreeType.photo_limit +
        currentTreeType.video_limit +
        currentTreeType.audio_limit,
      full_name: `${treeInfo.first_name} ${treeInfo.last_name}`,
      ...rest,
    });

    return await this.treeRepository.save(newTree);
  }

  async createAdditionalTree(user_id: string) {
    const tree_type = await this.treeTypeRepository.find({
      order: {
        id: 'ASC',
      },
      take: 1,
    });
    const user = await this.userService.getUserById(user_id);
    const first_name = 'New';
    const last_name = 'Tree';
    const full_name = `${first_name} ${last_name}`;
    const tree = this.treeRepository.create({
      type: tree_type[0],
      user: user,
      first_name,
      last_name,
      full_name,
      available_slot:
        tree_type[0].photo_limit +
        tree_type[0].video_limit +
        tree_type[0].audio_limit,
    });
    return await this.treeRepository.save(tree);
  }

  public async initTreeTypes(): Promise<void> {
    const allTypes: TreeType[] = await this.treeTypeRepository.find();

    if (allTypes.length >= 3) {
      return;
    }

    const promises: Promise<TreeType>[] = treeTypesConstant.map((type) => {
      return this.treeTypeRepository.save(type);
    });

    const typesArray: TreeType[] = await Promise.all(promises);

    let pricePromises = [];

    typesArray.forEach((type) => {
      const currentPriceList = treeTypesConstant.find(
        (el) => el.name === type.name,
      );

      pricePromises = [
        ...pricePromises,
        ...currentPriceList.price_list.map((item) => {
          return this.treeTypePriceRepository.save({
            price: item.price,
            currency: item.currency,
            tree_type: type,
          });
        }),
      ];
    });

    await Promise.all(pricePromises);
  }

  public async updateTree(
    ctx: RequestContext,
    userId: string,
    treeId: string,
    treeInfo: UpdateTreeDto,
    file: Express.Multer.File,
  ): Promise<Tree> {
    const currentUser: User = await this.userService.getUserById(userId);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const currentTree: Tree = await this.treeRepository.findOne({
      where: {
        id: treeId,
      },
      relations: {
        user: true,
      },
    });

    console.log(file);

    if (!currentTree) {
      throw new NotFoundException(errorMessages.TREE_NOT_EXIST);
    }

    if (file) {
      const avatar: string = await this.fileManagerService.upload(file, ctx);

      return await this.treeRepository.save({
        ...currentTree,
        ...treeInfo,
        avatar,
      });
    }

    console.log(treeInfo);

    return await this.treeRepository.save({ ...currentTree, ...treeInfo });
  }

  public async getAllTreeTypes(): Promise<TreeType[]> {
    return await this.treeTypeRepository.find({
      relations: {
        price_list: true,
      },
    });
  }

  public async createTreeType(
    treeTypeInfo: CreateTreeTypeDto,
  ): Promise<TreeType> {
    const createdTreeType: TreeType =
      this.treeTypeRepository.create(treeTypeInfo);

    const newTreeType = await this.treeTypeRepository.save(createdTreeType);

    const promises = treeTypeInfo.price_list.map((el) =>
      this.treeTypePriceRepository.save({
        tree_type: newTreeType,
        price: el.price,
        currency: el.currency,
      }),
    );

    const price_list = await Promise.all(promises);

    return {
      ...newTreeType,
      price_list: price_list.map((el) => {
        delete el.tree_type;

        return el;
      }),
    };
  }

  public async updateTreeType(
    treeTypeId: string,
    treeTypeInfo: UpdateTreeTypeDto,
  ): Promise<TreeType> {
    const currentTreeType: TreeType = await this.treeTypeRepository.findOneBy({
      id: treeTypeId,
    });

    if (!currentTreeType) {
      throw new NotFoundException(errorMessages.TREE_TYPE_NOT_EXIST);
    }

    return await this.treeTypeRepository.save({
      ...currentTreeType,
      ...treeTypeInfo,
    });
  }

  public async createTreeSlot(
    ctx: RequestContext,
    treeId: string,
    userId: string,
    file: Express.Multer.File,
    treeInfo: CreateTreeSlotDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    const currentUser: User = await this.userService.getUserById(userId);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const currentTree: Tree = await this.calculateAvailableSlots(treeId);

    // if (currentTree.available_slot === 0) {
    //   throw new BadRequestException(errorMessages.SLOT_LIMIT_EXHAUSTED);
    // }

    if (currentUser.role === 'USER' && currentTree.user.id !== userId) {
      throw new ForbiddenException(errorMessages.USER_IS_NOT_AUTHOR);
    }

    // let limitOfFiles: number;

    // switch (treeInfo.slot_type) {
    //   case TreeFileType.PHOTO: {
    //     limitOfFiles = currentTree.type.photo_limit;
    //     break;
    //   }
    //   case TreeFileType.VIDEO: {
    //     limitOfFiles = currentTree.type.video_limit;
    //     break;
    //   }
    //   case TreeFileType.AUDIO: {
    //     limitOfFiles = currentTree.type.audio_limit;
    //     break;
    //   }
    // }

    // const additionalSlots: number = !currentTree.additional_slots.length
    //   ? 0
    //   : currentTree.additional_slots
    //       .filter((el) => el.file_type === treeInfo.slot_type)
    //       .reduce((sum, current) => {
    //         return sum + current.count_of_slots;
    //       }, 0);

    // limitOfFiles += additionalSlots;

    // const countOfCurrentSlots = currentTree.slots.filter(
    //   (el) => el.slot_type === treeInfo.slot_type,
    // ).length;

    // if (limitOfFiles === countOfCurrentSlots) {
    //   throw new BadRequestException(
    //     `Limit of file ${treeInfo.slot_type} is exhausted`,
    //   );
    // }

    const link: string = await this.fileManagerService.upload(file, ctx);

    if (!link) {
      throw new ConflictException('Something went wrong in file uploading');
    }
    const album = await this.albumRepository.findOne({
      where: {
        index: treeInfo.index,
      },
    });

    if (!album) {
      const newAlbum = this.albumRepository.create({
        index: treeInfo.index,
        treeid: treeId,
        album_title: treeInfo.albumTitle,
      });
      await this.albumRepository.save(newAlbum);
    }
    const newSlot: TreeSlot = this.treeSlotRepository.create({
      tree: currentTree,
      ...treeInfo,
      link,
    });
    const result = await this.treeSlotRepository.save(newSlot);

    if (result) {
      await this.calculateAvailableSlots(treeId);
    }

    return result;
  }

  public async calculateAvailableSlots(treeId: string) {
    const currentTree = await this.getTreeById(treeId);

    if (!currentTree) {
      throw new NotFoundException(errorMessages.TREE_NOT_EXIST);
    }

    if (currentTree.slots.length > 600) {
      throw new BadRequestException('Slots limit is exhausted');
    }

    return currentTree;
  }

  public async getTreeById(treeId: string) {
    return await this.treeRepository.findOne({
      where: {
        id: treeId,
      },
      relations: {
        type: true,
        slots: true,
        user: true,
        additional_slots: true,
      },
    });
  }

  async updateTreeSlot(
    ctx: RequestContext,
    slotId: string,
    userId: string,
    file: Express.Multer.File,
    treeInfo: UpdateTreeSlotDto,
  ) {
    const currentUser: User = await this.userService.getUserById(userId);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const currentTreeSlot: TreeSlot = await this.treeSlotRepository.findOne({
      where: {
        id: slotId,
      },
      relations: {
        tree: { user: true },
      },
    });

    if (!currentTreeSlot) {
      throw new NotFoundException(errorMessages.TREE_NOT_EXIST);
    }

    if (
      currentUser.role === 'USER' &&
      currentTreeSlot.tree.user.id !== userId
    ) {
      throw new ForbiddenException(errorMessages.USER_IS_NOT_AUTHOR);
    }

    const link: string = file
      ? await this.fileManagerService.upload(file, ctx)
      : currentTreeSlot.link;

    if (!link) {
      throw new ConflictException('Something went wrong in file uploading');
    }

    const isBodyExist: boolean = 'index' in treeInfo || 'slot_type' in treeInfo;
    const treeid = currentTreeSlot.id;
    await this.albumRepository.update(
      { treeid },
      {
        album_title: treeInfo.albumTitle,
      },
    );

    if (isBodyExist) {
      return await this.treeSlotRepository.save({
        ...currentTreeSlot,
        link,
        ...treeInfo,
      });
    }

    return await this.treeSlotRepository.save({ ...currentTreeSlot, link });
  }

  public async removeTreeSlot(slotId: string, userId: string) {
    const currentUser: User = await this.userService.getUserById(userId);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const currentTreeSlot: TreeSlot = await this.treeSlotRepository.findOne({
      where: {
        id: slotId,
      },
      relations: {
        tree: { user: true },
      },
    });

    if (
      currentUser.role === 'USER' &&
      currentTreeSlot.tree.user.id !== userId
    ) {
      throw new ForbiddenException(errorMessages.USER_IS_NOT_AUTHOR);
    }

    const result = await this.treeSlotRepository.remove(currentTreeSlot);

    if (result) {
      await this.calculateAvailableSlots(currentTreeSlot.tree.id);
    }

    const otherSlots = await this.treeSlotRepository.find({
      where: {
        tree: currentTreeSlot.tree,
      },
    });
    if (otherSlots.length === 0) {
      await this.deleteAlbumByTreeId(
        currentTreeSlot.tree.id,
        currentTreeSlot.index,
      );
    }
    return result;
  }

  public async getTreeTypeById(type_id: string): Promise<TreeType> {
    const currentTreeType: TreeType = await this.treeTypeRepository.findOne({
      where: {
        id: type_id,
      },
      relations: {
        price_list: true,
      },
    });

    if (!currentTreeType) {
      throw new NotFoundException(errorMessages.TREE_TYPE_NOT_EXIST);
    }

    return currentTreeType;
  }

  public async getTreeTypePriceById(type_id: string): Promise<TreeTypePrice[]> {
    const currentTreeType: TreeType = await this.treeTypeRepository.findOne({
      where: {
        id: type_id,
      },
      relations: {
        price_list: true,
      },
    });

    if (!currentTreeType) {
      throw new NotFoundException(errorMessages.TREE_TYPE_NOT_EXIST);
    }

    return currentTreeType.price_list;
  }

  // public async updateAdditionalSlots(treeId: string, count: number) {
  //   const currentTree = await this.getTreeById(treeId);
  //
  //   if (!currentTree) {
  //     throw new NotFoundException(errorMessages.TREE_NOT_EXIST);
  //   }
  //
  //   const result = await this.additionalTreeSlotRepository.save({
  //     ...currentTree.additional_slots,
  //     count_of_slots: currentTree.additional_slots.count_of_slots + count,
  //   });
  //
  //   if (result) {
  //     await this.calculateAvailableSlots(treeId);
  //   }
  //
  //   return result;
  // }
  async addAdditionalSlotsByAdmin(
    treeId: string,
    file_type: TreeFileType,
    count: number,
  ) {
    const currentTree: Tree = await this.getTreeById(treeId);

    if (!currentTree) {
      throw new NotFoundException(errorMessages.TREE_NOT_EXIST);
    }

    await this.additionalTreeSlotRepository.save({
      tree: currentTree,
      file_type,
      count_of_slots: count,
    });

    return await this.calculateAvailableSlots(treeId);
  }

  public async updateTreeSlotComment(
    slotId: string,
    updateDto: UpdateTreeSlotCommentDto,
  ): Promise<TreeSlot> {
    const treeSlot = await this.treeSlotRepository.findOneBy({ id: slotId });

    if (!treeSlot) {
      throw new NotFoundException('TreeSlot not found');
    }

    treeSlot.comment_title = updateDto.comment_title ?? treeSlot.comment_title;
    treeSlot.comment_text = updateDto.comment_text ?? treeSlot.comment_text;

    return await this.treeSlotRepository.save(treeSlot);
  }

  public async getTreeSlotCommentById(id: string): Promise<any> {
    console.log('id', id);

    const comment = await this.treeRepository.findOne({
      where: {
        id,
      },
      relations: {
        type: true,
        slots: true,
        user: true,
        additional_slots: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;

    // return {
    //   comment_title: comment.comment_title,
    //   comment_text: comment.comment_text,
    // };
  }
  public async removeTreeSlotComment(commentId: string): Promise<void> {
    const treeSlot = await this.treeSlotRepository.findOne({
      where: { id: commentId },
    });

    if (!treeSlot) {
      throw new NotFoundException('Comment not found');
    }

    // Assuming comment details are directly fields in treeSlot
    treeSlot.comment_title = null;
    treeSlot.comment_text = null;

    await this.treeSlotRepository.save(treeSlot);
  }

  public async getAlbumByTreeId(treeId: string): Promise<Album[]> {
    return await this.albumRepository.find({
      where: { treeid: treeId },
    });
  }
  public async deleteAlbumByTreeId(
    treeId: string,
    index: number,
  ): Promise<void> {
    await this.albumRepository.delete({ treeid: treeId, index });
  }
  public async updateAlbum(treeid: string, index: number, title: string) {
    let album = await this.albumRepository.findOne({
      where: { treeid, index },
    });

    if (!album) {
      album = this.albumRepository.create({
        treeid,
        index,
        album_title: title,
      });
    } else {
      album.album_title = title;
    }

    return this.albumRepository.save(album);

    // const album = await this.albumRepository.findOne({
    //   where: {
    //     treeid,
    //     index,
    //   },
    // });

    // if (!album) {
    //   throw new NotFoundException('Album not found');
    // }

    // album.album_title = title;

    // return await this.albumRepository.save(album);
  }

  public async getCandlesByTreeId(treeId: string): Promise<any> {
    const candles = await this.candleRepository.find({
      where: { treeid: treeId },
    });

    const plainCandles = candles.map((candle) => ({
      id: candle.id,
      treeid: candle.treeid,
      from: candle.from,
      wishes: candle.wishes,
      created_at: candle.created_at.toISOString(),
    }));

    return plainCandles;
  }
  public async createCandle(body: CreateCandleDto) {
    const { treeid, ...rest } = body;

    const currentTree: Tree = await this.treeRepository.findOne({
      where: { id: treeid },
    });

    if (!currentTree) {
      throw new NotFoundException('Tree not found');
    }

    const newCandle: Candle = this.candleRepository.create({
      treeid,
      ...rest,
    });

    return await this.candleRepository.save(newCandle);
  }
  public async getAllCandles(userId: string): Promise<any> {
    const currentUser: User = await this.userService.getUserWithTrees(userId);
    console.log('currentUser', currentUser);
    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const userCandles = currentUser.trees.map((tree) => {
      return this.getCandlesByTreeId(tree.id);
    });
    const res = await Promise.all(userCandles);
    return res;
  }

  public async deleteCandle(candleId: string, userId: string) {
    const currentCandle = await this.candleRepository.findOne({
      where: { id: candleId },
    });

    if (!currentCandle) {
      throw new NotFoundException('Candle not found');
    }

    const user = await this.getTreeById(currentCandle.treeid);

    if (user.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this candle');
    }

    return await this.candleRepository.remove(currentCandle);
  }

  public async updateCandle(candleId: string, body: UpdateCandleDto) {
    const currentCandle = await this.candleRepository.findOne({
      where: { id: candleId },
    });

    if (!currentCandle) {
      throw new NotFoundException('Candle not found');
    }

    return await this.candleRepository.save({
      ...currentCandle,
      ...body,
    });
  }

  public async getAILimits(userId: string) {
    const currentUser: User = await this.userService.getUserById(userId);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const aiGeneration = await this.aiGenerationRepository.findOne({
      where: { userId: currentUser.id },
    });

    if (!aiGeneration) {
      let generationCount = 0;
      const userTrees = await this.getAllUserTree(userId);
      userTrees.forEach((tree) => {
        tree.type.name === 'Standard'
          ? (generationCount += 10)
          : tree.type.name === 'Max'
          ? (generationCount += 10)
          : (generationCount += 0);
      });
      const newAiGeneration = this.aiGenerationRepository.create({
        userId: currentUser.id,
        count_of_generation: generationCount,
      });
      await this.aiGenerationRepository.save(newAiGeneration);
      console.log(generationCount);
      return {
        count_of_generation: generationCount,
      };
    }

    console.log(
      'aiGeneration.count_of_generation',
      aiGeneration.count_of_generation,
    );

    return {
      count_of_generation: aiGeneration.count_of_generation,
    };
  }

  public async updateAILimits(userId: string, count: number) {
    const currentUser: User = await this.userService.getUserById(userId);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const aiGeneration = await this.aiGenerationRepository.findOne({
      where: { userId: currentUser.id },
    });

    if (!aiGeneration) {
      throw new NotFoundException('AI generation not found');
    }

    return await this.aiGenerationRepository.save({
      ...aiGeneration,
      count_of_generation: aiGeneration.count_of_generation + count,
    });
  }

  public decrementAiLimits(userId: string) {
    return this.updateAILimits(userId, -1);
  }
}
