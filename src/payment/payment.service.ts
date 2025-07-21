import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { MailerCustomService } from 'src/mailer/mailer.service';
import { UserService } from 'src/user/services/user.service';
import Stripe from 'stripe';
import { EntityManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { errorMessages } from '../common/constants/error';
import { AdditionalTreeSlots } from '../tree/entities/additional-tree-slots.entity';
import { Tree } from '../tree/entities/tree.entity';
import { TreeType } from '../tree/entities/tree-type.entity';
import {
  casketPricing,
  treeSlotsPricingConstant,
} from '../tree/tree.constants';
import { TreeService } from '../tree/tree.service';
import { CreatePaymentForSlotsDto } from './dto/create-payment-for-slots.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AdditionalSlotsPricing } from './entities/additional-slots-pricing.entity';
import { CasketPricing } from './entities/casket-pricing.entity';
import { Transaction } from './entities/transaction.entity';
import { StripeCurrencyEnum, TypeOfCasketEnum } from './payment.types';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly treeService: TreeService,
    @Inject(forwardRef(() => UserService))
    protected readonly userService: UserService,
    protected readonly jwtService: JwtService,
    private readonly mailerCustomService: MailerCustomService,

    @InjectRepository(Transaction)
    protected readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(AdditionalSlotsPricing)
    protected readonly additionalSlotsPricingRepository: Repository<AdditionalSlotsPricing>,
    @InjectRepository(CasketPricing)
    protected readonly casketPricingRepository: Repository<CasketPricing>,
    @InjectEntityManager() protected readonly em: EntityManager,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(
    type_id: string,
    data: CreateTransactionDto,
  ): Promise<any> {
    if (data.language === 'ua') {
      await this.mailerCustomService.sendUserConfirmation(
        { email: data.email.toLowerCase(), name: data.fullName },
        data.language,
      );
      return;
    }

    const treeType: TreeType = await this.treeService.getTreeTypeById(type_id);

    const currency: StripeCurrencyEnum = StripeCurrencyEnum[data.language];

    const isCasketNeed = data.typeOfCasket === TypeOfCasketEnum.PREMIUM;

    const currentCasketPrice = await this.casketPricingRepository.findOneBy({
      type: data.typeOfCasket,
      currency,
    });

    const currentPrice = treeType.price_list.find(
      (el) => el.currency === currency,
    );

    const calculatedAmount: number = currentPrice.price * 100;

    const createdTransaction: Transaction =
      await this.transactionRepository.save({ ...data, type: treeType });

    const token: string = this.jwtService.sign(
      { id: createdTransaction.id, type: 'TREE' },
      {
        secret: this.configService.get<string>('JWT_PUBLIC_KEY_BASE64'),
        expiresIn: '7d',
      },
    );

    let line_items: any;
    if (data.withoutBox) {
      line_items = [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: `Pack: ${treeType.name} ${treeType.photo_limit}+`,
              description: `Photo limit - ${treeType.photo_limit} \n Video limit - ${treeType.video_limit} \n Audio limit - ${treeType.audio_limit} \n`,
            },
            currency,
            unit_amount: calculatedAmount,
          },
        },
      ];
    } else if (isCasketNeed) {
      line_items = [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: `Pack: ${treeType.name} ${treeType.photo_limit}+`,
              description: `Photo limit - ${treeType.photo_limit} \n Video limit - ${treeType.video_limit} \n Audio limit - ${treeType.audio_limit} \n`,
            },
            currency,
            unit_amount: calculatedAmount,
          },
        },
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: `Exclusive casket`,
              description: 'Exclusive designer casket for your QR code',
            },
            currency,
            unit_amount: currentCasketPrice.price * 100,
          },
        },
      ];
    } else {
      line_items = [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: `Pack: ${treeType.name} ${treeType.photo_limit}+`,
              description: `Photo limit - ${treeType.photo_limit} \n Video limit - ${treeType.video_limit} \n Audio limit - ${treeType.audio_limit} \n`,
            },
            currency,
            unit_amount: calculatedAmount,
          },
        },
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: `Free box`,
              description: 'Casket for your QR code',
            },
            currency,
            unit_amount: currentCasketPrice.price * 100,
          },
        },
      ];
    }

    try {
      await this.mailerCustomService.sendUserConfirmation(
        { email: data.email.toLowerCase(), name: data.fullName },
        data.language,
      );
      return await this.stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        currency,
        payment_intent_data: {
          setup_future_usage: 'on_session',
        },
        success_url: `https://rememberingtime.org/${data.language}/payload/success?token=${token}`,
        cancel_url: `https://rememberingtime.org/${data.language}/payload/rejected`,
      });
    } catch (error) {
      await this.transactionRepository.remove(createdTransaction);
      throw new ConflictException(error.message);
    }
  }

  async createPaymentIntentForAdditionalSlots(
    data: CreatePaymentForSlotsDto,
  ): Promise<any> {
    const currentTree: Tree = await this.treeService.getTreeById(data.treeId);

    if (!currentTree) {
      throw new NotFoundException(errorMessages.TREE_NOT_EXIST);
    }

    const currency: StripeCurrencyEnum = StripeCurrencyEnum[data.language];

    const currentPricing = await this.additionalSlotsPricingRepository.findOne({
      where: {
        file_type: data.file_type,
        currency,
      },
    });

    const calculatedAmount: number = currentPricing.price * 100;

    const token: string = this.jwtService.sign(
      {
        id: currentTree.id,
        count: data.count,
        file_type: data.file_type,
        type: 'SLOT',
      },
      {
        secret: this.configService.get<string>('JWT_PUBLIC_KEY_BASE64'),
        expiresIn: '7d',
      },
    );

    try {
      return await this.stripe.checkout.sessions.create({
        line_items: [
          {
            quantity: data.count,
            price_data: {
              product_data: {
                name: `Slots for: ${data.file_type}`,
                description: `Additional slot for the ${data.file_type} file type `,
              },
              currency,
              unit_amount: calculatedAmount,
            },
          },
        ],
        mode: 'payment',
        currency,
        payment_intent_data: {
          setup_future_usage: 'on_session',
        },
        success_url: `https://rememberingtime.org/customer/tree/${currentTree.id}?token=${token}`,
        cancel_url: `https://rememberingtime.org/customer/tree/${currentTree.id}`,
      });
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async validateToken(token: string) {
    try {
      const decodedInfo = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_PUBLIC_KEY_BASE64'),
      });

      if (decodedInfo.type === 'TREE') {
        const { id } = decodedInfo;

        const currentTransaction = await this.transactionRepository.findOne({
          where: { id },
          relations: {
            type: true,
          },
        });

        if (!currentTransaction) {
          throw new ConflictException(
            'Transaction already removed from the system',
          );
        }

        return await this.transactionRepository.save({
          ...currentTransaction,
          is_finished: true,
        });
      }

      if (decodedInfo.type === 'SLOT') {
        const { id, count, file_type } = decodedInfo;

        const currentAdditionalTreeSlots = await this.em.findOne(Tree, {
          where: {
            id,
          },
          relations: {
            additional_slots: true,
          },
        });

        await this.em.save(AdditionalTreeSlots, {
          tree: currentAdditionalTreeSlots,
          file_type,
          count_of_slots: count,
        });

        return await this.treeService.calculateAvailableSlots(id);
      }
    } catch (e) {
      throw new ConflictException(e);
    }
  }

  public async initSlotsPricing() {
    const PricingData: AdditionalSlotsPricing[] =
      await this.additionalSlotsPricingRepository.find();

    if (PricingData.length === treeSlotsPricingConstant.length) {
      return;
    }

    await this.additionalSlotsPricingRepository.remove(PricingData);

    const promises = treeSlotsPricingConstant.map((el) => {
      return this.additionalSlotsPricingRepository.save(el);
    });

    await Promise.all(promises);
  }

  public async initCasketPricing() {
    const PricingData: CasketPricing[] =
      await this.casketPricingRepository.find();

    if (PricingData.length === treeSlotsPricingConstant.length) {
      return;
    }

    await this.casketPricingRepository.remove(PricingData);

    const promises = casketPricing.map((el) => {
      return this.casketPricingRepository.save(el);
    });

    await Promise.all(promises);
  }

  async createPaymentIntentForNewTree(data: {
    fullName: string;
    email: string;
    language: string;
    userId: string;
    onSuccessUrl: string;
  }): Promise<any> {
    const currency: StripeCurrencyEnum = StripeCurrencyEnum[data.language];
    const calculatedAmount: number =
      data.language === 'en' ? 1999 : data.language === 'ua' ? 40000 : 4499;

    const token: string = this.jwtService.sign(
      { id: uuidv4(), type: 'NEW_TREE' },
      {
        secret: this.configService.get<string>('JWT_PUBLIC_KEY_BASE64'),
        expiresIn: '7d',
      },
    );

    const line_items = [
      {
        quantity: 1,
        price_data: {
          product_data: {
            name: 'New Tree',
            description: 'Purchase of a new tree slot',
          },
          currency,
          unit_amount: calculatedAmount,
        },
      },
    ];

    try {
      const successUrl = `https://rememberingtime.org/${data.language}${
        data.onSuccessUrl ? data.onSuccessUrl : `/tree/success?token=${token}`
      }`;
      const cancelUrl = `https://rememberingtime.org/${data.language}/tree/cancel`;

      return await this.stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        currency,
        payment_intent_data: {
          metadata: {
            token,
            type: 'NEW_TREE',
            userId: data.userId,
          },
          setup_future_usage: 'on_session',
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async createPaymentIntentForAiGeneration(data: {
    fullName: string;
    email: string;
    language: string;
    userId: string;
  }): Promise<any> {
    const currency: StripeCurrencyEnum = StripeCurrencyEnum[data.language];

    const amountByCurrencyMap = {
      [StripeCurrencyEnum.ua]: 40000,
      [StripeCurrencyEnum.en]: 1000,
      [StripeCurrencyEnum.pl]: 3700,
    };

    const token: string = this.jwtService.sign(
      { id: uuidv4(), type: 'AI_GENERATION_10' },
      {
        secret: this.configService.get<string>('JWT_PUBLIC_KEY_BASE64'),
        expiresIn: '7d',
      },
    );

    const line_items = [
      {
        quantity: 1,
        price_data: {
          product_data: {
            name: '10 poems for photographs.',
            description: 'Purchase of a 10 poems for $10',
          },
          currency,
          unit_amount: amountByCurrencyMap[currency],
        },
      },
    ];

    try {
      return await this.stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        currency,
        payment_intent_data: {
          metadata: {
            token,
            type: 'AI_GENERATION_10',
            userId: data.userId,
          },
          setup_future_usage: 'on_session',
        },
        success_url: `https://rememberingtime.org/${data.language}/tree/success?token=${token}`,
        cancel_url: `https://rememberingtime.org/${data.language}/tree/cancel`,
      });
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async createRegisterPaymentIntent(data: {
    fullName: string;
    email: string;
    language: string;
    userId: string;
  }) {
    if (!['en', 'ua', 'pl'].includes(data.language)) {
      throw new ConflictException('Language is not supported');
    }

    const currency: StripeCurrencyEnum = StripeCurrencyEnum[data.language];
    const calculatedAmount: number =
      data.language === 'en' ? 1999 : data.language === 'ua' ? 40000 : 4499;

    const token: string = this.jwtService.sign(
      { id: uuidv4(), type: 'NEW_USER_REGISTRATION' },
      {
        secret: this.configService.get<string>('JWT_PUBLIC_KEY_BASE64'),
        expiresIn: '7d',
      },
    );

    const line_items = [
      {
        quantity: 1,
        price_data: {
          product_data: {
            name: 'Registration Fee',
            description: 'Purchase of a registration fee',
          },
          currency,
          unit_amount: calculatedAmount,
        },
      },
    ];

    try {
      return await this.stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        currency,
        payment_intent_data: {
          metadata: {
            token,
            type: 'NEW_USER_REGISTRATION',
            userId: data.userId,
          },
          setup_future_usage: 'on_session',
        },
        success_url: `https://rememberingtime.org/${
          data.language
        }/signup/new?success=true&token=${
          data.userId
        }|${data.email.toLowerCase()}`,
        cancel_url: `https://rememberingtime.org/${data.language}/`,
      });
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async webhook(req: any, res: any) {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        this.configService.get('STRIPE_WEBHOOK_SECRET'),
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(event);
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;

        if (
          paymentIntent.metadata &&
          paymentIntent.metadata.type === 'NEW_TREE' &&
          paymentIntent.metadata.userId
        ) {
          const token = paymentIntent.metadata.token;
          const userId = paymentIntent.metadata.userId;
          try {
            await this.validateToken(token);
            const tree = await this.treeService.createAdditionalTree(userId);
            return res.json({ tree });
          } catch (error) {
            res
              .status(500)
              .send(`Error processing NEW_TREE payment: ${error.message}`);
          }
        }

        if (
          paymentIntent.metadata &&
          paymentIntent.metadata.type === 'AI_GENERATION_10' &&
          paymentIntent.metadata.userId
        ) {
          const token = paymentIntent.metadata.token;
          const userId = paymentIntent.metadata.userId;
          try {
            await this.validateToken(token);
            const tree = await this.treeService.updateAILimits(userId, 10);
            return res.json({ tree });
          } catch (error) {
            res
              .status(500)
              .send(
                `Error processing AI_GENERATION_10 payment: ${error.message}`,
              );
          }
        }

        if (
          paymentIntent.metadata &&
          paymentIntent.metadata.type === 'NEW_USER_REGISTRATION' &&
          paymentIntent.metadata.userId
        ) {
          const token = paymentIntent.metadata.token;
          const userId = paymentIntent.metadata.userId;

          try {
            await this.validateToken(token);
            const user = await this.userService.activateUser(null, userId);
            return res.json({ user });
          } catch (error) {
            res
              .status(500)
              .send(
                `Error processing NEW_USER_REGISTRATION payment: ${error.message}`,
              );
          }
        }

        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        console.error('Payment failed:', failedPaymentIntent);
        break;
      case 'checkout.session.completed':
        break;

      case 'payment_intent.created':
        break;

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  }
}
