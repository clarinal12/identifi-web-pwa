import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';

import FeedbackModal from './components/FeedbackModal';
import { useUserContextValue } from 'contexts/UserContext';
import { NoFeedbackIcon } from 'utils/iconUtils';
import { getDisplayName } from 'utils/userUtils';
import { TFeedbackInfo } from 'apollo/types/oneOnOne';

const { Text } = Typography;

interface IFeedback {
  feedbackInfo?: TFeedbackInfo[],
}

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
 
const Feedback: React.FC<IFeedback> = ({ feedbackInfo }) => {
  const { account } = useUserContextValue();
  const otherUser = feedbackInfo?.find(({ author }) => author.id !== account?.id);
  return (
    <div>
      <StyledDiv className="d-flex py-3 align-items-center">
        <div className="d-flex justify-content-center align-items-center icon-wrapper mx-3">
          <NoFeedbackIcon />
        </div>
        <div className="px-3">
          <Text type="secondary" className="fs-16 d-block">
            <span className="text-capitalize">{getDisplayName(otherUser?.author)}</span> didn’t leave any feedback for you yet.
          </Text>
        </div>
      </StyledDiv>
      <StyledDiv className="d-flex py-3 align-items-center">
        <div className="d-flex justify-content-center align-items-center icon-wrapper mx-3">
          <NoFeedbackIcon />
        </div>
        <div className="px-3">
          <Text type="secondary" className="fs-16 d-block">
            You didn’t leave any feedback for <span className="text-capitalize">{getDisplayName(otherUser?.author)}</span>
          </Text>
          <FeedbackModal />
        </div>
      </StyledDiv>
    </div>
  )
}

export default Feedback;
