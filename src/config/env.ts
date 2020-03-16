const browserWindow = window as any;
const environment = browserWindow?.ENV ?
  browserWindow.ENV.toUpperCase() : process.env.NODE_ENV.toUpperCase();
export default environment;
export const maintenance = Boolean(browserWindow.MAINTENANCE);
