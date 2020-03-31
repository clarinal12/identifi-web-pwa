import React, { useRef } from 'react';
import { Form, Button, Row, Col } from 'antd';
import { withFormik, FormikProps } from 'formik';

import AppTextEditor from 'components/AppTextEditor';
import { IRefObject } from 'components/AppTextEditor/AppTextEditor';
import { feedbackFormSchema } from './validation';
import { TFeedback } from 'apollo/types/oneOnOne';

interface IExternalProps {
  data?: TFeedback,
  onSubmit: (values: IFeedbackFormValues) => void,
  setVisibility: (visibility: boolean) => void,
  deleteAction: () => void,
}

export interface IFeedbackFormValues {
  content: string,
}

const FeedbackForm: React.FC<FormikProps<IFeedbackFormValues> & IExternalProps> = ({
  values, isSubmitting, errors, touched, handleSubmit, data, deleteAction,
  setVisibility, setFieldValue, setFieldTouched, isValid, resetForm,
}) => {
  const editorRef = useRef<IRefObject>(null);
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
              ref={editorRef}
              value={values.content}
              onChange={content => {
                setFieldTouched('content');
                setFieldValue('content', content);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="d-flex justify-content-between mt-4">
        <div>
          {data && (
            <Button
              ghost
              type="danger"
              disabled={isSubmitting}
              className="mr-4"
              size="large"
              onClick={deleteAction}
            >
              Delete feedback
            </Button>
          )}
        </div>
        <div>
          <Button
            disabled={isSubmitting}
            className="mr-4"
            size="large"
            onClick={() => {
              resetForm();
              editorRef.current?.resetEditor(data?.content || '');
              setVisibility(false);
            }}
          >
            {data ? 'Cancel' : 'Maybe later'}
          </Button>
          <Button
            style={{ minWidth: 140 }}
            loading={isSubmitting}
            disabled={!isValid}
            type="primary"
            size="large"
            htmlType="submit"
          >
            {data ? 'Save changes' : 'Submit feedback'}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, IFeedbackFormValues>({
  validationSchema: feedbackFormSchema,
  mapPropsToValues: ({ data }) => ({
    content: data?.content || '',
  }),
  handleSubmit: (values, { props, resetForm, setSubmitting }) => {
    resetForm();
    setSubmitting(false);
    props.onSubmit(values);
  },
  displayName: 'FeedbackForm',
})(FeedbackForm);
