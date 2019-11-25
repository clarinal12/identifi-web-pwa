import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, Button } from 'antd';

import { passwordResetFormSchema } from './validation';

export interface IPasswordResetFormValues {
  password: string,
  confirmPassword: string,
}

const PasswordResetForm: React.FC<FormikProps<IPasswordResetFormValues>> = ({
  values, isSubmitting, handleChange, handleBlur, handleSubmit, errors, touched, isValid,
}) => {
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Form.Item
        label="New password"
        {...((touched.password && errors.password) && {
          validateStatus: "error",
          help: errors.password,
        })}
      >
        <Input.Password
          size="large"
          placeholder="******"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </Form.Item>
      <Form.Item
        label="Confirm new password"
        {...((touched.confirmPassword && errors.confirmPassword) && {
          validateStatus: "error",
          help: errors.confirmPassword,
        })}
      >
        <Input.Password
          size="large"
          placeholder="******"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          block
          disabled={isSubmitting || !isValid}
          loading={isSubmitting}
        >
          Reset password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withFormik<{
  onSubmit: (values: IPasswordResetFormValues, setSubmitting: (isSubmitting: boolean) => void) => void,
}, IPasswordResetFormValues>({
  validationSchema: passwordResetFormSchema,
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting);
  },
  displayName: 'PasswordResetForm',
})(PasswordResetForm);
