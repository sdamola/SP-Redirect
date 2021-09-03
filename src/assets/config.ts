declare const __sourceSite__: string;
declare const __sourceList__: string;
declare const __appInsightsKey__: string;

export interface IConfig {
  sourceSite: string;
  sourceList: string;
  appInsightsKey: string;
}

export const config: IConfig = {
  sourceSite: __sourceSite__,
  sourceList: __sourceList__,
  appInsightsKey: __appInsightsKey__
};
