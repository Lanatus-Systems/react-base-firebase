import { MultiLanguage } from "./common";

export interface SubscriptionPackage {
  id: string;
  term: string;
  type: "digital" | "print";
  title: MultiLanguage;
  image: MultiLanguage;
  info: MultiLanguage;
  priceOffer: MultiLanguage;
  price: number;
}

export interface AppPage {
  id: string;
}
export interface SubscribePage extends AppPage {
  subHeadCoverImage: MultiLanguage;
  subHeadInfo: MultiLanguage;
  packages: SubscriptionPackage[];
}

export interface CheckoutPage extends AppPage {
  countries: string[];
  startOptions: MultiLanguage[];
  subHeadInfo?: MultiLanguage;
}
