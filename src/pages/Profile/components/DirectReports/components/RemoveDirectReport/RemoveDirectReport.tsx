import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-apollo';
import { Modal, Tooltip, Icon, Typography } from 'antd';

import { REMOVE_DIRECT_REPORT } from 'apollo/mutations/user';
import { useMessageContextValue } from 'contexts/MessageContext';
import { AVAILABE_DIRECT_REPORTS } from 'apollo/queries/user';
import { MEMBER } from 'apollo/queries/member';
import { IAccount } from 'apollo/types/graphql-types';
import { getDisplayName } from 'utils/userUtils';

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
  directReport: IAccount
}

const RemoveDirectReport: React.FC<IRemoveDirectReport> = ({ managerId, directReport }) => {
  const { alertError } = useMessageContextValue();
  const [removeDirectReportMutation] = useMutation(REMOVE_DIRECT_REPORT);
  const [visibility, setVisibility] = useState(false);

  const removeDirectReportAction = () => {
    try {
      removeDirectReportMutation({
        variables: {
          managerId,
          directReportId: directReport.id,
        },
        update: (store, { data: { removeDirectReport } }) => {
          try {
            const directReportsCacheData: { availableDirectReports: IAccount[] } | null = store.readQuery({
              query: AVAILABE_DIRECT_REPORTS,
              variables: { managerId },
            });
            if (directReportsCacheData && removeDirectReport) {
              directReportsCacheData.availableDirectReports.push(directReport);
              directReportsCacheData.availableDirectReports.sort((a, b) => {
                const aDisplayName = getDisplayName(a);
                const bDisplayName = getDisplayName(b);
                return (aDisplayName && bDisplayName) ?
                  aDisplayName.localeCompare(bDisplayName) :
                  0;
              })
              store.writeQuery({
                query: AVAILABE_DIRECT_REPORTS,
                variables: { managerId },
                data: directReportsCacheData,
              });
            }
          } catch (_) {}

          try {
            const memberCacheData: { member: IAccount } | null = store.readQuery({
              query: MEMBER,
              variables: { memberId: managerId },
            });
            if (memberCacheData && removeDirectReport) {
              const newMember = { ...memberCacheData.member };
              newMember.directReports = memberCacheData.member.directReports.filter(dr => dr.id !== directReport.id);
              store.writeQuery({
                query: MEMBER,
                variables: { managerId },
                data: { member: newMember },
              });
            }
          } catch (_) {}
        },
        optimisticResponse: {
          removeDirectReport: true,
        },
      });
      setVisibility(false);
    } catch(error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
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
        onCancel={() => setVisibility(false)}
        okText="Yes"
        onOk={removeDirectReportAction}
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
