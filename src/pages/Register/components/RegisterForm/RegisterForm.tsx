import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Typography } from 'antd';
import { withFormik, FormikProps } from 'formik';

import { registerFormSchema } from './validation';

const { Text } = Typography;

const StyledDiv = styled.div`
  width: 55%;
`;

export interface IRegisterFormValues {
  username: string,
  password: string,
  confirmPassword: string,
}

const RegisterForm: React.FC<FormikProps<IRegisterFormValues>> = ({
  values, isSubmitting, handleChange, handleBlur, handleSubmit, errors, touched, isValid,
}) => (
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
      label="Password"
      {...((touched.password && errors.password) && {
        validateStatus: "error",
        help: errors.password,
      })}
    >
      <Input.Password
        size="large"
        placeholder="Minimum of 6 characters"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isSubmitting}
      />
    </Form.Item>
    <Form.Item
      label="Confirm Password"
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
    <StyledDiv className="mb-4 text-center mx-auto">
      <Text>
        By signing up, you agreed to Identifi’s{' '}
        <Link to="/login">User Terms of Service</Link>
        {' '}and{' '}
        <Link to="/login">Privacy Policy.</Link>
      </Text>
    </StyledDiv>
    <Form.Item>
      <Button
        type="primary"
        size="large"
        htmlType="submit"
        block
        disabled={isSubmitting || !isValid}
        loading={isSubmitting}
      >
        Create your new account
      </Button>
    </Form.Item>
    <Text>
      Already have an account?{' '}
      <Link to="/login">Sign in</Link>
    </Text>
  </Form>
);

export default withFormik<{
  onSubmit: (values: IRegisterFormValues, setSubmitting: (isSubmitting: boolean) => void) => void,
}, IRegisterFormValues>({
  validationSchema: registerFormSchema,
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting);
  },
  displayName: 'RegisterForm',
})(RegisterForm);
