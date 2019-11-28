export type TActiveCompany = {
  id: string,
  name: string,
  slackEnabled: boolean,
}

export type TCheckInGoal = {
  createdAt: string,
  goal: string,
  completed: boolean,
}

export type TResponse = {
  respondent: IAccount,
  submitDate: Date,
  answers: Array<{
    question: string
    answer: string
  }>,
  onTime: boolean,
  goalCompleted: boolean,
  mood: number,
  currentGoal: TCheckInGoal,
  previousGoal: TCheckInGoal,
}

export type TPastCheckIns = {
  id: string,
  date: Date
}

export type TCurrentCheckIn = {
  id: string
  date: Date,
  submitted: IAccount[],
  notSubmitted: IAccount[],
  responses: TResponse[],
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
  activeCompany: TActiveCompany
  memberInfo: {
    memberId: string,
    isOwner: boolean,
  }
}

export interface IOKR {
  id: string,
  title: string,
  deadline: string,
  progress: number,
  description: string,
  owner?: IAccount,
  parentId?: string,
  objectiveId?: string,
  contributors?: IAccount[],
  completed?: boolean,
  unit?: '%' | '$' | '#',
  initial?: number,
  current?: number,
  target?: number,
  subObjectives?: IOKR[],
  keyResults?: IOKR[],
  __typename: string,
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
  respondents: IAccount[],
  questions: string[]
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
}