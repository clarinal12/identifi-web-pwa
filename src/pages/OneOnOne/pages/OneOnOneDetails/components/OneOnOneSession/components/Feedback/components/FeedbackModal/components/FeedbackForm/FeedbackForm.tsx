import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { withFormik, FormikProps } from 'formik';

import AppTextEditor from 'components/AppTextEditor';
import { feedbackFormSchema } from './validation';

interface IExternalProps {
  onSubmit: (values: IFeedbackFormValues) => void,
  setVisibility: (visibility: boolean) => void,
}

export interface IFeedbackFormValues {
  content: string,
}

const FeedbackForm: React.FC<FormikProps<IFeedbackFormValues> & IExternalProps> = ({
  values, isSubmitting, errors, touched, handleSubmit,
  setVisibility, setFieldValue, setFieldTouched, isValid, resetForm,
}) => {
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Row gutter={24}>
        <Col>
          <Form.Item
            className="m-0"
            {...((touched.content && errors.content) && {
              validateStatus: "error",
              help: errors.content,
            })}
          >
            <AppTextEditor
              value={values.content}
              onChange={content => {
                setFieldTouched('content');
                setFieldValue('content', content);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ marginTop: 32 }} className="text-right">
        <Button
          disabled={isSubmitting}
          className="mr-4"
          size="large"
          onClick={() => {
            resetForm();
            setVisibility(false);
          }}
        >
          Maybe later
        </Button>
        <Button
          style={{ minWidth: 140 }}
          loading={isSubmitting}
          disabled={!isValid}
          type="primary"
          size="large"
          htmlType="submit"
        >
          Submit feedback
        </Button>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, IFeedbackFormValues>({
  validationSchema: feedbackFormSchema,
  mapPropsToValues: () => ({
    content: '',
  }),
  handleSubmit: (values, { props, resetForm, setSubmitting }) => {
    resetForm();
    setSubmitting(false);
    props.onSubmit(values);
  },
  displayName: 'FeedbackForm',
})(FeedbackForm);
