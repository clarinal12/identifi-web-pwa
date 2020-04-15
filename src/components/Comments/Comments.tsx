import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';
import { Collapse, Typography, List, Avatar, Spin, Icon, Alert } from 'antd';
import queryString from 'query-string';

import Reactions from '../Reactions';
import UserCommentForm from './components/UserCommentForm';
import CommentActions from './components/CommentActions';
import { useUserContextValue } from 'contexts/UserContext';
import { getDisplayName } from 'utils/userUtils';
import { getMultipleLines } from 'utils/textUtils';
import { transformComment } from 'utils/commentsUtils';
import { CollapsedDownIcon, CollapsedUpIcon } from 'utils/iconUtils';
import { COMMENTS } from 'apollo/queries/comments';
import { IComment, TReaction } from 'apollo/types/checkin';

const { Panel } = Collapse;
const { Text } = Typography;

interface IComments extends RouteComponentProps {
  responseId: string,
  numberOfComments: number,
  reactions: TReaction[],
}

const StyledCollapse = styled(Collapse)`
  background: transparent !important;
  .ant-collapse-item {
    border: none !important;
    .ant-collapse-header {
      user-select: none;
      padding: 16px 24px !important;
    }
    .ant-collapse-content {
      &.ant-collapse-content-active {
        overflow: visible;
      }
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
    .user-comment-content > .ant-list-item-meta-content {
      background-color: #f2f3f5bf;
      border-radius: 18px;
      padding: 8px 10px;
      .ant-list-item-meta-title {
        font-size: 12px;
        line-height: 20px;
        a {
          font-weight: 600;
        }
      }
    }
    .ant-list-item-action {
      margin-left: 8px;
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

const Comments: React.FC<IComments> = ({ numberOfComments, responseId, reactions, location }) => {
  const [editCommentId, setEditCommentId] = useState<string | undefined>(undefined);
  const [collapseKey, setCollapseKey] = useState<string | undefined>(undefined);
  const { account } = useUserContextValue();
  const emptyComments = numberOfComments === 0;

  const { data, loading, error } = useQuery(COMMENTS, {
    variables: {
      checkInResponseId: responseId,
    },
    skip: !collapseKey || Boolean(collapseKey && emptyComments),
  });

  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    if (emptyComments || Boolean(queryParams.memberId)) {
      setCollapseKey('1');
    }
  }, [emptyComments, location.search]);

  // useEffect(() => {
  //   const { commentId, responseId } = queryString.parse(location.search);
  //   const referenceId = commentId || responseId;
  //   if (document && window && referenceId) {
  //     const expectedElement = document.getElementById(referenceId.toString());
  //     expectedElement && expectedElement.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'end',
  //     });
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loading]);

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
      {data?.checkInResponseComments.map(({ author, comment, id, createdAt, updatedAt, mentions }: IComment) => {
        const nameString = getDisplayName(author);
        const commentOwner = author.id === account?.id;
        const isEditing = (editCommentId === id);
        const isCommentEdited = createdAt !== updatedAt;

        const transformedComment = transformComment(comment, mentions);
        const stringComment = getMultipleLines(transformedComment).join("<br/>");
        const isOptimisticResponse = id.includes('optimistic');

        return isEditing ? (
          <UserCommentForm
            key={id}
            responseId={responseId}
            commentId={id}
            defaultComment={comment}
            defaultMentions={mentions}
            setEditCommentId={setEditCommentId}
          />
        ) : (
          <List.Item
            key={id}
            id={id}
            {...(commentOwner && !isOptimisticResponse && {
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
              className="user-comment-content"
              avatar={(
                <Link to={`/profile/${author.id}`}>
                  <Avatar style={{ width: 36, height: 36 }} {...(author.avatar && { src: author.avatar })} />
                </Link>
              )}
              title={
                <>
                  <Link
                    to={`/profile/${author.id}`}
                    className="mr-2"
                  >
                    {nameString}
                  </Link>
                  {!isOptimisticResponse && (
                    <Text className="font-weight-normal">
                      {moment(createdAt).fromNow()} {isCommentEdited && '(edited)'}
                    </Text>
                  )}
                </>                
              }
              description={(
                <div
                  dangerouslySetInnerHTML={{ __html: stringComment }}
                  className={cx({ 'text-muted': isOptimisticResponse })}
                />
              )}
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
              {collapseKey ? <CollapsedUpIcon /> : <CollapsedDownIcon />}
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
