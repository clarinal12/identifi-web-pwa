import React from 'react';
import { useQuery } from 'react-apollo';
import { withFormik, FormikProps } from 'formik';
import { Form, Select, Button, Switch, Typography } from 'antd';

import { MEMBERS } from 'apollo/queries/member';
import { useUserContextValue } from 'contexts/UserContext';
import { respondentFormSchema } from './validation';
import { IAccount } from 'apollo/types/graphql-types';

const { Text } = Typography;

interface IRespondents {
  isPrivate: boolean,
  watchers: string[],
  respondents: string[],
}

interface IExternalProps extends IRespondents {
  onNextStep: () => void,
  onBackStep: () => void,
  parentValid: boolean,
  mergeRespondentsToState: (respondents: string[], watchers: string[]) => void,
  mergeWatchersToState: (values: string[]) => void,
  mergeIsPrivateToState: (value: boolean) => void,
  isUpdating: boolean,
}

const Respondents: React.FC<IExternalProps & FormikProps<IRespondents>> = ({
  values, isSubmitting, handleSubmit, errors, touched, isValid,
  setFieldValue, setFieldTouched, parentValid, onBackStep,
  mergeRespondentsToState, mergeWatchersToState, mergeIsPrivateToState,
}) => {
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;

  const { loading, data } = useQuery<{ members: IAccount[] }>(MEMBERS, {
    variables: {
      companyId: activeCompany && activeCompany.id
    }
  });

  const memberOptions = loading ? [] : (data || { members: [] }).members
    .map(({ id, firstname, lastname, email }) => {
      const derivedLabel = (firstname && lastname) ? `${firstname} ${lastname}` : email;
      return {
        value: id, label: derivedLabel,
      };
    });

  const watcherOptions = memberOptions.filter(({ value }) => !values.respondents.includes(value));

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
          optionFilterProp="label"
          optionLabelProp="label"
          onChange={(respondents) => {
            // remove as watcher if member is set as respondent
            const filteredWatchers = values.watchers.filter(watcher => !respondents.includes(watcher));
            setFieldTouched('respondents');
            setFieldValue('respondents', respondents);
            setFieldValue('watchers', filteredWatchers);
            mergeRespondentsToState(respondents, filteredWatchers);
          }}
        >
          {memberOptions.map(({ value, label }) => (
            <Select.Option key={value} value={value} label={label}>{label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Switch
          checked={values.isPrivate}
          className="mr-2"
          onChange={state => {
            setFieldValue('isPrivate', state);
            mergeIsPrivateToState(state);
            if (!state) {
              setFieldValue('watchers', []);
              mergeWatchersToState([]);
            }
          }}
        />
        <Text className="fs-16">Make this check-in visible to respondents and watchers only</Text>
      </Form.Item>
      {values.isPrivate && (
        <Form.Item
          label="Watchers"
          {...((touched.watchers && errors.watchers) && {
            validateStatus: "error",
            help: errors.watchers,
          })}
        >
          <Select<string[]>
            allowClear
            mode="multiple"
            size="large"
            disabled={isSubmitting}
            loading={loading}
            value={loading ? [] : values.watchers}
            placeholder="Select watchers"
            optionFilterProp="label"
            optionLabelProp="label"
            onChange={(value) => {
              setFieldValue('watchers', value);
              setFieldTouched('watchers');
              mergeWatchersToState(value);
            }}
          >
            {watcherOptions.map(({ value, label }) => (
              <Select.Option key={value} value={value} label={label}>{label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
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

export default withFormik<IExternalProps, IRespondents>({
  validationSchema: respondentFormSchema,
  isInitialValid: ({ isUpdating, respondents }) => isUpdating || respondents.length > 0,
  mapPropsToValues: ({ respondents, watchers, isPrivate }) => ({
    respondents,
    watchers,
    isPrivate,
  }),
  handleSubmit: (_, formikBag) => {
    const { setSubmitting, props } = formikBag;
    setSubmitting(false);
    props.onNextStep();
  },
  displayName: 'RespondentForm',
})(Respondents);
