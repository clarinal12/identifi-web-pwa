import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { withFormik, FormikProps } from 'formik';

import { inviteSetupFormSchema } from './validation';

const { Text } = Typography;

const StyledDiv = styled.div`
  width: 55%;
`;

export interface IInviteSetupFormValues {
  username: string,
  firstname: string,
  lastname: string,
  password: string,
  confirmPassword: string,
  location: string,
  role: string,
}

const InviteSetupForm: React.FC<FormikProps<IInviteSetupFormValues>> = ({
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
        readOnly
      />
    </Form.Item>
    <Row gutter={24} className="mx-0">
      <Col sm={24} md={12} className="pl-0">
        <Form.Item
          label="First name"
          {...((touched.firstname && errors.firstname) && {
            validateStatus: "error",
            help: errors.firstname,
          })}
        >
          <Input
            size="large"
            placeholder="Jane"
            name="firstname"
            value={values.firstname}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12} className="pr-0">
        <Form.Item
          label="Last name"
          {...((touched.lastname && errors.lastname) && {
            validateStatus: "error",
            help: errors.lastname,
          })}
        >
          <Input
            size="large"
            placeholder="Doe"
            name="lastname"
            value={values.lastname}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item
      label="Role"
      {...((touched.role && errors.role) && {
        validateStatus: "error",
        help: errors.role,
      })}
    >
      <Input
        size="large"
        placeholder="Managing Director / Marketing Director"
        name="role"
        value={values.role}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isSubmitting}
      />
    </Form.Item>
    <Form.Item
      label="Location"
      {...((touched.location && errors.location) && {
        validateStatus: "error",
        help: errors.location,
      })}
    >
      <Input
        size="large"
        placeholder="City / Country"
        name="location"
        value={values.location}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isSubmitting}
      />
    </Form.Item>
    <Row gutter={24} className="mx-0">
      <Col sm={24} md={12} className="pl-0">
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
      </Col>
      <Col sm={24} md={12} className="pr-0">
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
      </Col>
    </Row>
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
        Create account
      </Button>
    </Form.Item>
  </Form>
);

export default withFormik<{
  onSubmit: (values: IInviteSetupFormValues, setSubmitting: (isSubmitting: boolean) => void) => void,
  email: string,
}, IInviteSetupFormValues>({
  validationSchema: inviteSetupFormSchema,
  mapPropsToValues: ({ email }) => ({
    username: email,
    location: '',
    role: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
  }),
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting);
  },
  displayName: 'InviteSetupForm',
})(InviteSetupForm);
