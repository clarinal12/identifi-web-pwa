import React from 'react';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Alert } from 'antd';

import AppLayout from 'components/AppLayout';
import { Spinner } from 'components/PageSpinner';
import UserDetails from './components/UserDetails';
import DirectReports from './components/DirectReports';
import CheckIns from './components/CheckIns';
import Goals from './components/Goals';
import { MembersProvider } from 'contexts/MembersContext';
import { useUserContextValue } from 'contexts/UserContext';
import { getDisplayName } from 'utils/userUtils';
import { MEMBER } from 'apollo/queries/member';
import { IAccount } from 'apollo/types/user';

const Profile: React.FC<RouteComponentProps<{ profile_id: string }>> = ({ match, history }) => {
  const ApplicationWrapper = match.params.profile_id ? MembersProvider : ({ children }: any) => <>{children}</>;
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
        <Row gutter={24}>
          <Col sm={24} md={6}>
            {data?.member && (
              <>
                <UserDetails memberInfo={data?.member} />
                <DirectReports memberInfo={data?.member} />
              </>
            )}
          </Col>
          <Col sm={24} md={18}>
            {account && (
              <>
                <CheckIns memberId={match.params.profile_id || account.id}  />
                <Goals memberId={match.params.profile_id || account.id} />
              </>
            )}
          </Col>
        </Row>
      )}
    </>
  );

  return (
    <ApplicationWrapper>
      <AppLayout>
        {contentBody}
      </AppLayout>
    </ApplicationWrapper>
  );
}

export default withRouter(Profile);
