import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Modal, Form, Input, Typography, Switch, Icon } from 'antd';
import { withFormik, FormikProps } from 'formik';

import { editGoalFormSchema } from './validation';
import { TCheckInGoal } from 'apollo/types/graphql-types';

const { Text } = Typography;
const { TextArea } = Input;

export interface IExternalProps {
  onSubmitAction: (
    values: Partial<TCheckInGoal>,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => void,
  modalState: boolean,
  setModalState: (modalState: boolean) => void,
  showSwitch?: boolean,
  data: Partial<TCheckInGoal>,
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

const EditGoalForm: React.FC<IExternalProps & FormikProps<Partial<TCheckInGoal>>> = ({
  touched, errors, values, showSwitch,
  data, modalState, setModalState,
  setFieldTouched, setFieldValue, handleSubmit,
  isSubmitting, isValid, resetForm,
}) => {
  const timeAgo = moment(data.createdAt).calendar().toUpperCase().split(' AT');
  const dateString = timeAgo.includes('YESTERDAY') ? 'YESTERDAY:' : `${timeAgo[0]}:`;
  return (
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
        <Text strong className="text-muted">{showSwitch ? dateString : 'TODAY:'}</Text>
      </Form.Item>
      {showSwitch && (
        <Form.Item className="mb-0">
          <Switch
            disabled={isSubmitting}
            className="mr-2"
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={values.completed}
            onChange={(value) => {
              setFieldTouched('completed');
              setFieldValue('completed', value);
            }}
          />
          <Text className="text-muted">Did you complete your previous goal?</Text>
        </Form.Item>
      )}
      <Form.Item
        className="mb-0"
        {...((touched.goal && errors.goal) && {
          validateStatus: "error",
          help: errors.goal,
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
          value={values.goal}
          onChange={e => {
            setFieldTouched('goal');
            setFieldValue('goal', e.target.value);
          }}
          placeholder="Enter your goal"
          autoSize={{ minRows: 1 }}
        />
      </Form.Item>
    </StyledModal>
  );
}

export default withFormik<IExternalProps, Partial<TCheckInGoal>>({
  validationSchema: editGoalFormSchema,
  mapPropsToValues: ({ data }) => ({
    goal: data.goal,
    completed: data.completed,
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmitAction(values, setSubmitting);
  },
  displayName: 'EditGoalForm',
})(EditGoalForm);
