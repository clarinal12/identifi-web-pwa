import React, { createContext, useContext, PropsWithChildren } from 'react';
import { message } from 'antd';

type TVoidMethod = (text: string) => void;

interface IMessageContext {
  alertError: TVoidMethod,
  alertSuccess: TVoidMethod,
  alertWarning: TVoidMethod,
}

const MessageContext = createContext<IMessageContext>({
  alertError: (text: string) => {},
  alertSuccess: (text: string) => {},
  alertWarning: (text: string) => {},
});

const MessageProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const commonMethod = (text: string, type: 'error' | 'success' | 'warning') => {
    message.destroy();
    message.config({
      getContainer: () => document.getElementById(`${type}-msg`) || document.body,
    });
    message[type](text);
  }
  const alertError = (text: string) => {
    commonMethod(text, 'error');
  };
  const alertSuccess = (text: string) => {
    commonMethod(text, 'success');
  };
  const alertWarning = (text: string) => {
    commonMethod(text, 'warning');
  };
  return (
    <MessageContext.Provider value={{ alertError, alertSuccess, alertWarning }}>
      {children}
    </MessageContext.Provider>
  );
}

const useMessageContextValue = () => useContext(MessageContext);

export { MessageProvider, useMessageContextValue };

export default MessageContext;
