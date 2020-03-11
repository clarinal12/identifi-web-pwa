import { IAccount } from './user';

export type TCheckInGoal = {
  id: string,
  createdAt: string,
  goal: string,
  completed: boolean,
}

export type TEmoji = {
  id: number,
  ios: string,
  web: string,
  description: string,
}

export type TBlocker = {
  id: string,
  blocker: string,
}

export type TReaction = {
  emoji: TEmoji,
  count: number,
  hasReacted: boolean,
}

export type TResponse = {
  id: string,
  respondent: IAccount,
  submitDate: Date,
  answers: Array<{
    id: string,
    question: string
    answer: string
  }>,
  onTime: boolean,
  goalCompleted: boolean,
  mood: TEmoji,
  block?: TBlocker,
  currentGoal: TCheckInGoal,
  previousGoal: TCheckInGoal,
  numberOfComments: number,
  reactions: TReaction[],
  streak: number,
}

export type TCurrentCheckIn = {
  id: string
  date: Date,
  submitted: IAccount[],
  notSubmitted: IAccount[],
  mentionables: IAccount[],
  responses: TResponse[],
  checkedIn: TCheckInStats,
  completedGoals: TCheckInStats,
  blockers: TCheckInStats,
  isCurrent: boolean,
}

export type TCheckInStats = {
  percentage: number,
  colored: IAccount[],
  faded: IAccount[],
}

export type TPastCheckIns = {
  id: string,
  date: string,
}

export interface ICheckinData {
  scheduleId: string,
  name: string,
  frequency: string
  days: string[]
  nextCheckInDate: Date,
  time: string,
  waitingTime: number,
  remindTime: number,
  timezone: string
  goalsEnabled: boolean,
  moodsEnabled: boolean,
  blockersEnabled: boolean,
  respondents: IAccount[],
  watchers: IAccount[],
  questions: string[],
  slackChannel: {
    id: string,
    name: string,
  },
  status: string
  currentCheckIn: TCurrentCheckIn,
  pastCheckIns: TPastCheckIns[],
  replies: {
    expected: number,
    total: number,
  }
  isPrivate: boolean,
}

export interface IComment {
  id: string,
  author: IAccount,
  comment: string,
  mentions: IAccount[],
  createdAt: string,
  updatedAt: string,
}
