import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Button, Typography, Col, Row } from 'antd';

import GoalTracker from './components/GoalTracker';
import CustomQuestions from './components/CustomQuestions';
import MoodTracker from './components/MoodTracker';

const { Text, Title } = Typography;

interface IExternalProps {
  defaultValue: string[],
  goalsEnabled: boolean,
  moodsEnabled: boolean,
  onNextStep: () => void,
  onBackStep: () => void,
  parentValid: boolean,
  mergeQuestionsToState: (values: string[]) => void,
  mergeGoalStatusToState: (value: boolean) => void,
  mergeMoodStatusToState: (value: boolean) => void,
}

export interface IQuestionsFormValues {
  questions: string[],
  goalsEnabled: boolean,
  moodsEnabled: boolean,
}

const Questions: React.FC<IExternalProps & FormikProps<IQuestionsFormValues>> = ({
  values, isSubmitting, handleSubmit, isValid,
  parentValid, onBackStep, mergeQuestionsToState, mergeGoalStatusToState, mergeMoodStatusToState,
}) => (
  <Form colon={false} onSubmit={handleSubmit}>
    <Row gutter={48}>
      <Col sm={24} md={12}>
        <div className="mb-4">
          <Title level={4}>Questions</Title>
          <Text style={{ fontSize: 16 }}>Your custom questions go here.</Text>
        </div>
        <CustomQuestions
          questions={values.questions}
          isSubmitting={isSubmitting}
          mergeQuestionsToState={mergeQuestionsToState}
        />
      </Col>
      <Col sm={24} md={12}>
        <div>
          <Title level={4}>Add-ons</Title>
        </div>
        <GoalTracker
          goalsEnabled={values.goalsEnabled}
          isSubmitting={isSubmitting}
          mergeGoalStatusToState={mergeGoalStatusToState}
        />
        <MoodTracker
          moodsEnabled={values.moodsEnabled}
          isSubmitting={isSubmitting}
          mergeMoodStatusToState={mergeMoodStatusToState}
        />
      </Col>
    </Row>
    <div className="float-right mt-4">
      <Button
        style={{ minWidth: 85 }}
        size="large"
        className="mr-2"
        onClick={onBackStep}
      >
        Back
      </Button>
      <Button
        style={{ minWidth: 85 }}
        size="large"
        type="primary"
        htmlType="submit"
        disabled={!isValid || !parentValid}
      >
        Next
      </Button>
    </div>
  </Form>
);

export default withFormik<IExternalProps, IQuestionsFormValues>({
  isInitialValid: true,
  mapPropsToValues: ({ defaultValue, goalsEnabled, moodsEnabled }) => ({
    questions: defaultValue,
    goalsEnabled,
    moodsEnabled,
  }),
  handleSubmit: (_, formikBag) => {
    const { setSubmitting, props } = formikBag;
    setSubmitting(false);
    props.onNextStep();
  },
  displayName: 'QuestionsForm',
})(Questions);
