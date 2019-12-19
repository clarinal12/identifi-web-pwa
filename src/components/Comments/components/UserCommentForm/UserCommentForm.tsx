import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Avatar, Input, List, Typography, Button } from 'antd';

import { useUserContextValue } from 'contexts/UserContext';
import { ADD_COMMENT, UPDATE_COMMENT } from 'apollo/mutations/comments';
import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN_SCHEDULE, CHECKIN } from 'apollo/queries/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';

const { TextArea } = Input;
const { Text } = Typography;

interface IUserCommentForm extends RouteComponentProps<{ id: string, past_checkin_id: string }> {
  sourceId: string,
  commentId?: string,
  defaultComment?: string,
  setEditCommentId?: (commentId: string | undefined) => void,
}

const UserCommentForm: React.FC<IUserCommentForm> = ({
  sourceId, match, defaultComment = '', commentId, setEditCommentId,
}) => {
  const textAreaId = `textarea_${sourceId}_${commentId}`;
  const isUpdating = !!(defaultComment && commentId && setEditCommentId);
  const [comment, setComment] = useState(defaultComment);
  const [loadingState, setLoadingState] = useState(false);

  const { account } = useUserContextValue();
  const { alertError } = useMessageContextValue();
  const [addComment] = useMutation(ADD_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);

  useEffect(() => {
    const element = document.getElementById(textAreaId);
    const resetEditingState = (e: any) => {
      if (e.keyCode === 27) { // Escape key code equivalent
        setComment('');
        setEditCommentId && setEditCommentId(undefined);
      }
    }
    if (element) {
      element.addEventListener('keydown', resetEditingState);
      return () => {
        element.removeEventListener('keydown', resetEditingState);
      }
    }
  }, [textAreaId, setComment, setEditCommentId, isUpdating]);

  const refetchQueries = [{
    query: COMMENTS,
    variables: {
      checkInResponseId: sourceId,
    },
  }, {
    query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
    variables: {
      id: match.params.past_checkin_id || match.params.id,
    },
  }];

  const errorHandler = (error: any) => {
    let errorMessage = null;
    if (error.graphQLErrors[0]) {
      errorMessage = error.graphQLErrors[0].message;
    }
    alertError(errorMessage);
  }

  const addCommentAction = async () => {
    setLoadingState(true);
    try {
      await addComment({
        variables: {
          input: {
            checkInResponseId: sourceId,
            comment,
          },
        },
        ...{ refetchQueries },
        awaitRefetchQueries: true,
      });
      setComment('');
    } catch(error) {
      errorHandler(error);
    }
    setLoadingState(false);
  }

  const updateCommentAction = async () => {
    setLoadingState(true);
    try {
      await updateComment({
        variables: {
          id: commentId,
          input: { comment },
        },
        ...{ refetchQueries },
        awaitRefetchQueries: true,
      });
      setComment('');
      if (setEditCommentId) {
        setEditCommentId(undefined);
      }
    } catch(error) {
      errorHandler(error);
    }
  }

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar {...((account && account.avatar) && { src: account.avatar })} />}
        description={(
          <>
            <TextArea
              id={textAreaId}
              autoFocus={isUpdating}
              {...(isUpdating && {
                onFocus: (e) => {
                  const tempValue = e.target.value;
                  e.target.value = '';
                  e.target.value = tempValue;
                },
              })}
              disabled={loadingState}
              value={comment}
              onChange={e => setComment(e.target.value)}
              onPressEnter={e => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  if (comment) {
                    isUpdating ? updateCommentAction() : addCommentAction();
                  }
                }
              }}
              placeholder="Add a comment"
              autoSize={{ minRows: 1 }}
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
    </List.Item>
  );
}

export default withRouter(UserCommentForm);
