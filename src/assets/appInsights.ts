import { ApplicationInsights, ITelemetryItem } from '@microsoft/applicationinsights-web';
import { config } from './config';
import { getUserInfo } from './services';

export let appInsights: ApplicationInsights;

export async function initializeAppInsights(): Promise<ApplicationInsights> {
    if (!appInsights) {
        appInsights = new ApplicationInsights({
            config: {
                instrumentationKey: config.appInsightsKey
            }
        });

        appInsights.loadAppInsights();

        let user = await getUserInfo();

        appInsights.addTelemetryInitializer((telemetryItem: ITelemetryItem): boolean | void => {
            if (telemetryItem) {
                telemetryItem.data['user_Mail'] = user.Email ? user.Email.toLowerCase() : 'Not Set';
                telemetryItem.data['user_UserPrincipalName'] = user.UserPrincipalName
                    ? user.UserPrincipalName.toLowerCase()
                    : 'Not Set';
                telemetryItem.data['web_Page'] = window.location.href;
            }
        });

        if (user.Email) appInsights.setAuthenticatedUserContext(user.UserPrincipalName);
    }
    return appInsights;
}

export function trackRedirect(sourcePage: string, destinationPage: string): void {
    appInsights.trackEvent({
        name: 'Redirect',
        properties: {
            redirect_SourcePage: sourcePage,
            redirect_DestinationPage: destinationPage,
            redirect_Found: !!destinationPage ? 'Yes' : 'No',
            referrer_URI: window.location.href
        }
    });
}