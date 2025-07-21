import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { errorMessages } from '../common/constants/error';
import { UserService } from '../user/services/user.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { Referral } from './entities/referral.entity';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral)
    protected readonly referralRepository: Repository<Referral>,
    protected readonly userService: UserService,
  ) {}

  public async create({ referrerId, referredId }: CreateReferralDto) {
    const currentReferral = await this.userService.getUserById(referrerId);
    const currentReferred = await this.userService.getUserById(referredId);

    if (!currentReferral || !currentReferred) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    return await this.referralRepository.save({
      full_name: currentReferred.username,
      referredId,
      referrer: currentReferral,
    });
  }

  public async findAll(userId: string): Promise<Referral[]> {
    return await this.referralRepository.find({
      where: {
        referrer: {
          id: userId,
        },
        isPurchaseMade: true,
      },
    });
  }

  public async updatePurchaseStatus(userId: string): Promise<Referral> {
    const currentReferral: Referral = await this.referralRepository.findOne({
      where: {
        referredId: userId,
      },
      relations: {
        referrer: true,
      },
    });

    if (!currentReferral) {
      throw new NotFoundException('Referral does not exist');
    }

    return await this.referralRepository.save({
      ...currentReferral,
      isPurchaseMade: true,
    });
  }
}
