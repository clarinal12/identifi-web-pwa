import React from 'react';
import { useMutation } from 'react-apollo';
import { Row, Col, Typography } from 'antd';
import LazyLoad from 'react-lazyload';

import ForgotPasswordForm from './components/ForgotPasswordForm';
import { IForgotPasswordFormValues } from './components/ForgotPasswordForm/ForgotPasswordForm';
import { useMessageContextValue } from 'contexts/MessageContext';
import { RECOVER_ACCOUNT } from 'apollo/mutations/user';

const { Title } = Typography;
const ForgotPassword = () => {
  const { alertError, alertSuccess } = useMessageContextValue();
  const [recoverAccount] = useMutation(RECOVER_ACCOUNT);

  const sendInstructionAction = async (values: IForgotPasswordFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const result = await recoverAccount({
        variables: {
          email: values.username,
        },
      });
      if (result.data.recoverAccount) {
        alertSuccess("We successfully sent an instruction to your email.");
        setSubmitting(false);
      }
    } catch(error) {
      let errorMessage = null;
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
              Reset Password
            </Title>
            <ForgotPasswordForm onSubmit={sendInstructionAction} />
          </div>
        </div>
      </Col>
      <Col sm={24} md={12}>
        <div className="d-flex right-content">
          <LazyLoad height={200}>
            <img alt="Forgot password" src={`${process.env.PUBLIC_URL}/assets/images/illustration-forgot-pw.png`} />
          </LazyLoad>
        </div>
      </Col>
    </Row>
  );
}

export default ForgotPassword;
