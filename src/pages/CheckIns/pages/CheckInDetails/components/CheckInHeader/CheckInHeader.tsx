import React from 'react';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import moment from 'moment';
import { Card, Typography, Icon, Button, Tag, Alert } from 'antd';

import CheckInStats from './components/CheckInStats';
import CheckInFilter from './components/CheckInFilter';
import { COLOR_MAP } from 'utils/colorUtils';
import { Spinner } from 'components/PageSpinner';
import { useUserContextValue } from 'contexts/UserContext';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import { CHECKIN_HEADER } from 'apollo/queries/checkin';
import { TCheckInHeader } from 'apollo/types/checkin';

const { Title, Text } = Typography;

interface ICheckInHeaderQuery {
  checkInHeader: TCheckInHeader
}

const CheckInHeader: React.FC<RouteComponentProps<{ checkin_id: string, past_checkin_id: string }>> = ({ match, history, location }) => {
  const { account } = useUserContextValue();
  const { selectedCheckInCard } = useCheckInScheduleContextValue();
  const derivedCheckInId = match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;

  const { data, loading, error } = useQuery<ICheckInHeaderQuery>(CHECKIN_HEADER, {
    variables: {
      scheduleId: selectedCheckInCard?.scheduleId,
      checkInId: derivedCheckInId,
    },
    onCompleted: ({ checkInHeader }) => {
      history.replace({
        state: {
          checkin_id_alias: checkInHeader.name,
          past_checkin_id_alias: moment(checkInHeader.date).format('MMM DD, YYYY'),
        },
        ...(location.search && { search: location.search }),
      });
    },
    skip: !Boolean(selectedCheckInCard?.scheduleId),
  });

  if (error) {
    return (
      <Alert
        className="mb-3"
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
    );
  }

  return (loading || !data) ? (
    <Spinner label="Loading check-in details..." />
  ) : (
    <>
      <Card className="mb-3" style={{ background: '#006D75' }}>
        <div className="d-flex mb-2" style={{ justifyContent: 'space-between' }}>
          <div className="d-flex" style={{ alignItems: 'center' }}>
            <Title className="mb-0 mr-3" level={3} style={{ color: '#FFFFFF' }}>
              {data.checkInHeader.name}
            </Title>
          </div>
          {(account?.isOwner) && (
            <Link to={`/checkins/${match.params.checkin_id}/edit`}>
              <Button
                type="link"
                htmlType="button"
                size="large"
                className="p-0"
                style={{ fontSize: 20, color: '#E6FFFB' }}
              >
                <Icon type="setting" />
              </Button>
            </Link>
          )}
        </div>
        <div
          className="d-flex mt-2"
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text className="fs-16" style={{ color: '#E6FFFB' }}>
            {moment(data.checkInHeader.date).format('MMM DD, hh:mm a')}
          </Text>
          <div>
            <Tag className="m-0" color={COLOR_MAP[data.checkInHeader.status]}>
              <Text>{data.checkInHeader.status}</Text>
            </Tag>
          </div>
        </div>
      </Card>
      {data.checkInHeader.stats && (
        <CheckInStats data={data.checkInHeader.stats} />
      )}
      <CheckInFilter />
    </>
  );
}

export default withRouter(CheckInHeader);
