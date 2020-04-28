import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, Button, Typography } from 'antd';

import { loginFormSchema } from './validation';

export interface ILoginFormValues {
  username: string,
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
      <div className="mb-4">
        <Text strong>Identifi is using passwordless login.</Text>&nbsp;
        <Text>Enter your email address to join and we’ll send you a magic link to login.</Text>
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
          Send me the magic link
        </Button>
      </Form.Item>
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
