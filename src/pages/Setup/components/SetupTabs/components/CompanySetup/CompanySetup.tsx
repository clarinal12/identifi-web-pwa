import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, Button } from 'antd';

import { companySetupFormSchema } from './validation';

export interface ICompanyFormValues {
  companyName: string,
}

const CompanySetup: React.FC<FormikProps<ICompanyFormValues>> = ({
  values, isSubmitting, handleChange, handleBlur, handleSubmit, errors, touched, isValid,
}) => {
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Form.Item
        {...((touched.companyName && errors.companyName) && {
          validateStatus: "error",
          help: errors.companyName,
        })}
      >
        <Input
          size="large"
          placeholder="Maximum of 25 characters"
          name="companyName"
          value={values.companyName}
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
};

export default withFormik<{
  onSubmit: (values: ICompanyFormValues, setSubmitting: (isSubmitting: boolean) => void) => void,
  companyName: string,
}, ICompanyFormValues>({
  validationSchema: companySetupFormSchema,
  isInitialValid: props => !!props.companyName,
  mapPropsToValues: (props) => ({
    companyName: props.companyName,
  }),
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting);
  },
  displayName: 'CompanySetupForm',
})(CompanySetup);
