import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Row, Col, Typography, Spin, Alert } from 'antd';

import AppLayout from 'components/AppLayout';
import CheckInForm from '../../components/CheckInForm';
import { IFinalValues } from '../../components/CheckInForm/components/CheckInFormTabs/CheckInFormTabs';
import { ALL_CHECKIN_SCHEDULES, MY_CHECKIN_SCHEDULES, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { UPDATE_CHECKIN_SCHEDULE } from 'apollo/mutations/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';
import { LoadingIcon, Spinner } from 'components/PageSpinner';

const { Title } = Typography;

const EditCheckIn: React.FC<RouteComponentProps<{ checkin_id: string }>> = ({ history, match }) => {
  const [loadingState, setLoadingState] = useState(false);
  const { alertSuccess, alertError } = useMessageContextValue();
  const [updateCheckInSchedule] = useMutation(UPDATE_CHECKIN_SCHEDULE);

  const { data, loading, error } = useQuery(CHECKIN_SCHEDULE, {
    variables: { id: match.params.checkin_id },
    onCompleted: data => data.checkInSchedule && history.replace({ state: { checkin_id_alias: data.checkInSchedule.name } }),
  });

  let errorMessage = "Network error";
  if (error && error.graphQLErrors[0]) {
    errorMessage = error.graphQLErrors[0].message;
  }

  const updateCheckInAction = async (values: IFinalValues) => {
    setLoadingState(true);
    const { id, ...others } = values;
    const { timings } = others;
    try {
      const result = await updateCheckInSchedule({
        variables: {
          id: match.params.checkin_id,
          input: {
            ...others,
            timings: {
              ...timings,
              time: timings.time.format('HH:mm'),
            },
          },
        },
        refetchQueries: [
          { query: ALL_CHECKIN_SCHEDULES },
          { query: MY_CHECKIN_SCHEDULES },
        ],
        awaitRefetchQueries: true,
      });
      if (result.data.updateCheckInSchedule) {
        alertSuccess("Check-in has been updated");
        history.push('/checkins');
      }
    } catch(error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setLoadingState(false);
    }
  }

  return (
    <AppLayout>
      <Row className="mb-2">
        <Col>
          <Title level={3}>Check-ins</Title>
        </Col>
      </Row>
      {loading ? (
        <Spinner label="Loading check-in..." />
      ) : (
        <>
          {error ? (
            <Alert
              showIcon
              type="warning"
              message={errorMessage}
              description="The check-in you're trying to update isn't available"
            />
          ) : (
            <Spin
              spinning={loadingState}
              tip="Updating check-in..."
              indicator={LoadingIcon}
            >
              <CheckInForm
                {...(data && { data: data.checkInSchedule })}
                parentSubmitAction={updateCheckInAction}
              />
            </Spin>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default withRouter(EditCheckIn);
