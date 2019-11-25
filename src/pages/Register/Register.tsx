import React from 'react';
import { useMutation } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';
import LazyLoad from 'react-lazyload';

import RegisterForm from './components/RegisterForm';
import { IRegisterFormValues } from './components/RegisterForm/RegisterForm';
import { setAuthToken } from 'utils/userUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import { SIGN_UP } from 'apollo/mutations/user';

const { Title } = Typography;

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const { alertError } = useMessageContextValue();
  const [signupUser] = useMutation(SIGN_UP);

  const registerAction = async (values: IRegisterFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const result = await signupUser({
        variables: {
          input: { email: values.username, password: values.password },
        },
      });
      setAuthToken(result.data.signUp);
      history.replace("/");
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setSubmitting(false);
    }
  }

  return (
    <Row>
      <Col sm={24} md={12}>
        <div className="d-flex entry-point">
          <div className="p-4 p-md-5 form-content">
            <Title className="mb-5">
              Create account
            </Title>
            <RegisterForm onSubmit={registerAction} />
          </div>
        </div>
      </Col>
      <Col sm={24} md={12}>
        <div className="d-flex right-content">
          <LazyLoad height={200}>
            <img alt="Sign up" src={`${process.env.PUBLIC_URL}/assets/images/illustration-create-account.png`} />
          </LazyLoad>
        </div>
      </Col>
    </Row>
  );
}

export default withRouter(Register);
