import React, { useEffect } from 'react';
import moment from 'moment';
import { Alert } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery } from 'react-apollo';

import CheckInDetailView from './components/CheckInDetailView';
import { Spinner } from 'components/PageSpinner';
import { CHECKIN } from 'apollo/queries/checkin';
import { ICheckinData } from 'apollo/types/checkin';
import { useMentionSourceContextValue } from 'contexts/MentionSourceContext';

interface ICheckInDetailContainer extends RouteComponentProps<{ past_checkin_id: string }> {
  data: ICheckinData,
}

const CheckInDetailContainer: React.FC<ICheckInDetailContainer> = ({ match, history, location, data }) => {
  const derivedPastCheckinId = match.params.past_checkin_id || '';
  const { setMentionSource } = useMentionSourceContextValue();

  const { data: checkInData, loading, error } = useQuery(CHECKIN, {
    variables: { id: derivedPastCheckinId },
    onCompleted: response => {
      history.replace({
        state: {
          ...location.state,
          ...(response.checkIn && { past_checkin_id_alias: moment(response.checkIn.date).format('MMM DD, YYYY') }),
        },
        ...(location.search && { search: location.search }),
      });
    },
    skip: !derivedPastCheckinId,
  });

  useEffect(() => {
    if (checkInData) {
      const { checkIn } = checkInData;
      setMentionSource(checkIn.mentionables);
    }
  }, [checkInData, setMentionSource]);

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
    <CheckInDetailView />
  );

  return loading ? (
    <Spinner label="Loading check-in details..." />
  ): contentBody;
};

export default withRouter(CheckInDetailContainer);
