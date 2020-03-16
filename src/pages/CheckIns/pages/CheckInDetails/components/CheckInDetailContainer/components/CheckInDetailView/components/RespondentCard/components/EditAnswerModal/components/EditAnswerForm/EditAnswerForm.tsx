import React from 'react';
import styled from 'styled-components';
import { Modal, Form, Input, Typography } from 'antd';
import { withFormik, FormikProps } from 'formik';

import { editAnswerFormSchema } from './validation';

const { Text } = Typography;
const { TextArea } = Input;

export interface IExternalProps {
  onSubmitAction: (
    values: {
      answer: string,
    },
    setSubmitting: (isSubmitting: boolean) => void,
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
}) => (
  <StyledModal
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
      <TextArea
        autoFocus
        onFocus={(e) => {
          const tempValue = e.target.value;
          e.target.value = '';
          e.target.value = tempValue;
        }}
        disabled={isSubmitting}
        value={values.answer}
        onChange={e => {
          setFieldTouched('answer');
          setFieldValue('answer', e.target.value);
        }}
        placeholder="Enter your answer"
        autoSize={{ minRows: 1 }}
      />
    </Form.Item>
  </StyledModal>
);

export default withFormik<IExternalProps, { answer: string }>({
  validationSchema: editAnswerFormSchema,
  mapPropsToValues: ({ data }) => ({
    answer: data.answer,
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmitAction(values, setSubmitting);
  },
  displayName: 'EditAnswerForm',
})(EditAnswerForm);
