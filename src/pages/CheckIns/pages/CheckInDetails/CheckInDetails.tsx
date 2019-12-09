import React from 'react';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Typography, Tag, Alert, Affix, Icon, Card } from 'antd';

import AppLayout from 'components/AppLayout';
import { CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { Spinner } from 'components/PageSpinner';
import { COLOR_MAP } from 'components/CheckInCard/CheckInCard';
import CheckInTabs from './components/CheckInTabs';

const { Title } = Typography;

const CheckInDetails: React.FC<RouteComponentProps<{ id: string }>> = ({ match, history }) => {
  const { data, loading, error } = useQuery(CHECKIN_SCHEDULE, {
    variables: { id: match.params.id },
    fetchPolicy: 'cache-and-network',
    onCompleted: data => history.replace({ state: { id_alias: data.checkInSchedule.name } }),
  });

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
    <>
      {loading ? (
        <Spinner loading label="Loading check-in..." />
      ) : (
        <Row className="mx-0" gutter={24}>
          <Col sm={24} md={16} className="pl-0">
            <Row className="mb-2">
              <Col sm={12}>
                <Title level={3}>{data.checkInSchedule.name}</Title>
              </Col>
              <Col sm={12} className="py-2">
                <Tag
                  className="float-right"
                  style={{ color: '#595959', fontSize: 16 }}
                  color={COLOR_MAP[data.checkInSchedule.status]}
                >
                  {data.checkInSchedule.status}
                </Tag>
              </Col>
            </Row>
            <CheckInTabs
              {...(data.checkInSchedule && { data: data.checkInSchedule })}
            />
          </Col>
          <Col sm={24} md={8} className="pr-0">
            <Affix offsetTop={24}>
              <Card
                title={(
                  <div className="d-flex" style={{ alignItems: 'center' }}>
                    <Icon type="calendar" className="mr-2 text-muted" />
                    <Title className="mb-0" style={{ fontSize: 16 }}>
                      Check-in history
                    </Title>
                  </div>
                )}
              >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Affix>
          </Col>
        </Row>
      )}
    </>
  );

  return (
    <AppLayout>
      {contentBody}
    </AppLayout>
  );
};

export default withRouter(CheckInDetails);
