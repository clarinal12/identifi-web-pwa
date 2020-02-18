import React from 'react';

import AppLayout from 'components/AppLayout';
import LinkList from './components/LinkList';
import { MembersProvider } from 'contexts/MembersContext';

const Links = () => {
  return (
    <MembersProvider>
      <AppLayout>
        <LinkList />
      </AppLayout>
    </MembersProvider>
  );
}

export default Links;
