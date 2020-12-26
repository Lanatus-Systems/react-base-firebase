import { MultiLanguage } from "./common";

export interface Category {
  id: string;
  label: MultiLanguage;
}

export type ContentType = "text" | "image" | "article";
export interface Content {
  type: ContentType;
  content?: MultiLanguage;
  image?: string;
  id?: string;
  align: "left" | "right" | "center";
}

export interface Story {
  content: MultiLanguage;
  image: string;
}

export interface Article {
  id: string;
  title: MultiLanguage;
  category: string;
  image: string;
  date: Date;
  author: string;
}

export interface ArticleDetail {
  id: string;
  detail: MultiLanguage;
  content: Content[];
  stories: Story[];
}
