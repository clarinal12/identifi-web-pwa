import React from 'react';
import { Moment } from 'moment';
import moment from 'moment';
import { withFormik, FormikProps } from 'formik';
import { Row, Col, Form, TimePicker, DatePicker, Button } from 'antd';

import { TOneOnOneInfo } from 'apollo/types/oneOnOne';
import { rescheduleOneOnOneFormSchema } from './validation';

interface IExternalProps {
  data?: Partial<TOneOnOneInfo>,
  maxRescheduleDate: string,
  setVisibility: (visibility: boolean) => void,
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
  maxRescheduleDate, touched, errors,
}) => {
  return (
    <Form className="mt-4" colon={false} onSubmit={handleSubmit}>
      <Row gutter={24} className="mb-5">
        <Col sm={24} md={12}>
          <Form.Item
            className="m-0"
            label="New date"
          >
            <DatePicker
              disabledDate={(current) => {
                if (!current) return false;
                const currentDateTime = moment().startOf('day');
                const maxAllowedDateToReschedule = moment(maxRescheduleDate).startOf('day');
                const hoursDiffFromToday = currentDateTime.diff(current.startOf('day'), 'hours', true);
                const hoursDiffTillLimit = maxAllowedDateToReschedule.diff(current.startOf('day'), 'hours', true);
                return hoursDiffFromToday > 0 || hoursDiffTillLimit < 0;
              }}
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
            {...((touched.time && errors.time) && {
              validateStatus: "error",
              help: errors.time,
            })}
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
      {/* <div style={{ padding: '32px 0 42px 0' }}>
        <Text className="fs-16">None of the dates work for you? You can also entirely skip this 1-1.</Text>
      </div> */}
      <div className="d-flex justify-content-end">
        <Button
          style={{ minWidth: 140 }}
          disabled={isSubmitting}
          className="mr-4"
          size="large"
          onClick={() => setVisibility(false)}
        >
          Cancel
        </Button>
        <Button
          style={{ minWidth: 140 }}
          disabled={Boolean(Object.keys(errors).length)}
          loading={isSubmitting}
          type="primary"
          size="large"
          htmlType="submit"
        >
          Postpone
        </Button>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, IRescheduleOneOnOneFormValues>({
  validationSchema: rescheduleOneOnOneFormSchema,
  isInitialValid: ({ data }) => {
    return rescheduleOneOnOneFormSchema.isValidSync({
      time: data ? moment(data.upcomingSessionDate) : moment().add(15, 'minutes'),
    });
  },
  mapPropsToValues: ({ data }) => {
    return {
      time: data ? moment(data.upcomingSessionDate) : moment().add(15, 'minutes'),
    };
  },
  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    props.onSubmitAction(values, setSubmitting, resetForm);
  },
  displayName: 'RescheduleOneOnOneForm',
})(RescheduleOneOnOneForm);
