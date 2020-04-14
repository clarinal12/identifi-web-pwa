import React, { useRef } from 'react';
import styled from 'styled-components';
import { Modal, Form, Typography, Switch, Icon } from 'antd';
import { withFormik, FormikProps } from 'formik';

import AppTextEditor from 'components/AppTextEditor';
import { IRefObject } from 'components/AppTextEditor/AppTextEditor';
import { editBlockerFormSchema } from './validation';
import { TBlocker } from 'apollo/types/checkin';

const { Text } = Typography;

export interface IExternalProps {
  onSubmitAction: (
    values: Partial<TBlocker> & {
      isBlocked?: boolean,
    },
  ) => void,
  modalState: boolean,
  setModalState: (modalState: boolean) => void,
  data: Partial<TBlocker> & {
    isBlocked?: boolean,
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

const EditBlockerForm: React.FC<IExternalProps & FormikProps<Partial<TBlocker> & { isBlocked: boolean }>> = ({
  touched, errors, values,
  modalState, setModalState, data,
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
      afterClose={() => editorRef.current?.resetEditor(data?.blocker || '')}
      maskClosable={false}
    >
      <Form.Item className="mb-0">
        <Text strong className="text-muted">BLOCKER:</Text>
      </Form.Item>
      <Form.Item className="mb-1">
        <Switch
          disabled={isSubmitting}
          className="mr-2"
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={values.isBlocked}
          onChange={(value) => {
            setFieldTouched('isBlocked');
            setFieldValue('isBlocked', value);
          }}
        />
        <Text className="text-muted">Are you blocked by anything?</Text>
      </Form.Item>
      {values.isBlocked && (
        <Form.Item
          className="mb-0"
          {...((touched.blocker && errors.blocker) && {
            validateStatus: "error",
            help: errors.blocker,
          })}
        >
          <AppTextEditor
            ref={editorRef}
            disabled={isSubmitting}
            value={values.blocker || ''}
            placeholder="Enter your blocker"
            onChange={content => {
              setFieldTouched('blocker');
              setFieldValue('blocker', content);
            }}
          />
        </Form.Item>
      )}
    </StyledModal>
  );
}

export default withFormik<IExternalProps, Partial<TBlocker> & { isBlocked: boolean }>({
  validationSchema: editBlockerFormSchema,
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => ({
    blocker: data.blocker,
    isBlocked: true,
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    setSubmitting(false);
    props.onSubmitAction(values);
  },
  displayName: 'EditBlockerForm',
})(EditBlockerForm);
