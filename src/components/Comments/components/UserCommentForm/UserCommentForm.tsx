import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Avatar, Input, List } from 'antd';

import { useUserContextValue } from 'contexts/UserContext';
import { ADD_COMMENT } from 'apollo/mutations/comments';
import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN_SCHEDULE, CHECKIN } from 'apollo/queries/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';
import { usePastCheckInContextValue } from 'contexts/PastCheckInContext';

const { TextArea } = Input;

interface IUserCommentForm extends RouteComponentProps<{ id: string, date: string }> {
  sourceId: string,
}

const UserCommentForm: React.FC<IUserCommentForm> = ({ sourceId, match }) => {
  const [comment, setComment] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const { pastCheckInId } = usePastCheckInContextValue();
  const { account } = useUserContextValue();
  const { alertError } = useMessageContextValue();
  const [addComment] = useMutation(ADD_COMMENT);

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
        refetchQueries: [{
          query: COMMENTS,
          variables: {
            checkInResponseId: sourceId,
          },
        }, {
          query: match.params.date ? CHECKIN : CHECKIN_SCHEDULE,
          variables: {
            id: match.params.date ? pastCheckInId : match.params.id,
          }
        }],
        awaitRefetchQueries: true,
      });
      setComment('');
    } catch(error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar {...((account && account.avatar) && { src: account.avatar })} />}
        description={(
          <TextArea
            disabled={loadingState}
            value={comment}
            onChange={e => setComment(e.target.value)}
            onPressEnter={e => {
              if (!e.shiftKey) {
                e.preventDefault();
                addCommentAction();
              }
            }}
            placeholder="Add a comment"
            autoSize={{ minRows: 2 }}
          />
        )}
      />
    </List.Item>
  );
}

export default withRouter(UserCommentForm);
