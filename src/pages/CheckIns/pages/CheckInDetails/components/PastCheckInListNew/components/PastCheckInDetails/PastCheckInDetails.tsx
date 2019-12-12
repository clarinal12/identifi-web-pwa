import React from 'react';
import moment from 'moment';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { Alert } from 'antd';

import CheckInDetailView from '../../../CheckInDetailView';
import { Spinner } from 'components/PageSpinner';
import { CHECKIN } from 'apollo/queries/checkin';

interface IPastChecInDetails extends RouteComponentProps {
  id: string,
} 

const PastCheckInDetails: React.FC<IPastChecInDetails> = ({ id, history, location }) => {
  const { data, loading, error } = useQuery(CHECKIN, {
    variables: { id },
    onCompleted: data => {
      history.replace({
        state: {
          ...location.state,
          ...(data.checkIn && { date_alias: moment(data.checkIn.date).format('MMM DD, YYYY') }),
        }
      });
    },
  });

  if (error) {
    let errorMessage = "Network error";
    if (error.graphQLErrors[0]) {
      errorMessage = error.graphQLErrors[0].message;
    }
    return (
      <Alert
        showIcon
        type="warning"
        message={errorMessage}
        description="The check-in you're looking for isn't available"
      />
    );
  }

  return loading ? (
    <Spinner loading label="Loading check-in details..." />
  ): (
    <CheckInDetailView done data={data.checkIn} />
  );
}

export default withRouter(PastCheckInDetails);
