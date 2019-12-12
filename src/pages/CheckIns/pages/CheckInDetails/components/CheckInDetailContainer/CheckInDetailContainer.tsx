import React from 'react';
import moment from 'moment';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery } from 'react-apollo';

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
  return (
    <div>
      Check-in container
    </div>
  )
};

export default withRouter(CheckInDetailContainer);
