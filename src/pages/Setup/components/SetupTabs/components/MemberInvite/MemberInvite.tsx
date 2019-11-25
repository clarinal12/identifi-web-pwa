import React from 'react';
import styled from 'styled-components';
import { withFormik, FormikProps } from 'formik';
import { Form, Select, Button, Typography } from 'antd';

import { memberInviteFormSchema } from './validation';
import env from 'config/env';

const { Text } = Typography;

export interface IMemberInviteFormValues {
  emails: string[],
}

interface IExternalProps {
  onSubmit: (values: IMemberInviteFormValues, setSubmitting: (isSubmitting: boolean) => void) => void,
  onSkip: () => void,
}

const StyledFormItem = styled(Form.Item)`
  .ant-select-selection__rendered {
    margin: 4px 8px !important;
    .ant-select-selection__choice {
      background: #E6FFFB !important;
      border: 1px solid #B5F5EC !important;
      display: flex;
      align-items: center
    }
  }
`;

const MemberInvite: React.FC<IExternalProps & FormikProps<IMemberInviteFormValues>> = ({
  values, isSubmitting, setFieldTouched, setFieldValue, handleSubmit, errors, touched, isValid,
  setSubmitting, onSkip,
}) => (
  <Form colon={false} onSubmit={handleSubmit}>
    <Form.Item>
      <Button
        size="large"
        icon="slack"
        block
        onClick={() => {
          const slackCallbackURL = `${window.location.origin}/setup`;
          const slackURL = `https://slack.com/oauth/authorize?client_id=${process.env[`REACT_APP_${env}_SLACK_CLIENT_ID`]}&scope=commands,channels:read,chat:write:bot,groups:read,bot,users:read,users:read.email,team:read,chat:write:user&redirect_uri=${slackCallbackURL}`;
          window.location.href = slackURL;
        }}
      >
        Add a Slack Team
      </Button>
    </Form.Item>
    <div className="my-4 text-center">
      <Text strong>or</Text>
    </div>
    <StyledFormItem
      {...((touched.emails && errors.emails) && {
        validateStatus: "error",
        help: errors.emails,
      })}
    >
      <Select
        allowClear
        mode="tags"
        size="large"
        value={values.emails}
        placeholder="Enter multiple emails separated by ',' (commas)"
        dropdownClassName="d-none"
        tokenSeparators={[',']}
        onChange={(value: string[]) => {
          setFieldValue('emails', value);
          setFieldTouched('emails');
        }}
      />
    </StyledFormItem>
    <Form.Item>
      <Button
        type="primary"
        size="large"
        htmlType="submit"
        block
        disabled={isSubmitting || !isValid}
        loading={isSubmitting && isValid}
      >
        Send invitations
      </Button>
    </Form.Item>
    <Form.Item>
      <Button
        type="link"
        size="large"
        block
        disabled={isSubmitting}
        loading={isSubmitting}
        onClick={() => {
          setSubmitting(true);
          onSkip();
        }}
      >
        Do this later
      </Button>
    </Form.Item>
  </Form>
);

export default withFormik<IExternalProps, IMemberInviteFormValues>({
  validationSchema: memberInviteFormSchema,
  mapPropsToValues: () => ({
    emails: [],
  }),
  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit(values, formikBag.setSubmitting);
  },
  displayName: 'MemberInviteForm',
})(MemberInvite);
