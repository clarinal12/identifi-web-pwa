import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Typography } from 'antd';
import LazyLoad from 'react-lazyload';

import LoginForm from './components/LoginForm';
import { ILoginFormValues } from './components/LoginForm/LoginForm';
import { setAuthToken } from 'utils/userUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import env from 'config/env';

const { Title } = Typography;

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { alertError, alertSuccess } = useMessageContextValue();

  const loginAction = async (values: ILoginFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    axios({
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${values.username}:${values.password}`)}`,
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
        switch (data.error) {
          case 'INVALID_CREDENTIALS':
            errorMessage = 'Invalid Username or Password.';
            break;
          case 'MISSING_AUTH_HEADER':
            errorMessage = 'Missing Auth Header.';
            break;
          case 'INVALID_AUTH_HEADER':
            errorMessage = 'Invalid Auth Header.';
            break;
        }
        alertError(errorMessage);
        setSubmitting(false);
      });
  }

  return (
    <Row>
      <Col sm={24} md={12}>
        <div className="d-flex entry-point">
          <div className="p-4 p-md-5 form-content">
            <Title className="mb-5">
              Sign in
            </Title>
            <LoginForm onSubmit={loginAction} />
          </div>
        </div>
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
