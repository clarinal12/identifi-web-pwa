import { IAccount } from './user';

export type TOneOnOneInfo = {
  nextSessionDate: string,
  frequency: 'WEEKLY' | 'BI_WEEKLY',
  scheduleId: string,
  currentSessionId: string,
}

export interface IOneOnOnes {
  isManager: boolean,
  teammate: IAccount,
  info: TOneOnOneInfo | null,
  __typename: string,
}
