import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { ISiteUserInfo } from "@pnp/sp/site-users/types";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { config } from "./config";
import { getCurrentUrl, getSiteUrl } from "./helpers";

const siteUrl = getSiteUrl();

const loadContext = async (url: string) => {
  let { origin } = window.location;
  let context = await sp.createIsolated();
  context.setup({
    sp: {
      headers: {
        Accept: "application/json;odata=verbose",
      },
      baseUrl: `${origin}${url}`,
    },
  });
  return context;
};

const loadSourceContext = async () => loadContext(config.sourceSite);

const loadCurrentContext = async () => loadContext(siteUrl);

export const getMapping = async () => {
  try {
    // get current url
    let currentUrl = getCurrentUrl();

    // get the sharepoint context for the source site
    let context = await loadSourceContext();

    // fetch mappings from sharepoint
    let items = await context.web.lists
      .getByTitle(config.sourceList)
      .items.filter(
        `ExistingUrl eq '${currentUrl}' or ExistingUrl eq '${currentUrl}/'`
      )
      .get();

    // return the redirect url
    return items.length > 0
      ? decodeURIComponent(items[0].RedirectToUrl.trim())
      : "";
  } catch (err) {
    throw err;
  }
};

export const isWhitelisted = async () => {
  // get the context of the current site
  let context = await loadCurrentContext();

  // get current user
  let currentUser = await context.web.currentUser();

  // get the list items
  let results = await context.web.lists
    .getByTitle("Redirect Whitelist")
    .items.select(
      "ID,WhitelistUser/Id,WhitelistUser/EMail,WhitelistUser/UserName"
    )
    .expand("WhitelistUser")
    .filter(`WhitelistUser/EMail eq '${currentUser.Email}'`)
    .get();

  // if items exist, the user is whitelisted
  return Array.isArray(results) && results.length > 0;
};

export const getUserInfo = async (): Promise<ISiteUserInfo> => {
  let context = await loadCurrentContext();
  return context.web.currentUser();
};
