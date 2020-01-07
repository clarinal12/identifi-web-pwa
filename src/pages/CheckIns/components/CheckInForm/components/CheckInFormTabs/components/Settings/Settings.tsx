import React from 'react';
import { useQuery } from 'react-apollo';
import { withFormik, FormikProps } from 'formik';
import pluralize from 'pluralize';
import { Row, Col, Form, Select, Button, Typography, Alert } from 'antd';

import { SLACK_CHANNELS } from 'apollo/queries/checkin';
import { useUserContextValue } from 'contexts/UserContext';
import { useMessageContextValue } from 'contexts/MessageContext';
import { settingsFormSchema } from './validation';

const { Title } = Typography;

interface IExternalProps {
  isUpdating: boolean,
  defaultValue: string,
  onSubmitForm: () => void,
  onBackStep: () => void,
  parentValid: boolean,
  mergeValuesToState: (values: string) => void,
}

interface ISettingsFormValues {
  slackChannelId: string,
}

const Settings: React.FC<IExternalProps & FormikProps<ISettingsFormValues>> = ({
  values, isSubmitting, handleSubmit, errors, touched, isValid, setFieldTouched, setFieldValue,
  parentValid, onBackStep, isUpdating, mergeValuesToState,
}) => {
  const { alertSuccess, alertWarning } = useMessageContextValue();
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;

  const { loading, data, refetch } = useQuery(SLACK_CHANNELS, {
    variables: {
      filter: { companyId: activeCompany && activeCompany.id },
    },
    notifyOnNetworkStatusChange: true,
  });

  const reloadChannels = async () => {
    refetch()
      .then((result) => {
        const { slackChannels } = result.data;
        const alertDisplay = slackChannels.length > 0 ? alertSuccess : alertWarning;
        alertDisplay(`Retrieved ${pluralize('channel', slackChannels.length, true)}`);
      });
  }

  const slackChannelOptions: Array<{ id: string, name: string }> = loading ? [] : data.slackChannels
  
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <div className="mb-4">
        <Title className="fs-16">Send the check-in link and notifications about new replies to:</Title>
      </div>
      <Row gutter={48}>
        <Col sm={24} md={8}>
          <Form.Item
            label="Slack channel"
            {...((touched.slackChannelId && errors.slackChannelId) && {
              validateStatus: "error",
              help: errors.slackChannelId,
            })}
          >
            <Select<string>
              showSearch
              size="large"
              disabled={isSubmitting}
              value={loading ? 'loading' : (values.slackChannelId || 'disabled')}
              loading={loading}
              optionFilterProp="label"
              optionLabelProp="label"
              onChange={(value) => {
                setFieldTouched('slackChannelId');
                setFieldValue('slackChannelId', value);
                mergeValuesToState(value);
              }}
            >
              {loading && (
                <Select.Option disabled value="loading" label="Loading">Loading</Select.Option>
              )}
              <Select.Option disabled value="disabled" label="Select one">Select one</Select.Option>
              {slackChannelOptions.map(({ id, name }) => (
                <Select.Option key={id} value={id} label={name}>{name}</Select.Option>
              ))}
            </Select>
            <Button
              className="float-right mt-2"
              type="primary"
              icon="reload"
              loading={loading}
              disabled={loading}
              onClick={reloadChannels}
            >
              Reload channels
            </Button>
          </Form.Item>
        </Col>
        <Col sm={24} md={16}>
          <Form.Item
            label={<div />}
          >
            <Alert
              message="Private slack channel"
              description="Your channel is not showing up? If it’s a private channel, make sure you’ve invited our Identifi bot to it."
              type="info"
              showIcon
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="float-right mt-4">
        <Button
          style={{ minWidth: 85 }}
          size="large"
          className="mr-2"
          onClick={onBackStep}
        >
          Back
        </Button>
        <Button
          style={{ minWidth: 85 }}
          size="large"
          type="primary"
          htmlType="submit"
          disabled={!isValid || !parentValid}
        >
          {isUpdating ? 'Save changes' : 'Submit'}
        </Button>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, ISettingsFormValues>({
  validationSchema: settingsFormSchema,
  isInitialValid: ({ isUpdating, defaultValue }) => isUpdating || !!defaultValue,
  mapPropsToValues: ({ defaultValue }) => ({
    slackChannelId: defaultValue,
  }),
  handleSubmit: (_, formikBag) => {
    const { setSubmitting, props } = formikBag;
    setSubmitting(false);
    props.onSubmitForm();
  },
  displayName: 'SettingsForm',
})(Settings);
