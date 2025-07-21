import { StripeCurrencyEnum, TypeOfCasketEnum } from '../payment/payment.types';
import { TreeFileType } from './tree.types';

export const treeTypesConstant = [
  {
    name: 'Standard',
    price_list: [
      { price: 1500, currency: StripeCurrencyEnum.ua },
      { price: 250, currency: StripeCurrencyEnum.en },
      { price: 450, currency: StripeCurrencyEnum.pl },
    ],
    photo_limit: 10,
    video_limit: 1,
    audio_limit: 1,
  },
  {
    name: 'Medium',
    price_list: [
      { price: 2500, currency: StripeCurrencyEnum.ua },
      { price: 500, currency: StripeCurrencyEnum.en },
      { price: 650, currency: StripeCurrencyEnum.pl },
    ],
    photo_limit: 25,
    video_limit: 3,
    audio_limit: 2,
  },
  {
    name: 'Max',
    price_list: [
      { price: 3500, currency: StripeCurrencyEnum.ua },
      { price: 350, currency: StripeCurrencyEnum.en },
      { price: 750, currency: StripeCurrencyEnum.pl },
    ],
    photo_limit: 40,
    video_limit: 5,
    audio_limit: 5,
  },
];

export const treeSlotsPricingConstant = [
  {
    file_type: TreeFileType.PHOTO,
    currency: StripeCurrencyEnum.ua,
    price: 70,
  },

  {
    file_type: TreeFileType.PHOTO,
    currency: StripeCurrencyEnum.en,
    price: 10,
  },
  {
    file_type: TreeFileType.PHOTO,
    currency: StripeCurrencyEnum.pl,
    price: 15,
  },
  {
    file_type: TreeFileType.VIDEO,
    currency: StripeCurrencyEnum.ua,
    price: 70,
  },
  {
    file_type: TreeFileType.VIDEO,
    currency: StripeCurrencyEnum.en,
    price: 10,
  },
  {
    file_type: TreeFileType.VIDEO,
    currency: StripeCurrencyEnum.pl,
    price: 15,
  },

  {
    file_type: TreeFileType.AUDIO,
    currency: StripeCurrencyEnum.ua,
    price: 70,
  },

  {
    file_type: TreeFileType.AUDIO,
    currency: StripeCurrencyEnum.en,
    price: 10,
  },
  {
    file_type: TreeFileType.AUDIO,
    currency: StripeCurrencyEnum.pl,
    price: 15,
  },
];

export const casketPricing = [
  {
    type: TypeOfCasketEnum.PREMIUM,
    price: 800,
    currency: StripeCurrencyEnum.ua,
  },
  {
    type: TypeOfCasketEnum.PREMIUM,
    price: 100,
    currency: StripeCurrencyEnum.en,
  },
  {
    type: TypeOfCasketEnum.PREMIUM,
    price: 150,
    currency: StripeCurrencyEnum.pl,
  },
  {
    type: TypeOfCasketEnum.DEFAULT,
    price: 0,
    currency: StripeCurrencyEnum.ua,
  },
  {
    type: TypeOfCasketEnum.DEFAULT,
    price: 50,
    currency: StripeCurrencyEnum.en,
  },
  {
    type: TypeOfCasketEnum.DEFAULT,
    price: 0,
    currency: StripeCurrencyEnum.pl,
  },
];
