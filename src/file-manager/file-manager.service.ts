import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { AppLogger } from '../shared/logger/logger.service';
import { RequestContext } from '../shared/request-context/request-context.dto';

@Injectable()
export class FileManagerService {
  private s3Client: S3Client = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
  });

  constructor(
    protected readonly logger: AppLogger,
    protected readonly configService: ConfigService,
  ) {
    this.logger.setContext(FileManagerService.name);
  }

  async upload(
    file: Express.Multer.File,
    ctx: RequestContext | null,
  ): Promise<string> {
    this.logger.debug(ctx, `${this.upload.name} was called`);

    const fileName: string = uuidv4();

    const lastDotIndex: number = file.originalname.lastIndexOf('.');
    const format: string =
      lastDotIndex !== -1 ? file.originalname.substring(lastDotIndex) : '';

    try {
      this.logger.debug(ctx, `calling ${this.s3Client.send.name}`);
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
          Key: 'tree' + '/' + fileName + format,
          Body: file.buffer,
          ACL: 'public-read',
        }),
      );

      return this.configService.get('AWS_S3_URL') + '/' + fileName + format;
    } catch (e) {
      this.logger.error(ctx, `Something went wrong with file uploading`, e);
      throw new ConflictException(
        e,
        'Something went wrong with file uploading.',
      );
    }
  }

  async remove(
    fileLink: string,
    ctx: RequestContext,
  ): Promise<DeleteObjectCommandOutput> {
    this.logger.debug(ctx, `${this.remove.name} was called`);

    const concatFileLink = fileLink.replace(
      this.configService.get<string>('AWS_S3_URL') + '/',
      '',
    );

    const Key: string = 'tree/' + concatFileLink;
    this.logger.debug(ctx, `Generated Key for removing: ${Key}`);

    this.logger.debug(ctx, `calling ${this.s3Client.send.name}`);
    return await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key,
      }),
    );
  }
}
