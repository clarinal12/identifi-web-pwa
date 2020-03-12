import { IAccount } from './user';

export type TOneOnOneInfo = {
  nextSessionDate: string,
  frequency: 'WEEKLY' | 'BI_WEEKLY',
}

export interface IOneOnOnes {
  id: string,
  teammate: IAccount,
  info: TOneOnOneInfo,
}
