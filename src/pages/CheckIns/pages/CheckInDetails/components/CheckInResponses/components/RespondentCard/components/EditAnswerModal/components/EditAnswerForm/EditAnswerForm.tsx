import React, { useRef } from 'react';
import styled from 'styled-components';
import { Modal, Form, Typography } from 'antd';
import { withFormik, FormikProps } from 'formik';

import AppTextEditor from 'components/AppTextEditor';
import { IRefObject } from 'components/AppTextEditor/AppTextEditor';
import { editAnswerFormSchema } from './validation';

const { Text } = Typography;

export interface IExternalProps {
  onSubmitAction: (
    values: {
      answer: string,
    },
  ) => void,
  modalState: boolean,
  setModalState: (modalState: boolean) => void,
  data: {
    id: string,
    question: string,
    answer: string,
  },
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    .ant-modal-footer {
      border: none;
      padding: 0 24px 24px;
    }
  }
`;

const EditAnswerForm: React.FC<IExternalProps & FormikProps<{ answer: string }>> = ({
  touched, errors, values,
  data, setModalState, modalState,
  setFieldTouched, setFieldValue, handleSubmit,
  isSubmitting, isValid, resetForm,
}) => {
  const editorRef = useRef<IRefObject>(null);
  return (
    <StyledModal
      destroyOnClose
      closable={false}
      visible={modalState}
      okText="Save changes"
      okButtonProps={{
        disabled: !isValid,
        loading: isSubmitting,
        size: "large"
      }}
      cancelButtonProps={{
        disabled: isSubmitting,
        size: "large"
      }}
      onOk={() => handleSubmit()}
      onCancel={() => {
        resetForm();
        setModalState(!modalState);
      }}
      afterClose={() => editorRef.current?.resetEditor(data?.answer || '')}
      maskClosable={false}
    >
      <Form.Item className="mb-0">
        <Text strong className="text-muted">{data.question}</Text>
      </Form.Item>
      <Form.Item
        className="mb-0"
        {...((touched.answer && errors.answer) && {
          validateStatus: "error",
          help: errors.answer,
        })}
      >
        <AppTextEditor
          ref={editorRef}
          disabled={isSubmitting}
          value={values.answer || ''}
          placeholder="Enter your answer"
          onChange={content => {
            setFieldTouched('answer');
            setFieldValue('answer', content);
          }}
        />
      </Form.Item>
    </StyledModal>
  );
}

export default withFormik<IExternalProps, { answer: string }>({
  validationSchema: editAnswerFormSchema,
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => ({
    answer: data.answer,
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    setSubmitting(false);
    props.onSubmitAction(values);
  },
  displayName: 'EditAnswerForm',
})(EditAnswerForm);
