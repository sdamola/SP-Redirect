export const parseQs = () => {
  let obj = {};
  let query = window.location.search.substring(1);
  let keys = query.split("&");
  for (let i = 0; i < keys.length; i++) {
    let pair = keys[i].split("=");
    obj[pair[0]] = pair[1];
  }
  return obj;
};

// checks for query string parameters provided
// by sharepoint or defaults to the current url
export const getCurrentUrl = () => {
  let { origin, pathname } = window.location;
  let url = "";
  let qs = parseQs();

  switch (true) {
    // 404 not found
    case qs.hasOwnProperty("requestUrl"):
      url = qs["requestUrl"];
      break;

    // // document library folder
    // case qs.hasOwnProperty("RootFolder"):
    //   url = origin + qs["RootFolder"];
    //   break;

    // // document library folder
    // case (qs.hasOwnProperty("FolderCTID") || qs.hasOwnProperty("viewid")) &&
    //   qs.hasOwnProperty("id"):
    //   url = origin + qs["id"];
    //   break;

    // links to documents
    case qs.hasOwnProperty("parent") && qs.hasOwnProperty("id"):
      url = origin + qs["id"];
      break;

    // current url
    default:
      url = origin + pathname;
      break;
  }

  return decodeURIComponent(url).toLowerCase().replace(/\/+$/, "");
};

// this function infers a relative site URL from a given absolute URL.
// It will either return the root site "/", or a path like "/sites/mysite" or "/teams/mysite".
// Subsites will not work: for example, for https://domain.com/sites/mysite/mysubsite/doc.aspx, the return value will be "/sites/mysite".
export const getSiteUrl = () => {
  let url = getCurrentUrl();
  let match = url.match(/sharepoint\.com(\/(sites|teams)\/[a-zA-Z0-9_-]+)/);
  if (match && match.length > 1) return match[1];
  else return '/';
};

// gets ancestor paths
export const parentExists = (url: string, mappings: {}) => {
  let parts = url.split("/");
  let paths = parts.slice(3, parts.length - 1);
  let site = parts[0] + "//" + parts[2];

  for (var i = 0, path = ""; i < paths.length; i++) {
    path += "/" + paths[i];
    let key = site + path;
    if (mappings.hasOwnProperty(key)) return mappings[key];
  }

  return null;
};
