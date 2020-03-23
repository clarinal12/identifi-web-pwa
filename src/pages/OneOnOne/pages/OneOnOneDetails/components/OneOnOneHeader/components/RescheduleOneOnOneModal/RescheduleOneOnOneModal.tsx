import React, { useState } from 'react';
// import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, Typography } from 'antd';

import RescheduleOneOnOneForm from './components/RescheduleOneOnOneForm';
import { IScheduleFormValues } from './components/RescheduleOneOnOneForm/RescheduleOneOnOneForm';
// import { SCHEDULE_ONE_ON_ONE } from 'apollo/mutations/oneOnOne';
// import { useMessageContextValue } from 'contexts/MessageContext';
// import scheduleOneOnOneCacheHandler from './cache-handler/scheduleOneOnOne';
// import updateOneOnOneScheduleCacheHandler from './cache-handler/updateOneOnOneSchedule';
import { IOneOnOneSchedule } from 'apollo/types/oneOnOne';

const { Text } = Typography;

interface IRescheduleOneOnOneModal {
  directReportId: string,
  title: string,
  oneOnOneSchedule?: IOneOnOneSchedule,
}

const StyledModal = styled(Modal)`
  min-width: 625px;
  .ant-modal-header, .ant-modal-footer {
    border: none;
  }
  .ant-modal-header {
    padding-bottom: 0;
    padding-top: 24px;
    .ant-modal-title {
      font-size: 24px;
      font-weight: 600;
    }
  }
  .ant-modal-footer {
    display: none;
  }
`;

const RescheduleOneOnOneModal = () => {
  // const { alertError } = useMessageContextValue();
  const [visibility, setVisibility] = useState(false);
  // const [scheduleOneOnOneMutation] = useMutation(SCHEDULE_ONE_ON_ONE);

  const scheduleOneOnOneAction = (values: IScheduleFormValues) => {
    // try {
    //   const daysToAdd = values.frequency === 'BI_WEEKLY' ? 14 : 7;
    //   scheduleOneOnOneMutation({
    //     variables: {
    //       directReportId,
    //       input: {
    //         timings: { ...values },
    //       },
    //     },
    //     ...scheduleOneOnOneCacheHandler({
    //       directReportId,
    //       values: {
    //         frequency: values.frequency,
    //         upcomingSessionDate: values.time.utc(false).format(),
    //         nextSessionDate: values.time.add(daysToAdd, 'days').utc(false).format(),
    //       },
    //     }),
    //   });
    // } catch (error) {
    //   let errorMessage = null;
    //   if (error.graphQLErrors[0]) {
    //     errorMessage = error.graphQLErrors[0].message;
    //   }
    //   alertError(errorMessage);
    // }
  }

  return (
    <div>
      <Button type="primary" ghost onClick={() => setVisibility(true)}>Reschedule</Button>
      <StyledModal
        maskClosable={false}
        closable={false}
        title="Reschedule upcoming 1-1"
        visible={visibility}
      >
        <Text className="fs-16">
          Something came up and you can’t do your 1-1 when you originally agreed? No worries, just select a new date and time below. Keep in mind this reschedules <strong>only</strong> the upcoming 1-1.
        </Text>
        <RescheduleOneOnOneForm
          // data={oneOnOneSchedule}
          setVisibility={setVisibility}
          onSubmitAction={scheduleOneOnOneAction}
        />
      </StyledModal>
    </div>
  )
}

export default RescheduleOneOnOneModal;
