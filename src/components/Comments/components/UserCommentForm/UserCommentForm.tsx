import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Avatar, List, Typography, Button } from 'antd';

import { useUserContextValue } from 'contexts/UserContext';
import { ADD_COMMENT, UPDATE_COMMENT } from 'apollo/mutations/comments';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import { useCheckInResponseFilterContextValue } from 'contexts/CheckInResponseFilterContext';
import MentionBox from './components/MentionBox';
import addCommentCacheHandler from './cache-handler/addComment';
import updateCommentCacheHandler from './cache-handler/updateComment';
import { IAccount } from 'apollo/types/user';

const { Text } = Typography;

interface IUserCommentForm extends RouteComponentProps<{ checkin_id: string, past_checkin_id: string }> {
  responseId: string,
  commentId?: string,
  defaultComment?: string,
  defaultMentions?: IAccount[],
  setEditCommentId?: (commentId: string | undefined) => void,
}

const StyledListItem = styled(List.Item)`
  div[class$="__suggestions"] {
    margin: 24px auto;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    ul {
      max-height: 250px;
      margin-bottom: 0;
      padding-left: 0;
      overflow: auto;
      outline: none;
      li {
        padding: 5px 12px;
        min-width: 100px;
        padding: 5px 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: background 0.3s ease;
        &:first-child {
          border-radius: 2px 2px 0 0;
        }
        &:last-child {
          border-radius: 0 0 2px 2px;
        }
        &:hover, &[class$="--focused"] {
          background: #f5f5f5;
        }
        .ant-list-item-meta-title {
          margin: 0;
        }
        .ant-list-item-meta-description {
          font-size: 12px;
        }
        .ant-list-item-meta-title, .ant-list-item-meta-description {
          line-height: 16px;
        }
      }
    }
  }
`;

const UserCommentForm: React.FC<IUserCommentForm> = ({
  responseId, match, defaultComment = '', commentId, setEditCommentId, defaultMentions = [], location,
}) => {
  const textAreaId = `textarea_${responseId}_${commentId}`;
  const isUpdating = Boolean(defaultComment && commentId && setEditCommentId);
  const [mentions, setMentions] = useState(defaultMentions);
  const [comment, setComment] = useState(defaultComment);

  const { responseFilterState } = useCheckInResponseFilterContextValue();
  const { account } = useUserContextValue();
  const { selectedCheckInCard } = useCheckInScheduleContextValue();
  const derivedCheckInId = match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;
  const { alertError } = useMessageContextValue();
  const [addCommentMutation] = useMutation(ADD_COMMENT);
  const [updateCommentMutation] = useMutation(UPDATE_COMMENT);

  useEffect(() => {
    const element = document.getElementById(textAreaId);
    const resetEditingState = (e: any) => {
      if (e.keyCode === 27 && isUpdating) { // Escape key code equivalent
        setComment('');
        setMentions([]);
        setEditCommentId && setEditCommentId(undefined);
      }
    }
    if (element) {
      element.addEventListener('keydown', resetEditingState);
      return () => {
        element.removeEventListener('keydown', resetEditingState);
      }
    }
  }, [textAreaId, setComment, setMentions, setEditCommentId, isUpdating]);

  const errorHandler = (error: any) => {
    let errorMessage = null;
    if (error.graphQLErrors[0]) {
      errorMessage = error.graphQLErrors[0].message;
    }
    alertError(errorMessage);
  }

  const addCommentAction = () => {
    try {
      addCommentMutation({
        variables: {
          input: {
            checkInResponseId: responseId,
            mentions: mentions.map(user => user.id),
            comment,
          },
        },
        ...addCommentCacheHandler({
          scheduleId: selectedCheckInCard?.scheduleId,
          checkInId: derivedCheckInId,
          checkInResponseId: responseId,
          values: { comment, mentions, author: account },
          filter: responseFilterState,
        }),
      });
      setComment('');
      setMentions([]);
    } catch(error) {
      errorHandler(error);
    }
  }

  const updateCommentAction = () => {
    try {
      updateCommentMutation({
        variables: {
          id: commentId,
          input: { comment, mentions: mentions.map(user => user.id) },
        },
        ...updateCommentCacheHandler({
          commentId,
          checkInResponseId: responseId,
          values: { comment, mentions, author: account },
        }),
      });
      setComment('');
      setMentions([]);
      if (setEditCommentId) {
        setEditCommentId(undefined);
      }
    } catch(error) {
      errorHandler(error);
    }
  }

  return (
    <StyledListItem>
      <List.Item.Meta
        {...account?.avatar && {
          avatar: (
            <Link to={`/profile/${account.id}`}>
              <Avatar style={{ width: 36, height: 36 }} src={account.avatar} />
            </Link>
          )
        }}
        description={(
          <>
            <MentionBox
              id={textAreaId}
              comment={comment}
              isUpdating={isUpdating}
              setComment={setComment}
              setMentions={setMentions}
              commentAction={isUpdating ? updateCommentAction : addCommentAction}
            />
            {isUpdating && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Press Esc to
                <Button
                  style={{ fontSize: 12 }}
                  onClick={() => setEditCommentId && setEditCommentId(undefined)}
                  className="p-0 ml-1"
                  size="small"
                  type="link"
                >
                  cancel
                </Button>
              </Text>
            )}
          </>
        )}
      />
    </StyledListItem>
  );
}

export default withRouter(UserCommentForm);
