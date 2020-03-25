import React from 'react';
import styled from 'styled-components';
import { Typography, Avatar } from 'antd';

import FeedbackModal from './components/FeedbackModal';
import { useUserContextValue } from 'contexts/UserContext';
import { NoFeedbackIcon } from 'utils/iconUtils';
import { getDisplayName } from 'utils/userUtils';
import { TFeedbackInfo } from 'apollo/types/oneOnOne';

const { Text } = Typography;

interface IFeedback {
  sessionId: string,
  canModifyFeedback?: boolean,
  feedbackInfo?: TFeedbackInfo[],
}

const StyledDiv = styled.div`
  .bordered-div {
    border-bottom: 1px solid #e1e4e980
    .icon-wrapper {
      background: #FAFAFA;
      border-radius: 50%;
      width: 85px;
      height: 85px;
    }
    &.first {
      padding-top: 0 !important;
    }
    &.last {
      border: none;
      padding-bottom: 0 !important;
    }
    .feedback-container {
      .edit-btn {
        display: none;
        width: auto;
        height: auto;
      }
      &:hover {
        .edit-btn {
          display: block;
        }
      }
    }
  }
`;
 
const Feedback: React.FC<IFeedback> = ({ feedbackInfo, canModifyFeedback, sessionId }) => {
  const { account } = useUserContextValue();
  const currentUser = feedbackInfo?.find(({ author }) => author.id === account?.id);
  const otherUser = feedbackInfo?.find(({ author }) => author.id !== account?.id);
  return (
    <StyledDiv>
      <div className="bordered-div d-flex py-3 align-items-center first">
        {otherUser?.feedback ? (
          <div className="w-100 feedback-container">
            <div className="d-flex justify-content-between">
              <Text type="secondary" className="fs-16 d-block">
                <div dangerouslySetInnerHTML={{ __html: otherUser?.feedback.content }} />
              </Text>
            </div>
            {otherUser?.author.avatar && (
              <div>
                <Avatar className="mr-2" src={otherUser.author.avatar} />
                <Text strong className="text-capitalize">{getDisplayName(otherUser.author)}</Text>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-center align-items-center icon-wrapper mx-3">
              <NoFeedbackIcon />
            </div>
            <div className="px-3">
              <Text type="secondary" className="fs-16 d-block">
                <span className="text-capitalize">{getDisplayName(otherUser?.author)}</span> didn’t leave any feedback for you yet.
              </Text>
            </div>
          </>
        )}
      </div>
      <div className="bordered-div d-flex py-3 align-items-center last">
        {currentUser?.feedback ? (
          <div className="w-100 feedback-container">
            <div className="d-flex justify-content-between">
              <Text type="secondary" className="fs-16 d-block">
                <div dangerouslySetInnerHTML={{ __html: currentUser?.feedback.content }} />
              </Text>
              {canModifyFeedback && (
                <FeedbackModal sessionId={sessionId} feedback={currentUser?.feedback} isEditing />
              )}              
            </div>
            {currentUser?.author.avatar && (
              <div>
                <Avatar className="mr-2" src={currentUser.author.avatar} />
                <Text strong>{getDisplayName(currentUser.author)}</Text>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-center align-items-center icon-wrapper mx-3">
              <NoFeedbackIcon />
            </div>
            <div className="px-3">
              <Text type="secondary" className="fs-16 d-block">
                You didn’t leave any feedback for <span className="text-capitalize">{getDisplayName(otherUser?.author)}</span>
              </Text>
              {canModifyFeedback && <FeedbackModal sessionId={sessionId} />}
            </div>
          </>
        )}
      </div>
    </StyledDiv>
  )
}

export default Feedback;
