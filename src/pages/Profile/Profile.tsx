import React from 'react';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Alert } from 'antd';

import AppLayout from 'components/AppLayout';
import { Spinner } from 'components/PageSpinner';
import UserDetails from './components/UserDetails';
import Goals from './components/Goals';
import { useUserContextValue } from 'contexts/UserContext';
import { getDisplayName } from 'utils/userUtils';
import { MEMBER } from 'apollo/queries/member';
import { IAccount } from 'apollo/types/graphql-types';

const Profile: React.FC<RouteComponentProps<{ profile_id: string }>> = ({ match, history }) => {
  const { account } = useUserContextValue();

  const { data, loading, error } = useQuery(MEMBER, {
    variables: {
      memberId: match.params.profile_id,
    },
    skip: !match.params.profile_id,
    onCompleted: (data: { member: IAccount }) => {
      history.replace({
        state: {
          profile_id_alias: getDisplayName(data.member),
        },
      });
    }
  });

  const memberInfoSource = (match.params.profile_id && data) ? data.member : account;
  
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
        <Spinner loading label="Loading profile..." />
      ) : (
        <Row>
          <Col sm={24} md={6}>
            <UserDetails
              memberInfo={memberInfoSource}
            />
          </Col>
          <Col sm={24} md={18}>
            <Goals />
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
