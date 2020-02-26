import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Row, Col, Typography, Spin } from 'antd';

import AppLayout from 'components/AppLayout';
import CheckInForm from '../../components/CheckInForm';
import { IFinalValues } from '../../components/CheckInForm/components/CheckInFormTabs/CheckInFormTabs';
import { CHECKIN_CARDS } from 'apollo/queries/checkin';
import { CREATE_CHECKIN_SCHEDULE } from 'apollo/mutations/checkin';
import { useUserContextValue } from 'contexts/UserContext';
import { useMessageContextValue } from 'contexts/MessageContext';
import { LoadingIcon } from 'components/PageSpinner';

const { Title } = Typography;

const NewCheckIn: React.FC<RouteComponentProps> = ({ history }) => {
  const [loadingState, setLoadingState] = useState(false);
  const [createCheckInSchedule] = useMutation(CREATE_CHECKIN_SCHEDULE);
  const { alertSuccess, alertError } = useMessageContextValue();
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;

  const createCheckInAction = async (values: IFinalValues) => {
    setLoadingState(true);
    const { id, ...others } = values;
    const { timings } = others;
    try {
      const result = await createCheckInSchedule({
        variables: {
          input: {
            ...others,
            timings: {
              ...timings,
              time: timings.time.format('HH:mm'),
            },
            companyId: activeCompany && activeCompany.id,
          },
        },
        refetchQueries: [{
          query: CHECKIN_CARDS,
          variables: {
            companyId: activeCompany && activeCompany.id,
          },
        }],
        awaitRefetchQueries: true,
      });
      if (result.data.createCheckInSchedule) {
        alertSuccess("New check-in has been created");
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
      <Spin spinning={loadingState} tip="Processing check-in..." indicator={LoadingIcon}>
        <CheckInForm
          parentSubmitAction={createCheckInAction}
        />
      </Spin>
    </AppLayout>
  );
};

export default withRouter(NewCheckIn);
