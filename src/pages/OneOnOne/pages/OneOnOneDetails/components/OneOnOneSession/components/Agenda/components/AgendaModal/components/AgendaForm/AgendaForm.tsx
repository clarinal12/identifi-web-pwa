import React, { useRef } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { withFormik, FormikProps } from 'formik';

import AppTextEditor from 'components/AppTextEditor';
import { IRefObject } from 'components/AppTextEditor/AppTextEditor';
import { agendaFormSchema } from './validation';
import { TAgenda } from 'apollo/types/oneOnOne';

interface IExternalProps {
  data?: TAgenda,
  onSubmit: (values: IAgendaFormValues) => void,
  setVisibility: (visibility: boolean) => void,
  deleteAction: () => void,
}

export interface IAgendaFormValues {
  topic: string,
  content: string,
}

const AgendaForm: React.FC<FormikProps<IAgendaFormValues> & IExternalProps> = ({
  values, handleBlur, handleChange, isSubmitting, errors, touched, deleteAction,
  setVisibility, setFieldValue, isValid, resetForm, handleSubmit, data,
}) => {
  const editorRef = useRef<IRefObject>(null);
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Row gutter={24}>
        <Col>
          <Form.Item
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
          <Form.Item className="m-0">
            <AppTextEditor
              ref={editorRef}
              disabled={isSubmitting}
              value={values.content}
              onChange={content => setFieldValue('content', content)}
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
              Delete this item
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
            {data ? 'Save changes' : 'Add item'}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, IAgendaFormValues>({
  validationSchema: agendaFormSchema,
  mapPropsToValues: ({ data }) => ({
    topic: data?.topic || '',
    content: data?.content || '',
  }),
  handleSubmit: (values, { props, resetForm, setSubmitting }) => {
    resetForm();
    setSubmitting(false);
    props.onSubmit(values);
  },
  displayName: 'AgendaForm',
})(AgendaForm);
