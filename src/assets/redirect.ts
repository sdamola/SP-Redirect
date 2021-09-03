import { initializeAppInsights, trackRedirect } from "./appInsights";
import { getCurrentUrl } from './helpers';
import { getMapping, isWhitelisted } from "./services";

(async () => {
  console.log("Redirect script initialized");

  initializeAppInsights();

  // disable redirect for whitelisted users
  if (await isWhitelisted()) return;

  // get the redirect mapping
  const redirectUrl = await getMapping();

  // track the redirect match in App Insights
  trackRedirect(getCurrentUrl(), redirectUrl);

  // make sure we have a redirect url
  if (!redirectUrl) return;

  // do the redirect
  window.location.assign(redirectUrl);
})();
