import React from 'react';
import moment from 'moment';
import { Alert } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery } from 'react-apollo';

import CheckInDetailView from './components/CheckInDetailView';
import { Spinner } from 'components/PageSpinner';
import { CHECKIN } from 'apollo/queries/checkin';
import { ICheckinData } from 'apollo/types/graphql-types';

interface ICheckInDetailContainer extends RouteComponentProps<{ id: string, date: string }> {
  data: ICheckinData,
  pastCheckInId: string,
}

const CheckInDetailContainer: React.FC<ICheckInDetailContainer> = ({ pastCheckInId, history, location, data }) => {
  const { data: pastCheckInData, loading, error } = useQuery(CHECKIN, {
    variables: { id: pastCheckInId },
    onCompleted: data => {
      history.replace({
        state: {
          ...location.state,
          ...(data.checkIn && { date_alias: moment(data.checkIn.date).format('MMM DD, YYYY') }),
        }
      });
    },
    skip: !pastCheckInId,
  });

  const checkInSource = (pastCheckInData && !loading) ? pastCheckInData.checkIn : data.currentCheckIn;
  const contentBody = error ? (
    <Alert
      showIcon
      type="warning"
      message={function() {
        let errorMessage = "Network error";
        if (error.graphQLErrors[0]) {
          errorMessage = error.graphQLErrors[0].message;
        }
        return errorMessage;
      }()}
      description="The check-in you're looking for isn't available"
    />
  ) : (
    <CheckInDetailView done={!!pastCheckInId} data={checkInSource} />
  );

  return loading ? (
    <Spinner loading label="Loading check-in details..." />
  ): contentBody;
};

export default withRouter(CheckInDetailContainer);
