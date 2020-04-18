const browserWindow = window as any;
const environment = browserWindow?.ENV ?
  browserWindow.ENV.toUpperCase() : process.env.NODE_ENV.toUpperCase();

export const isDev = ['DEVELOPMENT', 'STAGING'].includes(environment);

export default environment;
