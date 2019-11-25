import React from 'react';
import { useQuery } from 'react-apollo';

import CheckInDetailView from '../../../CheckInDetailView';
import { Spinner } from 'components/PageSpinner';
import { CHECKIN } from 'apollo/queries/checkin';

const PastCheckInDetails: React.FC<{ id: string }> = ({ id }) => {
  const { data, loading } = useQuery(CHECKIN, {
    variables: { id },
  });
  return loading ? (
    <Spinner loading label="Loading check-in details..." />
  ): (
    <CheckInDetailView data={data.checkIn} />
  );
}

export default PastCheckInDetails;
