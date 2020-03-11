import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, Button, Row, Col } from 'antd';

import { personalInfoFormSchema } from './validation';
import { IAccount } from 'apollo/types/user';

export interface IPersonalInfoFormValues {
  firstname: string,
  lastname: string,
  role: string,
  location: string,
}

interface IExternalProps {
  onSubmit: (values: IPersonalInfoFormValues, setSubmitting: (isSubmitting: boolean) => void) => void,
  account: IAccount | undefined,
}

const PersonalInfo: React.FC<FormikProps<IPersonalInfoFormValues>> = ({
  values, isSubmitting, handleChange, handleBlur, handleSubmit, errors, touched, isValid,
}) => (
  <Form colon={false} onSubmit={handleSubmit}>
    <Row gutter={24}>
      <Col xs={24} sm={12}>
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
      <Col xs={24} sm={12}>
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
        help: errors.firstname,
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
    <Form.Item>
      <Button
        type="primary"
        size="large"
        htmlType="submit"
        block
        disabled={isSubmitting || !isValid}
        loading={isSubmitting}
      >
        Continue
      </Button>
    </Form.Item>
  </Form>
);

export default withFormik<IExternalProps, IPersonalInfoFormValues>({
  validationSchema: personalInfoFormSchema,
  isInitialValid: ({ account }) => {
    const obj: { [key: string]: string } = {
      firstname: account?.firstname || '',
      lastname: account?.lastname  || '',
      location: account?.location || '',
      role: account?.role || '',
    };
    return !Object.keys(obj).some((key) => !obj[key]);
  },
  mapPropsToValues: ({ account }) => ({
    location: account?.firstname || '',
    role: account?.lastname || '',
    firstname: account?.firstname || '',
    lastname: account?.lastname || '',
  }),
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting);
  },
  displayName: 'PersonalInfoForm',
})(PersonalInfo);
