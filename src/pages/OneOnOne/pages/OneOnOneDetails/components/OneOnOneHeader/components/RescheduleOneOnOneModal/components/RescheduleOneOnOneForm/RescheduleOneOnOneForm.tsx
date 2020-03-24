import React from 'react';
import { Moment } from 'moment';
import moment from 'moment-timezone';
import { withFormik, FormikProps } from 'formik';
import { Row, Col, Form, Typography, TimePicker, DatePicker, Button } from 'antd';

import { TOneOnOneInfo } from 'apollo/types/oneOnOne';

const { Text } = Typography;

interface IExternalProps {
  data?: Partial<TOneOnOneInfo>,
  skippingState: boolean,
  setVisibility: (visibility: boolean) => void,
  onSkipAction: () => void,
  onSubmitAction: (
    values: IRescheduleOneOnOneFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: () => void,
  ) => void,
}

export interface IRescheduleOneOnOneFormValues {
  time: Moment,
}

const RescheduleOneOnOneForm: React.FC<FormikProps<IRescheduleOneOnOneFormValues> & IExternalProps> = ({
  values, setFieldValue, isSubmitting, setFieldTouched, handleSubmit, setVisibility,
  onSkipAction, skippingState,
}) => {
  return (
    <Form className="mt-4" colon={false} onSubmit={handleSubmit}>
      <Row gutter={24}>
        <Col sm={24} md={12}>
          <Form.Item
            className="m-0"
            label="New date"
          >
            <DatePicker
              allowClear={false}
              style={{ width: '100%' }}
              value={values.time}
              size="large"
              disabled={isSubmitting}
              onChange={(date) => {
                const orignalValue = values.time;
                if (date) {
                  date.set({
                    hour: orignalValue.get('hour'),
                    minutes: orignalValue.get('minutes'),
                  });
                  setFieldTouched('time');
                  setFieldValue('time', date);
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col sm={24} md={12}>
          <Form.Item
            className="m-0"
            label="New time"
          >
            <TimePicker
              allowClear={false}
              style={{ width: '100%' }}
              value={values.time}
              use12Hours
              size="large"
              format="hh:mm A"
              disabled={isSubmitting}
              onChange={(time) => {
                const orignalValue = values.time;
                if (time) {
                  orignalValue.set({
                    hour: time.get('hour'),
                    minutes: time.get('minutes'),
                  });
                  setFieldTouched('time');
                  setFieldValue('time', orignalValue);
                }
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ padding: '32px 0 42px 0' }}>
        <Text className="fs-16">None of the dates work for you? You can also entirely skip this 1-1.</Text>
      </div>
      <div className="d-flex justify-content-between">
        <Button
          disabled={isSubmitting || skippingState}
          className="mr-4"
          size="large"
          onClick={() => setVisibility(false)}
        >
          Cancel
        </Button>
        <div>
          <Button
            disabled={isSubmitting}
            loading={skippingState}
            className="mr-4"
            size="large"
            onClick={onSkipAction}
          >
            Skip this 1-1
          </Button>
          <Button
            style={{ minWidth: 140 }}
            disabled={skippingState}
            loading={isSubmitting}
            type="primary"
            size="large"
            htmlType="submit"
          >
            Reschedule
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, IRescheduleOneOnOneFormValues>({
  mapPropsToValues: ({ data }) => {
    return {
      time: data ? moment(data.upcomingSessionDate) : moment(),
    };
  },
  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    props.onSubmitAction(values, setSubmitting, resetForm);
  },
  displayName: 'RescheduleOneOnOneForm',
})(RescheduleOneOnOneForm);
