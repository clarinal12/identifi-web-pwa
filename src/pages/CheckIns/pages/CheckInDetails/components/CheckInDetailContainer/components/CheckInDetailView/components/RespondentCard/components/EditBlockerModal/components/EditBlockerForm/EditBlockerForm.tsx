import React from 'react';
import styled from 'styled-components';
import { Modal, Form, Input, Typography, Switch, Icon } from 'antd';
import { withFormik, FormikProps } from 'formik';

import { editBlockerFormSchema } from './validation';
import { TBlocker } from 'apollo/types/graphql-types';

const { Text } = Typography;
const { TextArea } = Input;

export interface IExternalProps {
  onSubmitAction: (
    values: Partial<TBlocker> & {
      isBlocked?: boolean,
    },
    setSubmitting: (isSubmitting: boolean) => void,
  ) => void,
  modalState: boolean,
  setModalState: (modalState: boolean) => void,
  data: Partial<TBlocker> & {
    isBlocked?: boolean,
  },
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    .ant-modal-close {
      display: none;
    }
    .ant-modal-footer {
      border: none;
      padding: 0 24px 24px;
    }
  }
`;

const EditBlockerForm: React.FC<IExternalProps & FormikProps<Partial<TBlocker> & { isBlocked: boolean }>> = ({
  touched, errors, values,
  modalState, setModalState,
  setFieldTouched, setFieldValue, handleSubmit,
  isSubmitting, isValid, resetForm,
}) => (
  <StyledModal
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
    {...(!isSubmitting && {
      onCancel: () => {
        resetForm();
        setModalState(!modalState);
      },
    })}
  >
    <Form.Item className="mb-0">
      <Text strong className="text-muted">BLOCKER:</Text>
    </Form.Item>
    <Form.Item className="mb-0">
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
        <TextArea
          autoFocus
          onFocus={(e) => {
            const tempValue = e.target.value;
            e.target.value = '';
            e.target.value = tempValue;
          }}
          disabled={isSubmitting}
          value={values.blocker}
          onChange={e => {
            setFieldTouched('blocker');
            setFieldValue('blocker', e.target.value);
          }}
          placeholder="Enter your blocker"
          autoSize={{ minRows: 1 }}
        />
      </Form.Item>
    )}
  </StyledModal>
);

export default withFormik<IExternalProps, Partial<TBlocker> & { isBlocked: boolean }>({
  validationSchema: editBlockerFormSchema,
  mapPropsToValues: ({ data }) => ({
    blocker: data.blocker,
    isBlocked: true,
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmitAction(values, setSubmitting);
  },
  displayName: 'EditBlockerForm',
})(EditBlockerForm);
