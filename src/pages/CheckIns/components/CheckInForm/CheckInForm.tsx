import React from 'react';
import moment from 'moment';
import { withFormik, FormikProps } from 'formik';
import { Form, Input, Row, Col } from 'antd';

import { ICheckinData } from 'apollo/types/checkin';
import { checkInFormSchema } from './validation';
import CheckInFormTabs from './components/CheckInFormTabs';
import { IFinalValues } from './components/CheckInFormTabs/CheckInFormTabs';
import { WORKDAYS_VALUE } from './components/CheckInFormTabs/components/Schedule/Schedule';

interface IExternalProps {
  data?: ICheckinData,
  parentSubmitAction: (values: IFinalValues) => void,
}

const CheckInForm: React.FC<IExternalProps & FormikProps<{ name: string }>> = ({
  values, isSubmitting, handleChange, handleBlur, errors, touched, isValid,
  data, parentSubmitAction,
}) => {
  const defaultValues = {
    id: data?.scheduleId || '',
    name: values.name,
    respondents: data?.respondents.map(({ id }) => id) || [],
    watchers: data?.watchers.map(({ id }) => id) || [],
    questions: data?.questions || [],
    slackChannelId: data?.slackChannel.id || '',
    goalsEnabled: data?.goalsEnabled || true,
    moodsEnabled: data?.moodsEnabled || true,
    blockersEnabled: data?.blockersEnabled || true,
    isPrivate: data?.isPrivate || false,
    timings: {
      frequency: data?.frequency || 'WORKDAYS',
      days: data?.days || WORKDAYS_VALUE,
      time: function() {
        const momentObj = moment();
        if (data) {
          const [hour = 0, minutes = 0] = data.time.split(":");
          momentObj.set({
            hour: +hour,
            minutes: +minutes,
          });
        }
        return momentObj;
      }(),
      waitingTime: data?.waitingTime || 15,
      remindTime: data?.remindTime || 7,
      timezone: data?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  };
  return (
    <Row>
      <Col>
        <Form colon={false}>
          <Form.Item
            label="Check-in name"
            {...((touched.name && errors.name) && {
              validateStatus: "error",
              help: errors.name,
            })}
          >
            <Input
              size="large"
              placeholder="Title of your check-in"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          </Form.Item>
        </Form>
      </Col>
      <Col>
        <CheckInFormTabs
          defaultValues={defaultValues}
          parentValid={isValid}
          parentSubmitAction={parentSubmitAction}
        />
      </Col>
    </Row>
  );
}

export default withFormik<IExternalProps, { name: string }>({
  validationSchema: checkInFormSchema,
  isInitialValid: ({ data }) => !!data,
  mapPropsToValues: ({ data }) => ({
    name: data?.name || '',
  }),
  handleSubmit: () => {},
  displayName: 'CheckInForm',
})(CheckInForm);
