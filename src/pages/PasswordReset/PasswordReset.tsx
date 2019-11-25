import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation, useQuery } from 'react-apollo';
import { Row, Col, Typography, Button } from 'antd';
import LazyLoad from 'react-lazyload';

import PageSpinner from 'components/PageSpinner';
import PasswordResetForm from './components/PasswordResetForm';
import { IPasswordResetFormValues } from './components/PasswordResetForm/PasswordResetForm';
import { RESET_PASSWORD } from 'apollo/mutations/user';
import { useMessageContextValue } from 'contexts/MessageContext';
import { VERIFY_RESET_TOKEN } from 'apollo/queries/user';

const { Title } = Typography;

const PasswordReset: React.FC<RouteComponentProps> = ({ history, location }) => {
  const { alertError, alertSuccess } = useMessageContextValue();
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const { data, loading } = useQuery(VERIFY_RESET_TOKEN, {
    variables: { token },
    skip: !token,
  });

  const resetPasswordAction = async (values: IPasswordResetFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const result = await resetPassword({
        variables: {
          password: values.password,
          token,
        },
      });
      if (result.data.resetPassword) {
        alertSuccess("Password reset successfully! You can now login with your new password!");
        history.push("/login");
      }
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setSubmitting(false);
    }
  }

  const contentBody = !loading && (data && data.verifyResetToken) ? (
    <div className="p-4 p-md-5 form-content">
      <Title className="mb-5">
        Create new password
      </Title>
      <PasswordResetForm onSubmit={resetPasswordAction} />
    </div>
  ) : (
    <div className="text-center">
      <Title className="mb-4" level={2}>
        This reset link is no longer valid.
      </Title>
      <Button
        type="ghost"
        onClick={() => history.push("/forgot-password")}
      >
        Send me a new password request link.
      </Button>
    </div>
  )

  return (
    <Row>
      <Col sm={24} md={12}>
        {loading ? (
          <PageSpinner label="Verifying reset token" loading />
        ) : (
          <div className="d-flex entry-point">
            {contentBody}
          </div>
        )}
      </Col>
      <Col sm={24} md={12}>
        <div className="d-flex right-content">
          <LazyLoad height={200}>
            <img alt="Password reset" src={`${process.env.PUBLIC_URL}/assets/images/illustration-pw-reset.png`} />
          </LazyLoad>
        </div>
      </Col>
    </Row>
  );
}

export default withRouter(PasswordReset);
