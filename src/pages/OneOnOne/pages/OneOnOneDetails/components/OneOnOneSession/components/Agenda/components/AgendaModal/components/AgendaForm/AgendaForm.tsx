import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { withFormik, FormikProps } from 'formik';

import AppTextEditor from 'components/AppTextEditor';
import { agendaFormSchema } from './validation';

interface IExternalProps {
  addOneOnOneAgendaAction: (values: IAgendaFormValues) => void,
  setVisibility: (visibility: boolean) => void,
}

export interface IAgendaFormValues {
  topic: string,
  content: string,
}

const AgendaForm: React.FC<FormikProps<IAgendaFormValues> & IExternalProps> = ({
  values, handleBlur, handleChange, isSubmitting, errors, touched,
  setVisibility, setFieldValue, setFieldTouched, isValid, resetForm, handleSubmit,
}) => {
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Row gutter={24}>
        <Col>
          <Form.Item
            className="m-0"
            label="Topic name"
            {...((touched.topic && errors.topic) && {
              validateStatus: "error",
              help: errors.topic,
            })}
          >
            <Input
              size="large"
              placeholder="Your topic"
              name="topic"
              value={values.topic}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            className="m-0"
            {...((touched.content && errors.content) && {
              validateStatus: "error",
              help: errors.content,
            })}
          >
            <AppTextEditor
              disabled={isSubmitting}
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
          Cancel
        </Button>
        <Button
          style={{ minWidth: 140 }}
          loading={isSubmitting}
          disabled={!isValid}
          type="primary"
          size="large"
          htmlType="submit"
        >
          Add item
        </Button>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, IAgendaFormValues>({
  validationSchema: agendaFormSchema,
  mapPropsToValues: () => ({
    topic: '',
    content: '',
  }),
  handleSubmit: (values, { props, resetForm, setSubmitting }) => {
    resetForm();
    setSubmitting(false);
    props.addOneOnOneAgendaAction(values);
  },
  displayName: 'AgendaForm',
})(AgendaForm);
