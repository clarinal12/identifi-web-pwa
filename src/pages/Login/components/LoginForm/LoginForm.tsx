import React from 'react';
import { Link } from 'react-router-dom';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, Button, Typography } from 'antd';

import { loginFormSchema } from './validation';

export interface ILoginFormValues {
  username: string,
  password: string,
}

const { Text } = Typography;

const LoginForm: React.FC<FormikProps<ILoginFormValues>> = ({
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
      <Form.Item
        className="mb-2"
        label="Password"
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
      <div className="mb-4 text-right">
        <Link to="/forgot-password">Forgot password?</Link>
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
          Sign in
        </Button>
      </Form.Item>
      <Text>
        Don’t have an account?{' '}
        <Link to="/register">Create account</Link>
      </Text>
    </Form>
  );
};

export default withFormik<{
  onSubmit: (values: ILoginFormValues, setSubmitting: (isSubmitting: boolean) => void) => void,
}, ILoginFormValues>({
  validationSchema: loginFormSchema,
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting);
  },
  displayName: 'LoginForm',
})(LoginForm);
