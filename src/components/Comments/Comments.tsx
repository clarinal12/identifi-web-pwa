import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { useQuery } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';
import { Collapse, Typography, List, Avatar, Spin, Icon, Alert } from 'antd';

import UserCommentForm from './components/UserCommentForm';
import { getDisplayName } from 'utils/userUtils';
import { COMMENTS } from 'apollo/queries/comments';
import { IComment } from 'apollo/types/graphql-types';

const { Panel } = Collapse;
const { Text } = Typography;

interface IComments {
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

const Comments: React.FC<IComments> = ({ numberOfComments, sourceId }) => {
  const [collapseKey, setCollapseKey] = useState<string | undefined>(undefined);
  const emptyComments = numberOfComments === 0;

  const { data, loading, error } = useQuery(COMMENTS, {
    variables: {
      checkInResponseId: sourceId,
    },
    skip: !collapseKey,
  });

  useEffect(() => {
    if (emptyComments) {
      setCollapseKey('1');
    }
  }, [emptyComments]);

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
      <UserCommentForm sourceId={sourceId} />
      {data && data.checkInResponseComments.map(({ author, comment, id, createdAt }: IComment) => {
        const nameString = getDisplayName(author);
        return (
          <List.Item key={id}>
            <List.Item.Meta
              avatar={<Avatar {...((author && author.avatar) && { src: author.avatar })} />}
              description={
                <>
                  <Text style={{ color: '#006D75' }} strong className="mr-2">{nameString}</Text>
                  <Text type="secondary">{comment}</Text>
                </>
              }
            />
            <Text
              className="ml-2"
              type="secondary"
              style={{ fontSize: 12 }}
            >
              {moment(createdAt).fromNow()}
            </Text>
          </List.Item>
        );
      })}
    </StyledList>
  );

  return (
    <StyledCollapse
      bordered={false}
      onChange={key => {
        const derivedKey = (key.length > 0) ? key[0] : undefined;
        setCollapseKey(derivedKey);
        if (derivedKey) {
          // onchange should center the respondentcard with comments on the screen
        }
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

export default Comments;
