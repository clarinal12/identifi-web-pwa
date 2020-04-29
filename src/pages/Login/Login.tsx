import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Typography } from 'antd';
import LazyLoad from 'react-lazyload';
import queryString from 'query-string';

import LoginForm from './components/LoginForm';
import PageSpinner from 'components/PageSpinner';
import { ILoginFormValues } from './components/LoginForm/LoginForm';
import { setAuthToken } from 'utils/userUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import { SEND_MAGIC_LINK } from 'apollo/mutations/user';
import env from 'config/env';

const { Title } = Typography;

const Login: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [sendMagicLinkMutation] = useMutation(SEND_MAGIC_LINK);
  const { alertError, alertSuccess } = useMessageContextValue();

  const { code } = queryString.parse(location.search);
  const [loadingState, setLoadingState] = useState(Boolean(code));

  useEffect(() => {
    if (code) loginAction();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginAction = async () => {
    axios({
      method: 'POST',
      headers: {
        Authorization: `Basic ${code}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: process.env[`REACT_APP_${env}_AUTH_URL`],
    })
      .then((res) => {
        const { token } = res.data;
        setAuthToken(token);
        alertSuccess("Login success");
        history.replace('/');
      })
      .catch((e) => {
        const { data } = e.response;
        let errorMessage = "Network error";
        switch (data.error.code) {
          case 'INVALID_CREDENTIALS':
            errorMessage = 'Invalid Username or Password.';
            break;
          case 'MISSING_AUTH_HEADER':
            errorMessage = 'Missing Auth Header.';
            break;
          case 'INVALID_AUTH_HEADER':
            errorMessage = 'Invalid Auth Header.';
            break;
          default:
            errorMessage = data.error.message;
        }
        alertError(errorMessage);
        setLoadingState(false);
      });
  }

  const sendMagicLinkAction = async (values: ILoginFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      await sendMagicLinkMutation({
        variables: {
          input: { email: values.username },
        },
      });
      alertSuccess(`An email has been sent to ${values.username}.`);
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setSubmitting(false);
  }

  return (
    <Row>
      <Col sm={24} md={12}>
        {loadingState ? (
          <PageSpinner label="Verifying magic link..." />
        ) : (
          <div className="d-flex entry-point">
            <div className="p-4 p-md-5 form-content">
              <Title className="mb-5">
                Sign in
              </Title>
              <LoginForm onSubmit={sendMagicLinkAction} />
            </div>
          </div>
        )}
      </Col>
      <Col sm={24} md={12}>
        <div className="d-flex right-content">
          <LazyLoad height={200}>
            <img alt="Sign in" src={`${process.env.PUBLIC_URL}/assets/images/illustration-sign-in.png`} />
          </LazyLoad>
        </div>
      </Col>
    </Row>
  );
}

export default withRouter(Login);
