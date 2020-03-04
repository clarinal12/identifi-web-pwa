export type TActiveCompany = {
  id: string,
  name: string,
  slackEnabled: boolean,
}

export type TCheckInGoal = {
  id: string,
  createdAt: string,
  goal: string,
  completed: boolean,
}

export type TBlocker = {
  id: string,
  blocker: string,
}

export type TCheckInStats = {
  percentage: number,
  colored: IAccount[],
  faded: IAccount[],
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

export type TPastCheckIns = {
  id: string,
  date: string,
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

export interface IAccount {
  id: string,
  email: string,
  firstname: string,
  lastname: string,
  role: string | null,
  location: string | null,
  avatar: string | null
  timezone: string,
  onboarded: boolean,
  invited: boolean,
  isGuest: boolean,
  activeCompany: TActiveCompany
  isOwner: boolean,
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

export interface IGoal {
  id: string,
  title: string,
  target: number,
  current: number,
  type: 'INTEGER',
  unit: string,
}

export type TEmoji = {
  id: number,
  ios: string,
  web: string,
  description: string,
}

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