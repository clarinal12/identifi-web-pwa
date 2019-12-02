import React, { useEffect, useState } from 'react';
import { Moment } from 'moment';
import { Card, Typography } from 'antd';
import { useDebounce } from 'use-lodash-debounce';

import Schedule from './components/Schedule';
import { IScheduleFormValues } from './components/Schedule/Schedule';
import Respondents from './components/Respondents';
import Questions from './components/Questions';
import Settings from './components/Settings';

const { Title } = Typography;

interface ICheckInFormTabs {
  defaultValues: IFinalValues,
  parentValid: boolean,
  parentSubmitAction: (values: IFinalValues) => void,
}

interface ITabComponents extends ICheckInFormTabs {
  setActiveTabKey: (key: string) => void,
  setFormValue: (stateValues: IFinalValues) => void,
  parentSubmitAction: (values: IFinalValues) => void,
}

export interface IFinalValues {
  id?: string,
  name: string,
  respondents: string[],
  questions: string[],
  slackChannelId: string,
  goalsEnabled: boolean,
  moodsEnabled: boolean,
  timings: {
    frequency: string,
    days: string[],
    time: Moment,
    waitingTime: number,
    remindTime: number,
    timezone: string,
  }
}

const TAB_STEPS = [{
  key: 'schedule',
  tab: <Title style={{ fontSize: 16 }}>Set Schedule</Title>,
  component: ({ defaultValues, setActiveTabKey, parentValid, setFormValue }: ITabComponents) => (
    <Schedule
      defaultValue={defaultValues.timings}
      parentValid={parentValid}
      onNextStep={() => setActiveTabKey && setActiveTabKey('respondents')}
      mergeValuesToState={(values: IScheduleFormValues) => {
        setFormValue({
          ...defaultValues,
          timings: {
            ...values,
          },
        })
      }}
    />
  ),
}, {
  key: 'respondents',
  tab: <Title style={{ fontSize: 16 }}>Choose Respondents</Title>,
  component: ({ defaultValues, setActiveTabKey, parentValid, setFormValue }: ITabComponents) => (
    <Respondents
      isUpdating={!!defaultValues.id}
      defaultValue={defaultValues.respondents}
      parentValid={parentValid}
      onNextStep={() => setActiveTabKey && setActiveTabKey('questions')}
      onBackStep={() => setActiveTabKey && setActiveTabKey('schedule')}
      mergeValuesToState={(values: string[]) => {
        setFormValue({
          ...defaultValues,
          respondents: values,
        })
      }}
    />
  ),
}, {
  key: 'questions',
  tab: <Title style={{ fontSize: 16 }}>Set Questions</Title>,
  component: ({ defaultValues, setActiveTabKey, parentValid, setFormValue }: ITabComponents) => (
    <Questions
      defaultValue={defaultValues.questions}
      goalsEnabled={defaultValues.goalsEnabled}
      moodsEnabled={defaultValues.moodsEnabled}
      parentValid={parentValid}
      onNextStep={() => setActiveTabKey && setActiveTabKey('slack')}
      onBackStep={() => setActiveTabKey && setActiveTabKey('respondents')}
      mergeQuestionsToState={(questions: string[]) => {
        setFormValue({
          ...defaultValues,
          questions,
        })
      }}
      mergeGoalStatusToState={(goalsEnabled: boolean) => {
        setFormValue({
          ...defaultValues,
          goalsEnabled,
        })
      }}
      mergeMoodStatusToState={(moodsEnabled: boolean) => {
        setFormValue({
          ...defaultValues,
          moodsEnabled,
        })
      }}
    />
  ),
}, {
  key: 'slack',
  tab: <Title style={{ fontSize: 16 }}>Slack Settings</Title>,
  component: ({ defaultValues, setActiveTabKey, parentValid, setFormValue, parentSubmitAction }: ITabComponents) => (
    <Settings
      isUpdating={!!defaultValues.id}
      defaultValue={defaultValues.slackChannelId}
      parentValid={parentValid}
      onBackStep={() => setActiveTabKey && setActiveTabKey('questions')}
      onSubmitForm={() => parentSubmitAction(defaultValues)}
      mergeValuesToState={(values: string) => {
        setFormValue({
          ...defaultValues,
          slackChannelId: values,
        })
      }}
    />
  ),
}];

const CheckInFormTabs: React.FC<ICheckInFormTabs> = ({ defaultValues, parentValid, parentSubmitAction }) => {
  const [activeTabKey, setActiveTabKey] = useState(TAB_STEPS[0].key);
  const [checkInFormValue, setCheckInFormValue] = useState(defaultValues);

  const debouncedNameValue = useDebounce(defaultValues.name, 500);
  useEffect(() => {
    setCheckInFormValue({
      ...checkInFormValue,
      name: debouncedNameValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameValue]);

  const { component: TabComponent } = TAB_STEPS.find(({ key }) => key === activeTabKey) || {
    component: (_: ICheckInFormTabs) => <div />,
  };

  return (
    <Card
      activeTabKey={activeTabKey}
      tabList={TAB_STEPS}
      className="checkin-form"
      // onTabChange={key => setActiveTabKey(key)}
    >
      <TabComponent
        parentSubmitAction={parentSubmitAction}
        setFormValue={setCheckInFormValue}
        defaultValues={checkInFormValue}
        setActiveTabKey={setActiveTabKey}
        parentValid={parentValid}
      />
    </Card>
  );
};

export default CheckInFormTabs;
