import React from 'react';
import { Empty, Typography } from 'antd';

import AgendaModal from './components/AgendaModal';
import { TAgenda } from 'apollo/types/oneOnOne';

const { Text } = Typography;

interface IAgenda {
  agenda?: TAgenda[],
}

const Agenda: React.FC<IAgenda> = ({ agenda }) => {
  if (!Boolean(agenda?.length)) {
    return (
      <Empty
        className="mb-3"
        description={<Text type="secondary">Add talking points you want to talk about with your manager.</Text>}
      >
        <AgendaModal />
      </Empty>
    )
  } 
  return (
    <div>
      
    </div>
  )
}

export default Agenda;
