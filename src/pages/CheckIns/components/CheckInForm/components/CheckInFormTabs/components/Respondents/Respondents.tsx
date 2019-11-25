import React from 'react';
import { useQuery } from 'react-apollo';
import { withFormik, FormikProps } from 'formik';
import { Form, Select, Button } from 'antd';

import { MEMBERS } from 'apollo/queries/member';
import { useUserContextValue } from 'contexts/UserContext';
import { respondentFormSchema } from './validation';
import { IAccount } from 'apollo/types/graphql-types';

// needed to avoid Select.Option throwing error for missing label property
// TODO: move in a global declaration file index.d.ts
declare module "antd/lib/select" {
  export interface OptionProps {
    label?: string;
  }
}

interface IExternalProps {
  defaultValue: string[],
  onNextStep: () => void,
  onBackStep: () => void,
  parentValid: boolean,
  mergeValuesToState: (values: string[]) => void,
  isUpdating: boolean,
}

const Respondents: React.FC<IExternalProps & FormikProps<{ respondents: string[] }>> = ({
  values, isSubmitting, handleSubmit, errors, touched, isValid,
  setFieldValue, setFieldTouched, parentValid, onBackStep, mergeValuesToState,
}) => {
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;

  const { loading, data } = useQuery<{ members: IAccount[] }>(MEMBERS, {
    variables: {
      companyId: activeCompany && activeCompany.id
    }
  });

  const memberOptions = loading ? [] : (data || { members: [] }).members
    .map(({ memberId, firstname, lastname, email }) => {
      const derivedLabel = (firstname && lastname) ? `${firstname} ${lastname}` : email;
      return {
        value: memberId, label: derivedLabel,
      };
    });

  return (
    <Form colon={false} onSubmit={handleSubmit}>
      <Form.Item
        label="Respondents"
        {...((touched.respondents && errors.respondents) && {
          validateStatus: "error",
          help: errors.respondents,
        })}
      >
        <Select<string[]>
          allowClear
          mode="multiple"
          size="large"
          disabled={isSubmitting}
          loading={loading}
          value={loading ? [] : values.respondents}
          placeholder="Select members"
          optionLabelProp="label"
          onChange={(value) => {
            setFieldValue('respondents', value);
            setFieldTouched('respondents');
            mergeValuesToState(value);
          }}
        >
          {memberOptions.map(({ value, label }) => (
            <Select.Option key={value} value={value} label={label}>{label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
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
          Next
        </Button>
      </div>
    </Form>
  );
}

export default withFormik<IExternalProps, { respondents: string[] }>({
  validationSchema: respondentFormSchema,
  isInitialValid: ({ isUpdating, defaultValue }) => isUpdating || (defaultValue && defaultValue.length > 0),
  mapPropsToValues: ({ defaultValue }) => ({
    respondents: defaultValue,
  }),
  handleSubmit: (_, formikBag) => {
    const { setSubmitting, props } = formikBag;
    setSubmitting(false);
    props.onNextStep();
  },
  displayName: 'RespondentForm',
})(Respondents);
