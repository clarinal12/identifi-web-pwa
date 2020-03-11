export interface IGoal {
  id: string,
  title: string,
  target: number,
  current: number,
  type: 'INTEGER',
  unit: string,
}

export type TActiveCompany = {
  id: string,
  name: string,
  slackEnabled: boolean,
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
  manager: IAccount,
  directReports: IAccount[],
}
