import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, InputNumber, Button } from 'antd';

import { goalFormSchema } from './validation';

interface IExternalProps {
  updateProgressState: boolean,
  data?: IGoalFormValues,
  onCancel: () => void,
  onSubmit: (
    values: IGoalFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: () => void,
  ) => void,
}

export interface IGoalFormValues {
  id?: string,
  title: string,
  target: number,
  current: number,
  type: string,
}

const GoalForm: React.FC<IExternalProps & FormikProps<IGoalFormValues>> = ({
  handleSubmit, touched, errors, values, isSubmitting, handleChange, handleBlur, isValid,
  setFieldValue, setFieldTouched, onCancel, data, updateProgressState,
}) => {
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      {!updateProgressState && (
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
      )}
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
        label={updateProgressState ? 'New value' : 'Initial value'}
        {...((touched.current && errors.current) && {
          validateStatus: "error",
          help: errors.current,
        })}
      >
        <InputNumber
          min={0}
          name="current"
          style={{ width: '100%' }}
          size="large"
          placeholder={updateProgressState ? 'Set your new value' : 'Set your initial value'}
          disabled={isSubmitting}
          value={values.current}
          onChange={(value) => {
            setFieldValue('current', value);
            setFieldTouched('current');
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
          {data ? 'Update' : 'Create'} goal
        </Button>
      </div>
    </Form>
  )
}

export default withFormik<IExternalProps, IGoalFormValues>({
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => ({
    title: data ? data.title : '',
    current: data ? data.current : 1,
    target: data ? data.target : 5,
    type: 'INTEGER',
  }),
  validationSchema: goalFormSchema,
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting, formikBag.resetForm);
  },
  displayName: 'GoalForm',
})(GoalForm);
