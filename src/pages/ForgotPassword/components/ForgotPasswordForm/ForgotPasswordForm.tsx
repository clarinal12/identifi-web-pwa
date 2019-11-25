import React from 'react';
import { Link } from 'react-router-dom';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, Button, Typography } from 'antd';

import { forgotPasswordFormSchema } from './validation';

const { Text } = Typography;

export interface IForgotPasswordFormValues {
  username: string,
}

const ForgotPasswordForm: React.FC<FormikProps<IForgotPasswordFormValues>> = ({
  values, isSubmitting, handleChange, handleBlur, handleSubmit, errors, touched, isValid,
}) => {
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Form.Item
        label="Email"
        {...((touched.username && errors.username) && {
          validateStatus: "error",
          help: errors.username,
        })}
      >
        <Input
          size="large"
          placeholder="email@example.com"
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </Form.Item>
      <div className="mb-4">
        <Text>
          Enter the email address you used when you joined and we’ll send you instructions to reset your password.
        </Text>
      </div>
      <Form.Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          block
          disabled={isSubmitting || !isValid}
          loading={isSubmitting}
        >
          Send password recovery link
        </Button>
      </Form.Item>
      <div className="mb-4">
        <Text>
          Don’t have an account?{' '}
          <Link to="/register">Create account</Link>
        </Text>
      </div>
      <div className="mb-4">
        <Text>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </Text>
      </div>
    </Form>
  );
};

export default withFormik<{
  onSubmit: (values: IForgotPasswordFormValues, setSubmitting: (isSubmitting: boolean) => void) => void,
}, IForgotPasswordFormValues>({
  validationSchema: forgotPasswordFormSchema,
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting);
  },
  displayName: 'ForgotPasswordForm',
})(ForgotPasswordForm);
