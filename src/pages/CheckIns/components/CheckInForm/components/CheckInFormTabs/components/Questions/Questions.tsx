import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, Button, Typography } from 'antd';

import { questionFormSchema } from './validation';

const { Title } = Typography;

interface IExternalProps {
  defaultValue: string[],
  onNextStep: () => void,
  onBackStep: () => void,
  parentValid: boolean,
  mergeValuesToState: (values: IQuestionsFormValues) => void,
}

export interface IQuestionsFormValues {
  question1: string,
  question2: string,
  question3: string,
}

const Questions: React.FC<IExternalProps & FormikProps<IQuestionsFormValues>> = ({
  values, isSubmitting, handleSubmit, errors, touched, isValid, setFieldTouched, setFieldValue,
  parentValid, onBackStep, mergeValuesToState,
}) => (
  <Form colon={false} onSubmit={handleSubmit}>
    <div className="mb-4">
      <Title style={{ fontSize: 16 }}>Ask the respondents following questions:</Title>
    </div>
    <Form.Item
      label="Question 1"
      {...((touched.question1 && errors.question1) && {
        validateStatus: "error",
        help: errors.question1,
      })}
    >
      <Input
        name="question1"
        size="large"
        disabled={isSubmitting}
        value={values.question1}
        placeholder="First question"
        onChange={(e) => {
          setFieldTouched('question1');
          setFieldValue('question1', e.target.value);
          mergeValuesToState(values);
        }}
      />
    </Form.Item>
    <Form.Item
      label="Question 2"
      {...((touched.question2 && errors.question2) && {
        validateStatus: "error",
        help: errors.question2,
      })}
    >
      <Input
        name="question2"
        size="large"
        disabled={isSubmitting}
        value={values.question2}
        placeholder="2nd question"
        onChange={(e) => {
          setFieldTouched('question2');
          setFieldValue('question2', e.target.value);
          mergeValuesToState(values);
        }}
      />
    </Form.Item>
    <Form.Item
      label="Question 3"
      {...((touched.question3 && errors.question3) && {
        validateStatus: "error",
        help: errors.question3,
      })}
    >
      <Input
        name="question3"
        size="large"
        disabled={isSubmitting}
        value={values.question3}
        placeholder="3rd question"
        onChange={(e) => {
          setFieldTouched('question3');
          setFieldValue('question3', e.target.value);
          mergeValuesToState(values);
        }}
      />
    </Form.Item>
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
  validationSchema: questionFormSchema,
  isInitialValid: true,
  mapPropsToValues: ({ defaultValue }) => ({
    question1: defaultValue[0],
    question2: defaultValue[1],
    question3: defaultValue[2],
  }),
  handleSubmit: (values, formikBag) => {
    const { setSubmitting, props } = formikBag;
    setSubmitting(false);
    props.onNextStep();
  },
  displayName: 'QuestionsForm',
})(Questions);
