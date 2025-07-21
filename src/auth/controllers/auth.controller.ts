import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { ExtractUserId } from '../decorators/extract-user-id.decorator';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { AuthTokenOutput } from '../dtos/auth-token-output.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }
  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @ReqContext() ctx: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: LoginInput,
  ): Promise<AuthTokenOutput> {
    console.log('credential', credential);
    const currentUser = await this.authService.validateUser(
      ctx,
      credential.email,
      credential.password,
    );

    return this.authService.login(currentUser);
  }

  @ApiResponse({ description: 'Request for login in admin-dashboard' })
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(
    @ReqContext() ctx: RequestContext,
    @Body() signInInput: any,
  ): Promise<any> {
    return await this.authService.register(ctx, signInInput);
  }

  @ApiResponse({ description: 'Request for creating mini-admin' })
  @Post('register/mini-admin')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('promotionImage'))
  @UseInterceptors(ClassSerializerInterceptor)
  async signUpMiniAdmin(
    @ReqContext() ctx: RequestContext,
    @Body() signInInput: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.authService.registerMiniAdmin(ctx, signInInput, file);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @ReqContext() ctx: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() { refreshToken }: RefreshTokenInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.refreshToken(refreshToken);
    return { data: authToken, meta: {} };
  }

  @ApiResponse({ description: 'Request for log out' })
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async logOut(
    @ReqContext() ctx: RequestContext,
    @ExtractUserId() userId: string,
  ) {
    return await this.authService.logout(ctx, userId);
  }

  @ApiResponse({ description: 'Activate account' })
  @Post('activate-owner')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async activateOwner(
    @ReqContext() ctx: RequestContext,
    @Body('userId') userId: string,
  ) {
    return await this.authService.activateUser(ctx, userId);
  }

  @ApiResponse({ description: '' })
  @Post('send-registration-email')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async sendRegistrationEmail(
    @ReqContext() ctx: RequestContext,
    @Body()
    {
      user,
      url,
    }: {
      user: {
        email: string;
        phone: string;
        username: string;
        code: string;
        plateName: string;
        password: string;
      };
      url: string;
    },
  ) {
    return await this.authService.sendActivationEmail(ctx, user, url);
  }

  @ApiResponse({ description: 'send reset password code to email' })
  @Post('request-reset-password')
  @UseInterceptors(ClassSerializerInterceptor)
  async sendResetPasswordCode(
    @ReqContext() ctx: RequestContext,
    @Body('email') email: string,
    @Body('url') url: string,
  ): Promise<void> {
    return await this.authService.sendResetPasswordCode(ctx, email, url);
  }

  @ApiResponse({ description: 'Reset password' })
  @Post('reset-password')
  @UseInterceptors(ClassSerializerInterceptor)
  async resetPassword(
    @ReqContext() ctx: RequestContext,
    @Body('token') token: string,
    @Body('password') password: string,
  ): Promise<void> {
    return await this.authService.resetPassword(ctx, token, password);
  }
}
