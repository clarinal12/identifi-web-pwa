import { IAccount } from './user';

export type TOneOnOneInfo = {
  upcomingSessionDate: string,
  frequency: 'WEEKLY' | 'BI_WEEKLY',
  duration: number,
  scheduleId: string,
  currentSessionId: string,
  currentSessionStatus: 'UPCOMING' | 'HAPPENING' | 'INCOMPLETE' | 'COMPLETED' | 'SKIPPED',
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
  status: 'UPCOMING' | 'HAPPENING' | 'INCOMPLETE' | 'COMPLETED' | 'SKIPPED',
  showFeedback: boolean,
  canModifyFeedback: boolean,
  canModifyAgenda: boolean,
  feedbackInfo: TFeedbackInfo[],
  agenda: TAgenda[],
}

export interface IOneOnOneHeader {
  scheduleId: string,
  displayMember: IAccount,
  time: string,
  status: 'COMPLETED' | 'SKIPPED' | null,
  maxRescheduleDateRange: string,
  canRescheduleSession: boolean,
  canSkipSession: boolean,
  showCompleteButton: boolean,
  canCompleteSession: boolean,
}
