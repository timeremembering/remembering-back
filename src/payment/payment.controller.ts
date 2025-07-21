import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExtractUserId } from 'src/auth/decorators/extract-user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentForSlotsDto } from './dto/create-payment-for-slots.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(protected readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPaymentIntent(@Body() { type_id, ...rest }: CreatePaymentDto) {
    return await this.paymentService.createPaymentIntent(type_id, rest);
  }

  @Post('slots')
  async createPaymentIntentForAdditionalSlots(
    @Body() paymentInfo: CreatePaymentForSlotsDto,
  ) {
    return await this.paymentService.createPaymentIntentForAdditionalSlots(
      paymentInfo,
    );
  }
  @Post('tree')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntentForTree(
    @ReqContext() ctx: RequestContext,
    @ExtractUserId() userId: string,
    @Body() paymentInfo: { fullName: string; email: string; language: string, onSuccessUrl: string },
  ) {
    return await this.paymentService.createPaymentIntentForNewTree({
      ...paymentInfo,
      userId,
    });
  }

  @Post('validate')
  async validatePaymentTransaction(@Query('token') token: string) {
    return await this.paymentService.validateToken(token);
  }

  @Post('ai')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntentForAi(
    @ReqContext() ctx: RequestContext,
    @ExtractUserId() userId: string,
    @Body() paymentInfo: { fullName: string; email: string; language: string },
  ) {
    return await this.paymentService.createPaymentIntentForAiGeneration({
      ...paymentInfo,
      userId,
    });
  }

  @Post('registration')
  async createRegisterPaymentIntent(
    @ReqContext() ctx: RequestContext,
    @Body()
    paymentInfo: {
      fullName: string;
      email: string;
      language: string;
      userId: string;
    },
  ) {
    return await this.paymentService.createRegisterPaymentIntent(paymentInfo);
  }

  @Post('webhook')
  async webhook(@Req() req, @Res() res) {
    return await this.paymentService.webhook(req, res);
  }
}
