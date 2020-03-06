import React, { ReactNode } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Typography, PageHeader, Tabs } from 'antd';

import CompanySetup from './components/CompanySetup';
import { ICompanyFormValues } from './components/CompanySetup/CompanySetup';
import PersonalInfo from './components/PersonalInfo';
import { IPersonalInfoFormValues } from './components/PersonalInfo/PersonalInfo';
import MemberInvite from './components/MemberInvite';
import { useUserContextValue } from 'contexts/UserContext';
import { useMessageContextValue } from 'contexts/MessageContext';
import { ACCOUNT } from 'apollo/queries/user';
import { UPDATE_COMPANY, CREATE_COMPANY, UPDATE_USER, ENTER_COMPANY, INVITE_EMAIL } from 'apollo/mutations/setup';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

interface ITabsSteps {
  title: string,
  component: ReactNode,
}

interface ISetupTabs extends RouteComponentProps {
  setActiveTabKey: (key: number) => void,
  activeTabKey: number,
}

const StyledTabsWrapper = styled.div`
  @media (min-width: 992px) {
    width: 75%;
  }
  .ant-page-header {
    .ant-page-header-back {
      padding: 5px 0;
      .anticon {
        color: #08979C;
        font-size: 24px;
      }
    }
  }
  .form-tabs {
    .ant-tabs-bar {
      display: none;
    }
  }
`;

const SetupTabs: React.FC<ISetupTabs> = ({ history, setActiveTabKey, activeTabKey }) => {
  const { alertError, alertSuccess } = useMessageContextValue();
  const { account } = useUserContextValue();
  const [createCompany] = useMutation(CREATE_COMPANY);
  const [updateCompany] = useMutation(UPDATE_COMPANY);
  const [updateUser] = useMutation(UPDATE_USER);
  const [enterCompany] = useMutation(ENTER_COMPANY);
  const [inviteEmail] = useMutation(INVITE_EMAIL);

  const activeCompany = account?.activeCompany || null;
  const refetchQueries = [{
    query: ACCOUNT,
  }];

  const errorHandler = (error: any) => {
    let errorMessage = "Network error";
    if (error.graphQLErrors[0]) {
      errorMessage = error.graphQLErrors[0].message;
    }
    alertError(errorMessage);
  }

  const companyAction = async (values: ICompanyFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    const companyMutation = activeCompany?.id ? updateCompany : createCompany;
    try {
      if ((activeCompany?.name !== values.companyName) || !activeCompany) {
        await companyMutation({
          variables: {
            ...(activeCompany?.id && {
              id: activeCompany.id,
            }),
            input: { name: values.companyName },
          },
          refetchQueries,
        });
      }
      setActiveTabKey(activeTabKey + 1);
    } catch(error) {
      errorHandler(error);
    }
    setSubmitting(false);
  }

  const personalDetailsAction = async (values: IPersonalInfoFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    const { firstname, lastname, location, role } = account || { firstname: null, lastname: null, location: null, role: null };
    const accountObj = { location, role, firstname, lastname };
    try {
      if (JSON.stringify(accountObj) !== JSON.stringify(values)) {
        await updateUser({
          variables: {
            input: { ...values },
          },
          refetchQueries,
        });
      }
      setActiveTabKey(activeTabKey + 1);
    } catch(error) {
      errorHandler(error);
    }
    setSubmitting(false);
  }

  const inviteAction = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      await inviteEmail({
        variables: {
          input: {
            companyId: activeCompany?.id,
            emails: values.emails,
          },
        },
      });
      onboardUserAction(false);
    } catch (error) {
      errorHandler(error);
      setSubmitting(false);
    }
  }

  const onboardUserAction = async (skip = true) => {
    try {
      if (activeCompany) {
        await enterCompany({
          variables: {
            companyId: activeCompany.id,
          },
          refetchQueries,
          awaitRefetchQueries: true,
        });
        if (!skip) {
          alertSuccess("Email invitations has been sent successfully!");
        }
        localStorage.removeItem('activetab');
        history.push("/");
      }
    } catch(error) {
      errorHandler(error);
    }
  }

  const TABS_STEPS: ITabsSteps[] = [{
    title: 'Company name',
    component: <CompanySetup
      companyName={activeCompany?.name || ''}
      onSubmit={companyAction}
    />
  }, {
    title: 'Tell us about you',
    component: <PersonalInfo
      account={account}
      onSubmit={personalDetailsAction}
    />
  }, {
    title: 'Invite team members',
    component: <MemberInvite
      onSkip={onboardUserAction}
      onSubmit={inviteAction}
    />,
  }];

  return (
    <StyledTabsWrapper>
      <div className="steps-tracker">
        <Text className="fs-16" style={{ color: '#08979C' }} strong>{activeTabKey}</Text>
        <Text className="fs-16" strong type="secondary"> of 3</Text>
      </div>
      <PageHeader
        className="px-0"
        {...((activeTabKey > 1) && {
          onBack: () => setActiveTabKey(activeTabKey - 1),
        })}
        title={<Title>{TABS_STEPS[activeTabKey - 1].title}</Title>}
      />
      <Tabs
        className="form-tabs"
        activeKey={activeTabKey.toString()}
      >
        {TABS_STEPS.map(({ title, component }, idx) => (
          <TabPane tab={title} key={(idx + 1).toString()}>
            {component}
        </TabPane>
        ))}
      </Tabs>
    </StyledTabsWrapper>
  );
}

export default withRouter(SetupTabs);
