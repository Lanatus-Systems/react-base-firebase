import { MultiLanguage } from "./common";

export interface Category {
  id: string;
  label: MultiLanguage;
  order: number;
  parent?: string;
}

export type ContentType = "text" | "image" | "article";
export interface Content {
  type: ContentType;
  content?: MultiLanguage;
  image?: MultiLanguage;
  id?: string;
  align: "left" | "right" | "center";
}

export interface Story {
  content: MultiLanguage;
  image: MultiLanguage;
}

export interface Article {
  id: string;
  title: MultiLanguage;
  category: string;
  image: MultiLanguage;
  date: Date;
  author: string;
  storyCount: number;
}

export interface ArticleDetail {
  id: string;
  detail: MultiLanguage;
  content: Content[];
  stories: Story[];
}
