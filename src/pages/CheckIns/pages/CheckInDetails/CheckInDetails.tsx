import React from 'react';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Typography, Tag } from 'antd';

import AppLayout from 'components/AppLayout';
import { CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { Spinner } from 'components/PageSpinner';
import { COLOR_MAP } from 'components/CheckInCard/CheckInCard';
import CheckInTabs from './components/CheckInTabs';

const { Title } = Typography;

const CheckInDetails: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const { data, loading } = useQuery(CHECKIN_SCHEDULE, {
    variables: { id: match.params.id },
    fetchPolicy: 'cache-and-network',
  });
  return (
    <AppLayout>
      {loading ? (
        <Spinner loading label="Loading check-in..." />
      ) : (
        <>
          <Row className="mb-2">
            <Col sm={12}>
              <Title level={3}>{data.checkInSchedule.name}</Title>
            </Col>
            <Col sm={12} className="py-2">
              <Tag
                className="float-right"
                style={{ color: '#595959' }}
                color={COLOR_MAP[data.checkInSchedule.status]}
              >
                {data.checkInSchedule.status}
              </Tag>
            </Col>
          </Row>
          <CheckInTabs
            {...(data.checkInSchedule && { data: data.checkInSchedule })}
          />
        </>
      )}
    </AppLayout>
  );
};

export default withRouter(CheckInDetails);
