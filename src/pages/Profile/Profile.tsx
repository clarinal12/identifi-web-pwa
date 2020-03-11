import React from 'react';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Alert } from 'antd';

import AppLayout from 'components/AppLayout';
import { Spinner } from 'components/PageSpinner';
import UserDetails from './components/UserDetails';
import DirectReports from './components/DirectReports';
import Goals from './components/Goals';
import { useUserContextValue } from 'contexts/UserContext';
import { getDisplayName } from 'utils/userUtils';
import { MEMBER } from 'apollo/queries/member';
import { IAccount } from 'apollo/types/graphql-types';

const Profile: React.FC<RouteComponentProps<{ profile_id: string }>> = ({ match, history }) => {
  const { account } = useUserContextValue();

  const { data, loading, error } = useQuery(MEMBER, {
    variables: {
      memberId: match.params.profile_id || account?.id,
    },
    skip: !account,
    onCompleted: (data: { member: IAccount }) => {
      history.replace({
        state: {
          profile_id_alias: getDisplayName(data.member),
        },
      });
    }
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
      description="The profile you're looking for isn't available"
    />
  ) : (
    <>
      {loading ? (
        <Spinner label="Loading profile..." />
      ) : (
        <Row>
          <Col sm={24} md={6}>
            {data?.member && (
              <>
                <UserDetails memberInfo={data?.member} />
                {account?.isOwner && (
                  <DirectReports memberInfo={data?.member} />
                )}
              </>
            )}
          </Col>
          <Col sm={24} md={18}>
            {account && (
              <Goals memberId={match.params.profile_id || account.id} />
            )}
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
}

export default withRouter(Profile);
