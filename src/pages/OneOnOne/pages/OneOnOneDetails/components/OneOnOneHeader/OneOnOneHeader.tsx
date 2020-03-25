import React, { useState, PropsWithChildren } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';
import { Card, Button, Typography, Spin, Avatar, Tag, Tooltip } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';
import ScheduleOneOnOneModal from 'pages/OneOnOne/components/ScheduleOneOnOneModal';
import RescheduleOneOnOneModal from './components/RescheduleOneOnOneModal';
import { COMPLETE_ONE_ON_ONE } from 'apollo/mutations/oneOnOne';
import { ONE_ON_ONE_HEADER } from 'apollo/queries/oneOnOne';
import { getDisplayName } from 'utils/userUtils';
import { COLOR_MAP } from 'utils/colorUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';
import { IOneOnOneHeader } from 'apollo/types/oneOnOne';

const { Title, Text } = Typography;

const StyledSpinnerWrapper = styled.div`
  .ant-spin-text {
    margin-top: 24px;
  }
`;

interface IQueryResult {
  oneOnOneHeader: IOneOnOneHeader
}

const CompleteButtonWrapper: React.FC<PropsWithChildren<any> & { disabled: boolean }> = ({
  children, disabled,
}) => {
  return disabled ? (
    <Tooltip placement="bottom" title="Add your feedback to complete this session.">
      {children}
    </Tooltip>
  ) : children;
};

const OneOnOneHeader: React.FC<{ sessionId: string | undefined }> = ({ sessionId }) => {
  const { alertError } = useMessageContextValue();
  const { selectedUserSession } = useOneOnOneContextValue();
  const [loadingState, setLoadingState] = useState(false);
  const [completeOneOnOneMutation] = useMutation(COMPLETE_ONE_ON_ONE);

  const { data, loading } = useQuery<IQueryResult>(ONE_ON_ONE_HEADER, {
    variables: { sessionId },
  });

  const completeOneOnOneAction = async () => {
    try {
      setLoadingState(true);
      await completeOneOnOneMutation({
        variables: { sessionId },
        awaitRefetchQueries: true,
      });
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  return (
    <Card className="mb-3">
      {loading ? (
        <StyledSpinnerWrapper className="d-flex align-items-center justify-content-center">
          <Spin className="py-3" size="small" indicator={LoadingIcon} />
        </StyledSpinnerWrapper>
      ) : (
        <div className="d-flex">
          {data?.oneOnOneHeader.displayMember.avatar && (
            <Avatar
              style={{ width: 64, height: 64 }}
              className="mr-3 flex-shrink-0"
              src={data.oneOnOneHeader.displayMember.avatar}
            />
          )}
          <div className="d-flex justify-content-between w-100">
            <div>
              <div className="d-flex" style={{ alignItems: 'center' }}>
                <Title className="mb-0 mr-2 text-capitalize" level={3}>
                  {getDisplayName(data?.oneOnOneHeader.displayMember)}
                </Title>
                {(selectedUserSession?.isManager) && (
                  <ScheduleOneOnOneModal
                    isEditing
                    directReportId={selectedUserSession?.teammate?.id}
                    title={`Edit 1-1 with ${getDisplayName(selectedUserSession?.teammate)}`}
                  />
                )}
              </div>
              <Text type="secondary" className="fs-16">
                {moment(data?.oneOnOneHeader.time).format('MMM DD, hh:mm a')}
              </Text>
            </div>
            {selectedUserSession?.isManager && (
              <div className="d-flex align-items-end">
                <div className="d-block text-right">
                  {data?.oneOnOneHeader.status && (
                    <Tag className="m-0" color={COLOR_MAP[data.oneOnOneHeader.status]}>
                      {data.oneOnOneHeader.status}
                    </Tag>
                  )}
                </div>
                <div className="d-block mt-3">
                  {data?.oneOnOneHeader.canRescheduleSession && (
                    <RescheduleOneOnOneModal />
                  )}
                  {data?.oneOnOneHeader.showCompleteButton && (
                    <CompleteButtonWrapper disabled={!(data?.oneOnOneHeader.canCompleteSession)}>
                      <Button
                        disabled={!(data?.oneOnOneHeader.canCompleteSession)}
                        onClick={completeOneOnOneAction}
                        loading={loadingState}
                        className="ml-3"
                        type="primary"
                      >
                        Complete 1-1
                      </Button>
                    </CompleteButtonWrapper>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default OneOnOneHeader;
