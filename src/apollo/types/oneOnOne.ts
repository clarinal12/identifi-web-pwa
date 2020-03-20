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

export type TFeedback = {
  id: string,
  content: string,
}

export type TFeedbackInfo = {
  feedback: TFeedback | null,
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
  status: 'COMPLETED' | 'SKIPPED' | null
  canModifyFeedback: boolean,
  canModifyAgenda: boolean,
  feedbackInfo: TFeedbackInfo[],
  agenda: TAgenda[],
}

export interface IOneOnOneSchedule extends TOneOnOneInfo {
  id: string,
  duration: number,
  displayMember: IAccount,
  canRescheduleCurrentSession: boolean,
  canSkipCurrentSession: boolean,
  maxRescheduleDateRange: string,
}
