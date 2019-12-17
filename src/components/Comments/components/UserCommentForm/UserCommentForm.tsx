import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Avatar, Input, List } from 'antd';

import { useUserContextValue } from 'contexts/UserContext';
import { ADD_COMMENT } from 'apollo/mutations/comments';
import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN_SCHEDULE, CHECKIN } from 'apollo/queries/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';

const { TextArea } = Input;

interface IUserCommentForm extends RouteComponentProps<{ id: string, past_checkin_id: string }> {
  sourceId: string,
}

const UserCommentForm: React.FC<IUserCommentForm> = ({ sourceId, match }) => {
  const [comment, setComment] = useState('');
  const [loadingState, setLoadingState] = useState(false);

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
          query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
          variables: {
            id: match.params.past_checkin_id || match.params.id,
          },
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
