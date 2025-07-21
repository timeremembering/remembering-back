import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROLE } from '../auth/constants/role.constant';
import { ExtractUserId } from '../auth/decorators/extract-user-id.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateReferralDto } from './dto/create-referral.dto';
import { Referral } from './entities/referral.entity';
import { ReferralService } from './referral.service';

@ApiTags('referral')
@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  public async create(@Body() createReferralDto: CreateReferralDto) {
    return await this.referralService.create(createReferralDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  public async findAllUserReferral(
    @ExtractUserId() userId: string,
  ): Promise<Referral[]> {
    return await this.referralService.findAll(userId);
  }

  @Get('one/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  public async findAllUserReferralById(
    @Param('id') userId: string,
  ): Promise<Referral[]> {
    return await this.referralService.findAll(userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  public async updatePurchaseStatus(
    @ExtractUserId() userId: string,
  ): Promise<Referral> {
    return await this.referralService.updatePurchaseStatus(userId);
  }
}
