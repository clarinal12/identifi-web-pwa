import React from 'react';
import styled from 'styled-components';
import { Typography, Button } from 'antd';

import { NoFeedbackIcon } from 'utils/iconUtils';

const { Text } = Typography;

const StyledDiv = styled.div`
  &:not(:last-of-type) {
    border-bottom: 1px solid #e1e4e980
  }
  .icon-wrapper {
    background: #FAFAFA;
    border-radius: 50%;
    width: 85px;
    height: 85px;
  }
`;

const Feedback = () => {
  return (
    <div>
      <StyledDiv className="d-flex py-3 align-items-center">
        <div className="d-flex justify-content-center align-items-center icon-wrapper mx-3">
          <NoFeedbackIcon />
        </div>
        <div className="px-3">
          <Text type="secondary" className="fs-16 d-block">Chrisopher didn’t leave any feedback for you yet.</Text>
        </div>
      </StyledDiv>
      <StyledDiv className="d-flex py-3 align-items-center">
        <div className="d-flex justify-content-center align-items-center icon-wrapper mx-3">
          <NoFeedbackIcon />
        </div>
        <div className="px-3">
          <Text type="secondary" className="fs-16 d-block">You didn’t leave feedback for Christopher yet.</Text>
          <Button className="mt-3">Leave feedback</Button>
        </div>
      </StyledDiv>
    </div>
  )
}

export default Feedback;
