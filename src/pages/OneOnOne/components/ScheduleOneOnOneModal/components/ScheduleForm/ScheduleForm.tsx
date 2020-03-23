import React from 'react';
import { Moment } from 'moment';
import moment from 'moment-timezone';
import { withFormik, FormikProps } from 'formik';
import { Row, Col, Form, Select, InputNumber, TimePicker, DatePicker, Button } from 'antd';

import { IOneOnOneSchedule } from 'apollo/types/oneOnOne';

const { Option } = Select;

interface IExternalProps {
  data?: IOneOnOneSchedule,
  setVisibility: (visibility: boolean) => void,
  onSubmitAction: (values: IScheduleFormValues) => void,
}

export interface IScheduleFormValues {
  frequency: 'WEEKLY' | 'BI_WEEKLY',
  duration: number,
  time: Moment,
}

const ScheduleForm: React.FC<FormikProps<IScheduleFormValues> & IExternalProps> = ({
  values, setFieldValue, isSubmitting, setFieldTouched, handleSubmit,
  setVisibility, data,
}) => {
  console.log(values.time.utc(false).format());
  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Row gutter={[24, 24]}>
        <Col sm={24} md={12}>
          <Form.Item
            className="m-0"
            label="Frequency"
          >
            <Select<string>
              size="large"
              placeholder="How often?"
              disabled={isSubmitting}
              value={values.frequency}
              onChange={v => {
                setFieldTouched('frequency');
                setFieldValue('frequency', v);
              }}       
            >
              <Option value="WEEKLY">Weekly</Option>
              <Option value="BI_WEEKLY">Bi-Weekly</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col sm={24} md={12}>
          <Form.Item
            className="m-0"
            label="Duration"
          >
            <InputNumber
              min={1}
              name="waitingTime"
              style={{ width: '100%' }}
              size="large"
              disabled={isSubmitting}
              value={values.duration}
              formatter={value => `${value} minutes`}
              parser={value => value?.replace('minutes', '').trim() || ''}
              onChange={(value) => {
                setFieldValue('duration', value);
                setFieldTouched('duration');
              }}
            />
          </Form.Item>
        </Col>
        <Col sm={24} md={12}>
          <Form.Item
            className="m-0"
            label="Starting date"
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
            label="Time"
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
      <div style={{ marginTop: 32 }} className="text-right">
        <Button
          disabled={isSubmitting}
          className="mr-4"
          size="large"
          onClick={() => setVisibility(false)}
        >
          Cancel
        </Button>
        <Button
          style={{ minWidth: 140 }}
          loading={isSubmitting}
          type="primary"
          size="large"
          htmlType="submit"
        >
          {data ? 'Save changes' : 'Schedule'}
        </Button>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, IScheduleFormValues>({
  mapPropsToValues: ({ data }) => {
    return {
      duration: data?.duration || 1,
      frequency: data?.frequency || 'WEEKLY',
      time: data ? moment(data.upcomingSessionDate) : moment(),
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    setSubmitting(false);
    props.onSubmitAction(values);
  },
  displayName: 'ScheduleForm',
})(ScheduleForm);
