import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, InputNumber, Button } from 'antd';

import { goalFormSchema } from './validation';

interface IExternalProps {
  data?: IGoalFormValues,
  onCancel: () => void,
  onSubmit: (
    values: IGoalFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: () => void,
  ) => void,
}

export interface IGoalFormValues {
  title: string,
  target: number,
  initial: number,
  type: string,
}

const GoalForm: React.FC<IExternalProps & FormikProps<IGoalFormValues>> = ({
  handleSubmit, touched, errors, values, isSubmitting, handleChange, handleBlur, isValid,
  setFieldValue, setFieldTouched, onCancel,
}) => {
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Form.Item
        className="mb-2"
        label="Describe your goal"
        {...((touched.title && errors.title) && {
          validateStatus: "error",
          help: errors.title,
        })}
      >
        <Input
          size="large"
          placeholder="What do you want to achieve?"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </Form.Item>
      <Form.Item
        className="mb-2"
        label="Target value"
        {...((touched.target && errors.target) && {
          validateStatus: "error",
          help: errors.target,
        })}
      >
        <InputNumber
          min={0}
          name="target"
          style={{ width: '100%' }}
          size="large"
          placeholder="Set your target value"
          disabled={isSubmitting}
          value={values.target}
          onChange={(value) => {
            setFieldValue('target', value);
            setFieldTouched('target');
          }}
        />
      </Form.Item>
      <Form.Item
        className="mb-2"
        label="Initial value"
        {...((touched.initial && errors.initial) && {
          validateStatus: "error",
          help: errors.initial,
        })}
      >
        <InputNumber
          min={0}
          {...((typeof values.target === 'number') && {
            max: values.target,
          })}
          name="initial"
          style={{ width: '100%' }}
          size="large"
          placeholder="Set your initial value"
          disabled={isSubmitting}
          value={values.initial}
          onChange={(value) => {
            setFieldValue('initial', value);
            setFieldTouched('initial');
          }}
        />
      </Form.Item>
      <div className="d-flex pt-4" style={{ justifyContent: 'flex-end' }}>
        <Button
          size="large"
          className="mr-3"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!isValid}
        >
          Create goal
        </Button>
      </div>
    </Form>
  )
}

export default withFormik<IExternalProps, IGoalFormValues>({
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => ({
    title: data ? data.title : '',
    initial: data ? data.initial : 1,
    target: data ? data.target : 5,
    type: 'INTEGER',
  }),
  validationSchema: goalFormSchema,
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting, formikBag.resetForm);
  },
  displayName: 'GoalForm',
})(GoalForm);
