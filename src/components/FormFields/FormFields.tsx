import React from 'react';
import { FieldProps } from 'formik';
import { Form, Input, Select, DatePicker, TimePicker } from 'antd';
// import { InputProps } from 'antd/lib/input';
// import { SelectProps } from 'antd/lib/select';
// import { DatePickerProps } from 'antd/lib/date-picker/interface';
// import { TimePickerProps } from 'antd/lib/time-picker';

interface IFormikFieldsProps extends FieldProps {
  hasFeedback: boolean,
  selectOptions: Array<{name: string, value: string | number}>,
  submitCount: number,
  label?: string,
  placeholder?: string,
  type: string,
  disabled?: boolean,
}

const { Option } = Select;

const CreateAntField = (AntComponent: React.ComponentType<any>) => ({
  field,
  form,
  hasFeedback,
  label,
  selectOptions,
  submitCount,
  type,
  disabled,
  ...props
}: IFormikFieldsProps) => {
  const touched = form.touched[field.name];
  const submitted = submitCount > 0;
  const hasError = form.errors[field.name];
  const submittedError = hasError && submitted;
  const touchedError = hasError && touched;

  const onInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void =>
    form.setFieldValue(field.name, value);
  const onChange = (value: React.ChangeEvent): void =>
    form.setFieldValue(field.name, value);
  const onBlur = (): void => form.setFieldTouched(field.name, true);

  return (
    <Form.Item
      label={label}
      hasFeedback={
        !!((hasFeedback && submitted) || (hasFeedback && touched))
      }
      help={submittedError || touchedError ? hasError : false}
      validateStatus={submittedError || touchedError ? 'error' : 'success'}
    >
      <AntComponent
        {...field}
        {...props}
        type={type}
        onBlur={onBlur}
        onChange={type ? onInputChange : onChange}
        disabled={disabled}
        size="large"
      >
        {selectOptions && (
          selectOptions.map(({ name, value }) => <Option key={name} value={value}>{name}</Option>)
        )}
      </AntComponent>
    </Form.Item>
  );
};

export const AntInput = CreateAntField(Input);
export const AntSelect = CreateAntField(Select);
export const AntTimePicker = CreateAntField(TimePicker);
export const AntDatePicker = CreateAntField(DatePicker);
