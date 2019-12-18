import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import cx from 'classnames';
import { useQuery } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';
import { Collapse, Typography, List, Avatar, Spin, Icon, Alert } from 'antd';

import UserCommentForm from './components/UserCommentForm';
import CommentActions from './components/CommentActions';
import { useUserContextValue } from 'contexts/UserContext';
import { getDisplayName } from 'utils/userUtils';
import { COMMENTS } from 'apollo/queries/comments';
import { IComment } from 'apollo/types/graphql-types';

const { Panel } = Collapse;
const { Text } = Typography;

interface IComments extends RouteComponentProps {
  sourceId: string,
  numberOfComments: number,
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
        padding-top: 0 !important;
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

const Comments: React.FC<IComments> = ({ numberOfComments, sourceId, location }) => {
  const [collapseKey, setCollapseKey] = useState<string | undefined>(undefined);
  const { account } = useUserContextValue();
  const memberInfo = account && account.memberInfo;
  const emptyComments = numberOfComments === 0;

  const { data, loading, error } = useQuery(COMMENTS, {
    variables: {
      checkInResponseId: sourceId,
    },
    skip: !collapseKey,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseId = queryParams.get('responseId');
    const commentId = queryParams.get('commentId');
    const isLinkFromNotification = (responseId && commentId) && (responseId === sourceId);
    if (emptyComments || isLinkFromNotification) {
      setCollapseKey('1');
    }
  }, [emptyComments, location.search, sourceId]);

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
      {data && data.checkInResponseComments.map(({ author, comment, id, createdAt }: IComment) => {
        const nameString = getDisplayName(author);
        const commentOwner = memberInfo && (author.memberId === memberInfo.memberId);
        return (
          <List.Item
            key={id}
            id={id}
            {...(commentOwner && {
              actions: [
                <CommentActions commentId={id} responseId={sourceId} />,
              ],
            })}
          >
            <List.Item.Meta
              avatar={<Avatar {...((author && author.avatar) && { src: author.avatar })} />}
              description={
                <>
                  <Text style={{ color: '#006D75' }} strong className="mr-2">{nameString}</Text>
                  <Text type="secondary">{comment}</Text>
                </>
              }
            />
            <Text className="ml-2" type="secondary">
              {moment(createdAt).fromNow()}
            </Text>
          </List.Item>
        );
      })}
      <UserCommentForm sourceId={sourceId} />
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
        disabled={emptyComments}
        showArrow={false}
        className={cx({
          'empty-comments': emptyComments,
        })}
        header={emptyComments ? undefined : (
          <Text style={{ fontSize: 16 }}>
            {collapseKey ? 'Hide all comments' : `View all comments (${numberOfComments})`}
          </Text>
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
