import {
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { ReqContext } from '../shared/request-context/req-context.decorator';
import { RequestContext } from '../shared/request-context/request-context.dto';
import { FileManagerService } from './file-manager.service';

@Controller('file')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async loadFile(
    @ReqContext() ctx: RequestContext,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.fileManagerService.upload(file, ctx);
  }

  @Delete()
  async removeFile(
    @ReqContext() ctx: RequestContext,
    @Query('url') url: string,
  ) {
    return await this.fileManagerService.remove(url, ctx);
  }
}
