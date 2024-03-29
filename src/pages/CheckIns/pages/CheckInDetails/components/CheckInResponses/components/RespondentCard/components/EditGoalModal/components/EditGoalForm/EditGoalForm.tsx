import React, { useRef } from "react";
import moment from "moment";
import styled from "styled-components";
import {
  Modal,
  Form,
  Typography,
  Switch,
  Icon,
  Button,
  Popconfirm,
} from "antd";
import { withFormik, FormikProps } from "formik";

import AppTextEditor from "components/AppTextEditor";
import { IRefObject } from "components/AppTextEditor/AppTextEditor";
import { editGoalFormSchema } from "./validation";
import { TCheckInGoal } from "apollo/types/checkin";

const { Text } = Typography;

export interface IExternalProps {
  onSubmitAction: (values: Partial<TCheckInGoal>) => void;
  modalState: boolean;
  setModalState: (modalState: boolean) => void;
  showSwitch?: boolean;
  data: Partial<TCheckInGoal>;
  isOffline: boolean;
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

const EditGoalForm: React.FC<
  IExternalProps & FormikProps<Partial<TCheckInGoal>>
> = ({
  touched,
  errors,
  values,
  showSwitch,
  data,
  modalState,
  setModalState,
  setFieldTouched,
  setFieldValue,
  handleSubmit,
  isSubmitting,
  isValid,
  resetForm,
  isOffline,
}) => {
  const editorRef = useRef<IRefObject>(null);
  const timeAgo = moment(data.createdAt).calendar().toUpperCase().split(" AT");
  const dateString = timeAgo.includes("YESTERDAY")
    ? "YESTERDAY:"
    : `${timeAgo[0]}:`;
  return (
    <StyledModal
      destroyOnClose
      closable={false}
      visible={modalState}
      afterClose={() => editorRef.current?.resetEditor(data?.goal || "")}
      maskClosable={false}
      footer={[
        <Button
          onClick={() => {
            resetForm();
            setModalState(!modalState);
          }}
          disabled={isSubmitting}
          size="large"
          key="back"
          className="mr-2"
        >
          Cancel
        </Button>,
        <Popconfirm
          title="You are currently offline. Do you want to send your check-in in the background when you're back online?"
          onConfirm={() => handleSubmit()}
          okText="Yes"
          cancelText="No"
          disabled={!isOffline}
        >
          <Button
            onClick={isOffline ? () => {} : () => handleSubmit()}
            disabled={!isValid}
            loading={isSubmitting}
            size="large"
            key="submit"
            type="primary"
          >
            Save Changes
          </Button>
        </Popconfirm>,
      ]}
    >
      <Form.Item className="mb-0">
        <Text strong className="text-muted">
          {showSwitch ? dateString : "TODAY:"}
        </Text>
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
              setFieldTouched("completed");
              setFieldValue("completed", value);
            }}
          />
          <Text className="text-muted">
            Did you complete your previous goal?
          </Text>
        </Form.Item>
      )}
      <Form.Item
        className="mb-0"
        {...(touched.goal &&
          errors.goal && {
            validateStatus: "error",
            help: errors.goal,
          })}
      >
        <AppTextEditor
          ref={editorRef}
          disabled={isSubmitting}
          value={values.goal || ""}
          placeholder="Enter your goal"
          onChange={(content) => {
            setFieldTouched("goal");
            setFieldValue("goal", content);
          }}
        />
      </Form.Item>
    </StyledModal>
  );
};

export default withFormik<IExternalProps, Partial<TCheckInGoal>>({
  validationSchema: editGoalFormSchema,
  enableReinitialize: true,
  mapPropsToValues: ({ data }) => ({
    goal: data.goal,
    completed: data.completed,
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    setSubmitting(false);
    props.onSubmitAction(values);
  },
  displayName: "EditGoalForm",
})(EditGoalForm);
