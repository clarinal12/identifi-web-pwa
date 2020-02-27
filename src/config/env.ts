const browserWindow = window as any;
const environment = browserWindow && browserWindow.ENV ?
  browserWindow.ENV.toUpperCase() : process.env.NODE_ENV.toUpperCase();
export default environment;
export const maintenance = !!browserWindow.MAINTENANCE;
