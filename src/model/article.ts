import { MultiLanguage } from "./common";

export interface Category {
  id: string;
  label: MultiLanguage;
}

export interface Article {
  id: string;
  title: MultiLanguage;
  category: string;
  image: string;
}

export interface ArticleDetail {
  id: string;
  detail: MultiLanguage;
}
