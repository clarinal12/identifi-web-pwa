import { IAccount } from './user';

export type TLink = {
  url: string,
  title: string,
  image: string,
  description: string,
}

export type TLinkCategory = {
  id: string,
  keyword: string,
}

export interface IStoredLink {
  id: string,
  link: TLink,
  category: TLinkCategory,
  sharedBy: IAccount,
}
