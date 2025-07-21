import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UUIDValidationPipe } from 'src/common/pipines/uuid-validation.pipe';
import { MailerCustomService } from 'src/mailer/mailer.service';

import { ROLE } from '../../auth/constants/role.constant';
import { ExtractUserId } from '../../auth/decorators/extract-user-id.decorator';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { SendMailDto } from '../dto/send-mail.dto';
import { UserOutput } from '../dto/user-output.dto';
import { UpdateUserInput } from '../dto/user-update-input.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
    private readonly mailerCustomService: MailerCustomService,
  ) {
    this.logger.setContext(UserController.name);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @ApiOperation({
    summary: 'Get user me API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
    @ExtractUserId() userId: string,
  ): Promise<BaseApiResponse<User>> {
    this.logger.log(ctx, `${this.getMyProfile.name} was called`);

    const user = await this.userService.findById(userId);
    return { data: user, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('one/:id')
  @ApiOperation({
    summary: 'Get user me API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getUserById(
    @ReqContext() ctx: RequestContext,
    @Param('id') userId: string,
  ): Promise<BaseApiResponse<User>> {
    this.logger.log(ctx, `${this.getMyProfile.name} was called`);

    const user = await this.userService.findById(userId);
    return { data: user, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: 'Get users as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserOutput]),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<UserOutput[]>> {
    this.logger.log(ctx, `${this.getUsers.name} was called`);

    const { users, count } = await this.userService.getUsers(
      ctx,
      query.limit,
      query.offset,
      query.code,
      query.filter,
    );

    return { data: users, meta: { count } };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/codes')
  @ApiOperation({
    summary: 'Get all codes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([String]),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getCodes(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<string[]>> {
    this.logger.log(ctx, `${this.getCodes.name} was called`);

    const codes = await this.userService.getAllCodes(ctx);

    return { data: codes, meta: {} };
  }

  // TODO: ADD RoleGuard
  // NOTE : This can be made a admin only endpoint. For normal users they can use GET /me
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async getUser(@Param('id') id: string): Promise<BaseApiResponse<User>> {
    const user: User = await this.userService.getUserById(id);
    return { data: user, meta: {} };
  }

  // TODO: ADD RoleGuard
  // NOTE : This can be made a admin only endpoint. For normal users they can use PATCH /me
  @Patch('one/:id')
  @ApiOperation({
    summary: 'Update user API',
  })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(ROLE.ADMIN)
  async updateUser(
    @ReqContext() ctx: RequestContext,
    @Param('id') userId: string,
    @Body() input: UpdateUserInput,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.updateUser.name} was called`);
    console.log('inpufdssfdfdsfdsfsdfsfsdfdsfdsfst', input);
    const user = await this.userService.updateUser(ctx, userId, input);
    return { data: user, meta: {} };
  }

  @Patch('/disabled/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  public async changeIsDisabledStatus(
    @Param('id') userId: string,
    @Body('isAccountDisabled', ParseBoolPipe) isAccountDisabled: boolean,
  ): Promise<User> {
    return await this.userService.changeIsDisabledStatus(
      userId,
      isAccountDisabled,
    );
  }

  @ApiResponse({ description: 'Get user by id and remove.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  remove(@ReqContext() ctx, @Param('id', UUIDValidationPipe) id: string) {
    return this.userService.remove(ctx, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('support')
  @ApiOperation({
    summary: 'Send email to support',
  })
  @ApiResponse({ description: 'Send mail to support' })
  async sendSupportEmail(
    @ReqContext() ctx: RequestContext,
    @Body() sendMailDto: SendMailDto,
  ): Promise<void> {
    this.logger.log(ctx, `${this.sendSupportEmail.name} was called`);
    return await this.mailerCustomService.sendSupportEmail(sendMailDto);
  }

  @Post('activate')
  @ApiOperation({
    summary: 'Activate user account',
  })
  @ApiResponse({ description: 'Activate user account' })
  async activateUserAccount(
    @ReqContext() ctx: RequestContext,
    @Query('token') token: string,
  ): Promise<User> {
    return await this.userService.activateUserAfterRegistration(ctx, token);
  }

  @Patch('/promotion/:id')
  @ApiOperation({
    summary: 'Update promotion image',
  })
  @UseInterceptors(FileInterceptor('promotionImage'))
  async updatePromotionImage(
    @ReqContext() ctx: RequestContext,
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return await this.userService.updatePromotionImage(ctx, userId, file);
  }
}
