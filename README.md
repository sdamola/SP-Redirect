# SPFx Intranet Redirect

## Quick start

To start localhost:
```shell
cp .env.example .env
yarn
yarn serve
```

## Installation

The app is deployed to the tenant app catalog via Azure DevOps pipelines. To install it on a site, add the "Intranet Redirect Solution" app to the site. Then run these commands.


```shell
# To set the custom error page:
Connect-PnPOnline -Url "https://<tenant>.sharepoint.com/sites/<site>"
Set-PnPSite -DenyAndAddCustomizePages $false
Set-PnPPropertyBagValue -Key "vti_filenotfoundpage" -Value "/sites/<site>/SitePages/redirect/error.aspx"
Set-PnPSite -DenyAndAddCustomizePages $true

# If the site is classic, add a script link:
Add-PnPJavaScriptLink -Name "RedirectSolution" -Url "https://<cdnUrl>/index.js"
```

## How it works:
1. A list at the root site is configured to map old URLs to redirected URLs.
1. A redirect script is compiled from `src/assets/redirect.ts`. This script contains logic for checking URLs and performing redirects.
1. The script is uploaded to the Booz Allen CDN, for simple hosting and cache management.
1. The SPFx extension contains a reference to this script so that it can run on modern pages.
1. The reference can also be added as a script link so that it can run on classic pages.
1. When the SPFx app is installed, a custom error page is added to the SitePages library, which is configured to handle File Not Found errors.
1. When the user reaches that error page, the script executes, allowing for redirection.

## Cache management

Each published version of the redirect.js script is prefixed with the version number -- i.e., <cdnUrl>/<version>/redirect.js -- to manage caching and versioning.

An index.js file is also published with no-cache headers whose function is to load the redirect.js script. So if a page contains a reference to the index.js file, visitors will always receive the latest copy of the redirect script.