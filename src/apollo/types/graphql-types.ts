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

export type TCompany = {
  id: string,
  name: string,
  owner: IAccount,
  slackEnabled: boolean,
  createdAt: string,
  updatedAt: string,
}

export type TResponse = {
  id: string,
  respondent: IAccount,
  submitDate: Date,
  answers: Array<{
    question: string
    answer: string
  }>,
  onTime: boolean,
  goalCompleted: boolean,
  mood: TEmoji,
  block?: {
    id: string,
    blocker: string,
  },
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
  responses: TResponse[],
  checkedIn: TCheckInStats,
  completedGoals: TCheckInStats,
  blockers: TCheckInStats,
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
  memberId: string,
  isGuest: boolean,
  activeCompany: TActiveCompany
  memberInfo: {
    memberId: string,
    isOwner: boolean,
  }
}

export interface ICheckinData {
  id: string,
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
  company: TCompany,
  isPrivate: boolean,
}

export interface IComment {
  id: string,
  author: IAccount,
  comment: string,
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