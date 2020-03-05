import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-apollo';
import { Modal, Tooltip, Icon, Typography } from 'antd';

import { REMOVE_DIRECT_REPORT } from 'apollo/mutations/user';
import { useMessageContextValue } from 'contexts/MessageContext';
import { AVAILABE_DIRECT_REPORTS } from 'apollo/queries/user';
import { MEMBER } from 'apollo/queries/member';

const { Text } = Typography;

const StyledModal = styled(Modal)`
  max-width: 415px;
  .ant-modal-close {
    display: none;
  }
  .ant-modal-body {
    display: flex;
    padding-bottom: 0;
    .ant-typography {
      color: #262626;
    }
    .anticon {
      font-size: 21px;
    }
  }
  .ant-modal-footer {
    padding: 24px;
    border-top: none;
    .ant-btn {
      min-width: 80px;
    }
    .ant-btn-primary {
      background: #262626;
      border-color: #262626;
    }
  }
`;

interface IRemoveDirectReport {
  managerId: string,
  directReportId: string
}

const RemoveDirectReport: React.FC<IRemoveDirectReport> = ({ managerId, directReportId }) => {
  const { alertError } = useMessageContextValue();
  const [removeDirectReport] = useMutation(REMOVE_DIRECT_REPORT);
  const [loadingState, setLoadingState] = useState  (false);
  const [visibility, setVisibility] = useState(false);

  const addDirectReportAction = async () => {
    try {
      setLoadingState(true);
      await removeDirectReport({
        variables: {
          managerId,
          directReportId,
        },
        refetchQueries: [{
          query: AVAILABE_DIRECT_REPORTS,
          variables: { managerId },
        }, {
          query: MEMBER,
          variables: { memberId: managerId },
        }],
        awaitRefetchQueries: true,
      });
    } catch(error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      setLoadingState(false);
      alertError(errorMessage);
    }
  };

  return (
    <div>
      <Tooltip
        placement="topLeft"
        title="Remove"
        getPopupContainer={() => document.getElementById('tooltip-container') || document.body}
      >
        <a href="#!" className="custom-close-btn" onClick={() => setVisibility(true)}>
          <Icon type="close" />
        </a>
      </Tooltip>
      <StyledModal
        visible={visibility}
        {...(!loadingState && {
          onCancel: () => setVisibility(false),
        })}
        confirmLoading={loadingState}
        okText="Yes"
        onOk={addDirectReportAction}
      >
        <div>
          <Icon type="warning" className="mr-3" />
        </div>
        <Text strong className="fs-16">
          Are you sure you want to remove this direct report?
        </Text>
      </StyledModal>
    </div>
  );
};

export default RemoveDirectReport;
