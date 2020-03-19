import { IAccount } from './user';

export type TOneOnOneInfo = {
  upcomingSessionDate: string,
  nextSessionDate: string,
  frequency: 'WEEKLY' | 'BI_WEEKLY',
  scheduleId: string,
  currentSessionId: string,
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
}

export interface IOneOnOnes {
  isManager: boolean,
  teammate: IAccount,
  info: TOneOnOneInfo | null,
  __typename: string,
}

export type TFeedbackInfo = {
  feedback: {
    id: string,
    content: string,
  }
  author: IAccount,
}

export type TAgenda = {
  id: string,
  topic: string,
  content: string,
  author: IAccount,
}

export interface IOneOnOneSession {
  id: string,
  time: string,
  completed: boolean,
  feedbackInfo: TFeedbackInfo[],
  agenda: TAgenda[],
}

export interface IOneOnOneSchedule extends TOneOnOneInfo {
  id: string,
  duration: number,
  displayMember: IAccount,
}
