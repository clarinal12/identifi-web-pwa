import React from 'react';
import moment, { Moment } from 'moment';
import { withFormik, FormikProps } from 'formik';
import { Row, Col, Form, Select, Checkbox, TimePicker, InputNumber, Button } from 'antd';

import { scheduleFormSchema } from './validation';

interface IExternalProps {
  defaultValue: IScheduleFormValues,
  onNextStep: () => void,
  parentValid: boolean,
  mergeValuesToState: (values: IScheduleFormValues) => void,
}

export interface IScheduleFormValues {
  frequency: string,
  days: string[],
  time: Moment,
  waitingTime: number,
  remindTime: number,
  timezone: string,
}

export const DAYS_OPTION = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WORKDAYS_VALUE = DAYS_OPTION.slice(1, 6).map(day => day.toUpperCase());

const Schedule: React.FC<IExternalProps & FormikProps<IScheduleFormValues>> = ({
  values, isSubmitting, handleSubmit, errors, touched, isValid,
  setFieldValue, setFieldTouched, parentValid,
}) => (
  <Form colon={false} onSubmit={handleSubmit}>
    <Row gutter={48}>
      <Col sm={24} md={6}>
        <Form.Item
          label="Run the check-in"
          {...((touched.frequency && errors.frequency) && {
            validateStatus: "error",
            help: errors.frequency,
          })}
        >
          <Select<string>
            showSearch
            size="large"
            disabled={isSubmitting}
            value={values.frequency}
            optionFilterProp="value"
            onChange={(value) => {
              if (value === 'WORKDAYS') {
                setFieldValue('days', WORKDAYS_VALUE);
                setFieldTouched('days');
              } else {
                setFieldValue('days', []);
                setFieldTouched('days');
              }
              setFieldValue('frequency', value);
              setFieldTouched('frequency');
            }}
          >
            <Select.Option value='disabled' disabled>Select one</Select.Option>
            {['Workdays', 'Weekly'].map((label) => (
              <Select.Option key={label} value={label.toUpperCase()}>{label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col sm={24} md={18}>
        <Form.Item
          label="Days selection"
          {...((touched.days && errors.days) && {
            validateStatus: "error",
            help: errors.days,
          })}
        >
          <Checkbox.Group
            disabled={isSubmitting || (values.frequency === 'WORKDAYS')}
            options={DAYS_OPTION.map(day => ({ label: day, value: day.toUpperCase() }))}
            value={values.days}
            onChange={(value) => {
              if (JSON.stringify(value) === JSON.stringify(WORKDAYS_VALUE)) {
                setFieldValue('frequency', 'WORKDAYS');
                setFieldTouched('frequency');
              }
              setFieldValue('days', value);
              setFieldTouched('days');
            }}
          />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={48}>
      <Col sm={24} md={6}>
        <Form.Item
          label="Time"
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
              setFieldValue('time', time);
              setFieldTouched('time');
            }}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={6}>
        <Form.Item
          label="Timezone"
          {...((touched.timezone && errors.timezone) && {
            validateStatus: "error",
            help: errors.timezone,
          })}
        >
          <Select<string>
            showSearch
            size="large"
            value={values.timezone || 'disabled'}
            disabled={isSubmitting}
            optionFilterProp="value"
            onChange={(value) => {
              setFieldValue('timezone', value);
              setFieldTouched('timezone');
            }}
          >
            <Select.Option value='disabled' disabled>Select one</Select.Option>
            {moment.tz.names().map((label) => (
              <Select.Option key={label} value={label}>{label} ({moment.tz(label).format('z Z')})</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={48}>
      <Col sm={24} md={6}>
        <Form.Item
          label="Waiting time for answers"
          {...((touched.waitingTime && errors.waitingTime) && {
            validateStatus: "error",
            help: errors.waitingTime,
          })}
        >
          <InputNumber
            min={5}
            name="waitingTime"
            style={{ width: '100%' }}
            size="large"
            disabled={isSubmitting}
            value={values.waitingTime}
            formatter={value => `${value} minutes`}
            parser={value => value?.replace('minutes', '').trim() || ''}
            onChange={(value) => {
              setFieldValue('waitingTime', value);
              setFieldTouched('waitingTime');
            }}
            onBlur={({ target }) => {
              const numValue = target.value.split(' ')[0];
              setFieldValue('remindTime', +numValue - 1);
              setFieldTouched('remindTime');
            }}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={6}>
        <Form.Item
          label="Remind if no answer after"
          {...((touched.remindTime && errors.remindTime) && {
            validateStatus: "error",
            help: errors.remindTime,
          })}
        >
          <InputNumber
            min={2}
            {...((typeof values.waitingTime === 'number') && {
              max: values.waitingTime - 1,
            })}
            name="remindTime"
            style={{ width: '100%' }}
            size="large"
            disabled={isSubmitting}
            value={values.remindTime}
            formatter={value => `${value} minutes`}
            parser={value => value?.replace('minutes', '').trim() || ''}
            onChange={(value) => {
              setFieldValue('remindTime', value);
              setFieldTouched('remindTime');
            }}
          />
        </Form.Item>
      </Col>
    </Row>
    <div className="float-right mt-4">
      <Button
        style={{ minWidth: 85 }}
        size="large"
        type="primary"
        htmlType="submit"
        disabled={!isValid || !parentValid}
      >
        Next
      </Button>
    </div>
  </Form>
);

export default withFormik<IExternalProps, IScheduleFormValues>({
  validationSchema: scheduleFormSchema,
  isInitialValid: true,
  mapPropsToValues: ({ defaultValue }) => ({
    frequency: defaultValue.frequency,
    days: defaultValue.days,
    time: defaultValue.time,
    waitingTime: defaultValue.waitingTime,
    remindTime: defaultValue.remindTime,
    timezone: defaultValue.timezone,
  }),
  handleSubmit: (values, formikBag) => {
    const { setSubmitting, props } = formikBag;
    setSubmitting(false);
    props.mergeValuesToState(values);
    props.onNextStep();
  },
  displayName: 'ScheduleForm',
})(Schedule);
