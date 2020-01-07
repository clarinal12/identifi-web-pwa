import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Button, Typography, Col, Row } from 'antd';

import GoalTracker from './components/GoalTracker';
import CustomQuestions from './components/CustomQuestions';
import MoodTracker from './components/MoodTracker';
import BlockTracker from './components/BlockTracker';
import { questionFormSchema } from './validation';

const { Text, Title } = Typography;

interface IExternalProps {
  defaultValue: string[],
  goalsEnabled: boolean,
  moodsEnabled: boolean,
  blockersEnabled: boolean,
  onNextStep: () => void,
  onBackStep: () => void,
  parentValid: boolean,
  mergeQuestionsToState: (values: string[]) => void,
  mergeGoalStatusToState: (value: boolean) => void,
  mergeMoodStatusToState: (value: boolean) => void,
  mergeBlockerStatusToState: (value: boolean) => void,
}

export interface IQuestionsFormValues {
  questions: string[],
  goalsEnabled: boolean,
  moodsEnabled: boolean,
  blockersEnabled: boolean,
}

const Questions: React.FC<IExternalProps & FormikProps<IQuestionsFormValues>> = ({
  values, isSubmitting, handleSubmit, isValid, setFieldValue, setFieldTouched, errors, touched,
  parentValid, onBackStep, mergeQuestionsToState, mergeGoalStatusToState, mergeMoodStatusToState, mergeBlockerStatusToState
}) => (
  <Form colon={false} onSubmit={handleSubmit}>
    <Row gutter={48}>
      <Col sm={24} md={12}>
        <div className="mb-4">
          <Title level={4}>Questions</Title>
          <Text className="fs-16">Your custom questions go here.</Text>
        </div>
        <Form.Item
          className="mb-0"
          {...((touched.questions && errors.questions) && {
            validateStatus: "error",
            help: typeof errors.questions === 'string' ? errors.questions : errors.questions[0],
          })}
        >
          <CustomQuestions
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            questions={values.questions}
            isSubmitting={isSubmitting}
            mergeQuestionsToState={mergeQuestionsToState}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12}>
        <div>
          <Title level={4}>Add-ons</Title>
        </div>
        <GoalTracker
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          goalsEnabled={values.goalsEnabled}
          isSubmitting={isSubmitting}
          mergeGoalStatusToState={mergeGoalStatusToState}
        />
        <MoodTracker
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          moodsEnabled={values.moodsEnabled}
          isSubmitting={isSubmitting}
          mergeMoodStatusToState={mergeMoodStatusToState}
        />
        <BlockTracker
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          blockersEnabled={values.blockersEnabled}
          isSubmitting={isSubmitting}
          mergeBlockerStatusToState={mergeBlockerStatusToState}
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
  validationSchema: questionFormSchema,
  mapPropsToValues: ({ defaultValue, goalsEnabled, moodsEnabled, blockersEnabled }) => ({
    questions: defaultValue,
    goalsEnabled,
    moodsEnabled,
    blockersEnabled,
  }),
  handleSubmit: (_, formikBag) => {
    const { setSubmitting, props } = formikBag;
    setSubmitting(false);
    props.onNextStep();
  },
  displayName: 'QuestionsForm',
})(Questions);
