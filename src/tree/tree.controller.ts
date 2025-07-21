import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';

import { ROLE } from '../auth/constants/role.constant';
import { ExtractUserId } from '../auth/decorators/extract-user-id.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ReqContext } from '../shared/request-context/req-context.decorator';
import { RequestContext } from '../shared/request-context/request-context.dto';
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
import { Tree } from './entities/tree.entity';
import { TreeSlot } from './entities/tree-slot.entity';
import { TreeType } from './entities/tree-type.entity';
import { TreeService } from './tree.service';
import { TreeFileType } from './tree.types';

@ApiTags('tree')
@Controller('tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  public async createTree(@Body() treeInfo: CreateTreeDto): Promise<Tree> {
    return await this.treeService.createTree(treeInfo);
  }

  @Post('slot/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Roles(ROLE.ADMIN, ROLE.USER)
  public async createTreeSlot(
    @ReqContext() ctx: RequestContext,
    @Param('id') treeId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() treeInfo: CreateTreeSlotDto,
    @ExtractUserId() userId: string,
  ): Promise<TreeSlot> {
    return await this.treeService.createTreeSlot(
      ctx,
      treeId,
      userId,
      file,
      treeInfo,
    );
  }

  @Patch('slot/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Roles(ROLE.ADMIN, ROLE.USER)
  public async updateTreeSlot(
    @ReqContext() ctx: RequestContext,
    @Param('id') slotId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() treeInfo: UpdateTreeSlotDto,
    @ExtractUserId() userId: string,
  ): Promise<TreeSlot> {
    return await this.treeService.updateTreeSlot(
      ctx,
      slotId,
      userId,
      file,
      treeInfo,
    );
  }

  @Post('additional-slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  public async updateAdditionalSlots(
    @Body('treeId', ParseUUIDPipe) treeId: string,
    @Body('file_type') file_type: TreeFileType,
    @Body('count', ParseIntPipe) count: number,
  ) {
    return await this.treeService.addAdditionalSlotsByAdmin(
      treeId,
      file_type,
      count,
    );
  }

  @Delete('slot/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  public async removeTreeSlot(
    @ReqContext() ctx: RequestContext,
    @Param('id') slotId: string,
    @ExtractUserId() userId: string,
  ): Promise<TreeSlot> {
    return await this.treeService.removeTreeSlot(slotId, userId);
  }

  @Get('one/:id')
  public async getTreeById(@Param('id', ParseUUIDPipe) treeId: string) {
    return await this.treeService.getTreeById(treeId);
  }

  @Get('all/:id')
  public async getUserTrees(@Param('id') userId: string): Promise<Tree[]> {
    return await this.treeService.getAllUserTree(userId);
  }

  @Patch('one/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(ROLE.ADMIN, ROLE.USER)
  public async updateTree(
    @ReqContext() ctx: RequestContext,
    @ExtractUserId() userId: string,
    @Param('id') treeId: string,
    @Body() treeInfo: UpdateTreeDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Tree> {
    return await this.treeService.updateTree(
      ctx,
      userId,
      treeId,
      treeInfo,
      file,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  public async getAllUserTree(
    @ExtractUserId() userId: string,
  ): Promise<Tree[]> {
    return await this.treeService.getAllUserTree(userId);
  }

  @Get('all')
  public async getAllUsersTree(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<any> {
    return await this.treeService.getAllUsersTree(ctx, limit, offset);
  }

  @Get('types')
  public async getAllTreeTypes(): Promise<TreeType[]> {
    return await this.treeService.getAllTreeTypes();
  }
  @Post('types')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  public async createTreeType(
    @Body() treeTypeInfo: CreateTreeTypeDto,
  ): Promise<TreeType> {
    return await this.treeService.createTreeType(treeTypeInfo);
  }

  @Patch('types/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  public async updateTreeType(
    @Param('id') treeTypeId: string,
    @Body() treeTypeInfo: UpdateTreeTypeDto,
  ): Promise<TreeType> {
    return await this.treeService.updateTreeType(treeTypeId, treeTypeInfo);
  }

  @Patch('comment/:id')
  @UseGuards(JwtAuthGuard)
  async updateTreeSlotComment(
    @Param('id') slotId: string,
    @Body() updateTreeSlotCommentDto: UpdateTreeSlotCommentDto,
  ): Promise<TreeSlot> {
    return await this.treeService.updateTreeSlotComment(
      slotId,
      updateTreeSlotCommentDto,
    );
  }

  @Get('comment/:id')
  @UseGuards(JwtAuthGuard)
  async getTreeSlotCommentById(@Param('id') id: string): Promise<any> {
    return await this.treeService.getTreeSlotCommentById(id);
  }

  @Delete('comment/:id')
  @UseGuards(JwtAuthGuard)
  async removeTreeSlotComment(
    @Param('id', ParseUUIDPipe) commentId: string,
  ): Promise<void> {
    return await this.treeService.removeTreeSlotComment(commentId);
  }

  @Patch('slot/album/:treeId')
  @UseGuards(JwtAuthGuard)
  async updateAlbum(
    @Param('treeId') treeId: string,
    @Body() { title, index }: { title: string; index: number },
  ): Promise<any> {
    return await this.treeService.updateAlbum(treeId, index, title);
  }
  @Get('slot/album/:treeId')
  // @UseGuards(JwtAuthGuard)
  async getAlbumsByTreeId(@Param('treeId') treeId: string): Promise<any> {
    return await this.treeService.getAlbumByTreeId(treeId);
  }
  @Get('/candle/:treeId')
  async getCandlesByTreeId(@Param('treeId') treeId: string): Promise<any> {
    return await this.treeService.getCandlesByTreeId(treeId);
  }
  @Post('/candle')
  async createCandle(@Body() body: CreateCandleDto): Promise<any> {
    console.log(body, 'body');
    return await this.treeService.createCandle(body);
  }
  @Delete('/candle/:candleId')
  @UseGuards(JwtAuthGuard)
  async deleteCandle(
    @Param('candleId') candleId: string,
    @ExtractUserId() userId: string,
  ): Promise<any> {
    return await this.treeService.deleteCandle(candleId, userId);
  }
  @Patch('/candle/:candleId')
  @UseGuards(JwtAuthGuard)
  async updateCandle(
    @Param('candleId') candleId: string,
    @Body() body: UpdateCandleDto,
  ): Promise<any> {
    return await this.treeService.updateCandle(candleId, body);
  }
  @Get('/candle/all/:userId')
  async getAllCandles(@Param('userId') userId: string): Promise<any> {
    return await this.treeService.getAllCandles(userId);
  }

  @Get('/aiLimits/:userId')
  async getAILimits(@Param('userId') userId: string) {
    return await this.treeService.getAILimits(userId);
  }
  @Patch('/aiLimits')
  @UseGuards(JwtAuthGuard)
  async decrementAILimits(@ExtractUserId() userId: string) {
    return await this.treeService.decrementAiLimits(userId);
  }
}
