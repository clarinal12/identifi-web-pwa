import React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';
import LazyLoad from 'react-lazyload';

import PageSpinner from 'components/PageSpinner';
import InviteSetupForm from './components/InviteSetupForm';
import { IInviteSetupFormValues } from './components/InviteSetupForm/InviteSetupForm';
import { setAuthToken } from 'utils/userUtils';
import { SETUP_INVITED_USER } from 'apollo/mutations/user';
import { ENTER_COMPANY } from 'apollo/mutations/setup';
import { useMessageContextValue } from 'contexts/MessageContext';
import { VERIFY_INVITE_TOKEN, ACCOUNT } from 'apollo/queries/user';

const { Title } = Typography;

const InviteSetup: React.FC<RouteComponentProps> = ({ history, location }) => {
  const { alertError } = useMessageContextValue();
  const [enterCompany] = useMutation(ENTER_COMPANY);
  const [setupInvitedUser] = useMutation(SETUP_INVITED_USER);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const companyId = queryParams.get('companyId');
  const email = queryParams.get('email');

  const { data, loading } = useQuery(VERIFY_INVITE_TOKEN, {
    variables: { token },
    skip: !token,
  });

  const inviteSignupAction = async (values: IInviteSetupFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    const { confirmPassword, username, ...other } = values;
    try {
      const result = await setupInvitedUser({
        variables: {
          input: { ...other },
          token,
        },
      });
      setAuthToken(result.data.setupInvitedUser);
      await enterCompany({
        variables: { companyId },
        refetchQueries: [{
          query: ACCOUNT,
        }],
        awaitRefetchQueries: true,
      });
      history.push("/");
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setSubmitting(false);
    }
  }
  
  const contentBody = !loading && (data?.verifyInviteToken) ? (
    <div className="p-4 p-md-5 form-content">
      <Title className="mb-5">
        Tell us about you
      </Title>
      <InviteSetupForm email={email || ''} onSubmit={inviteSignupAction} />
    </div>
  ) : (
    <div className="text-center">
      <Title className="mb-4" level={2}>
        This invite link is no longer valid.
      </Title>
    </div>
  )

  return (
    <Row>
      <Col sm={24} md={12}>
        {loading ? (
          <PageSpinner label="Verifying invite token" loading />
        ) : (
          <div className="d-flex entry-point">
            {contentBody}
          </div>
        )}
      </Col>
      <Col sm={24} md={12}>
        <div className="d-flex right-content">
          <LazyLoad height={200}>
            <img alt="Invite setup" src={`${process.env.PUBLIC_URL}/assets/images/illustration-invite-setup.png`} />
          </LazyLoad>
        </div>
      </Col>
    </Row>
  );
}

export default withRouter(InviteSetup);
