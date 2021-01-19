import { MultiLanguage } from "./common";

export interface SubscriptionPackage {
  id: string;
  title: MultiLanguage;
  image: MultiLanguage;
  info: MultiLanguage;
  priceOffer: MultiLanguage;
  price: number;
}

export interface SubscribePage {
  id: string;
  subHeadCoverImage: MultiLanguage;
  subHeadInfo: MultiLanguage;
  packages: SubscriptionPackage[];
}
