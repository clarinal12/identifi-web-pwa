import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';
import { Collapse, Typography, List, Avatar, Spin, Icon, Alert } from 'antd';

import Reactions from '../Reactions';
import UserCommentForm from './components/UserCommentForm';
import CommentActions from './components/CommentActions';
import { useUserContextValue } from 'contexts/UserContext';
import { getDisplayName } from 'utils/userUtils';
import { getMultipleLines } from 'utils/textUtils';
import { CollapsedDownIcon, CollapsedUpIcon } from 'utils/iconUtils';
import { COMMENTS } from 'apollo/queries/comments';
import { IComment, TReaction } from 'apollo/types/graphql-types';

const { Panel } = Collapse;
const { Text } = Typography;

interface IComments extends RouteComponentProps {
  responseId: string,
  numberOfComments: number,
  reactions: TReaction[],
}

const StyledCollapse = styled(Collapse)`
  .ant-collapse-item {
    border: none !important;
    .ant-collapse-header {
      padding: 16px 24px !important;
    }
    .ant-collapse-content {
      .ant-collapse-content-box {
        padding: 0 24px 24px !important;
      }
    }
    &.empty-comments {
      .ant-collapse-header {
        cursor: default;
      }
    }
  }
`;

const StyledList = styled(List)`
  .ant-list-item {
    align-items: flex-start !important;
    padding-top: 0 !important;
    padding-bottom: 16px !important;
    border: none !important;
    &:last-of-type {
      padding-bottom: 0 !important;
    }
    .ant-list-item-meta-title {
      font-size: 12px;
      line-height: 20px;
      a {
        font-weight: 600;
      }
    }
    .ant-list-item-action {
      margin-left: 24px;
    }
  }
`;

const StyledSpinnerWrapper = styled.div`
  .ant-spin-text {
    padding-top: 6px;
    font-size: 12px;
  }
`;

const CommentLoading = () => (
  <StyledSpinnerWrapper className="mb-3">
    <Spin
      className="d-block"
      indicator={<Icon type="loading" spin />}
      tip="Loading comments..."
      size="small"
      spinning
    />
  </StyledSpinnerWrapper>
);

const Comments: React.FC<IComments> = ({ numberOfComments, responseId, location, reactions }) => {
  const [editCommentId, setEditCommentId] = useState<string | undefined>(undefined);
  const [collapseKey, setCollapseKey] = useState<string | undefined>(undefined);
  const { account } = useUserContextValue();
  const memberInfo = account && account.memberInfo;
  const emptyComments = numberOfComments === 0;

  const { data, loading, error } = useQuery(COMMENTS, {
    variables: {
      checkInResponseId: responseId,
    },
    skip: !collapseKey,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseIdFromURL = queryParams.get('responseId');
    const commentId = queryParams.get('commentId');
    const isLinkFromNotification = (responseIdFromURL && commentId) && (responseIdFromURL === responseId);
    if (emptyComments || isLinkFromNotification) {
      setCollapseKey('1');
    }
  }, [emptyComments, location.search, responseId]);

  const contentBody = error ? (
    <Alert
      showIcon
      type="warning"
      message={function() {
        let errorMessage = "Network error";
        if (error.graphQLErrors[0]) {
          errorMessage = error.graphQLErrors[0].message;
        }
        return errorMessage;
      }()}
      description="Could not load the comments at the moment"
    />
  ) : (
    <StyledList>
      {data && data.checkInResponseComments.map(({ author, comment, id, createdAt, updatedAt }: IComment) => {
        const nameString = getDisplayName(author);
        const commentOwner = memberInfo && (author.memberId === memberInfo.memberId);
        const isEditing = (editCommentId === id);
        const isCommentEdited = createdAt !== updatedAt;
        return isEditing ? (
          <UserCommentForm
            key={id}
            responseId={responseId}
            commentId={id}
            defaultComment={comment}
            setEditCommentId={setEditCommentId}
          />
        ) : (
          <List.Item
            key={id}
            id={id}
            {...(commentOwner && {
              actions: [
                <CommentActions
                  commentId={id}
                  responseId={responseId}
                  setEditCommentId={setEditCommentId}
                />,
              ],
            })}
          >
            <List.Item.Meta
              avatar={(
                <Link to={`/profile/${author.memberId}`}>
                  <Avatar {...((author && author.avatar) && { src: author.avatar })} />
                </Link>
              )}
              title={
                <>
                  <Link
                    to={`/profile/${author.memberId}`}
                    className="mr-2"
                  >
                    {nameString}
                  </Link>
                  <Text className="font-weight-normal">
                    {moment(createdAt).fromNow()} {isCommentEdited && '(edited)'}
                  </Text>
                </>                
              }
              description={getMultipleLines(comment).map((line, idx) => (
                <>
                  <Text key={idx} type="secondary">{line}</Text>
                  {(getMultipleLines(comment).length > 1) && <br/>}
                </>
              ))}
            />
          </List.Item>
        );
      })}
      <UserCommentForm responseId={responseId} />
    </StyledList>
  );

  return (
    <StyledCollapse
      bordered={false}
      onChange={key => {
        const derivedKey = (key.length > 0) ? key[0] : undefined;
        setCollapseKey(derivedKey);
      }}
      activeKey={collapseKey}
    >
      <Panel
        key="1"
        showArrow={false}
        disabled={emptyComments}
        className={cx({
          'empty-comments': emptyComments,
        })}
        header={(
          <div className="d-flex" style={{ justifyContent: 'space-between' }}>
            <Text className="fs-16">
              {collapseKey ? <CollapsedDownIcon /> : <CollapsedUpIcon />}
              Comments {!emptyComments && `(${numberOfComments})`}
            </Text>
            <Reactions reactions={reactions} responseId={responseId} />
          </div>
        )}
      >
        {loading ? (
          <CommentLoading />
        ) : contentBody}
      </Panel>
    </StyledCollapse>
  );
}

export default withRouter(Comments);
