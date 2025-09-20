"use strict";
const utils_luchRequest_helpers_isAbsoluteURL = require("../helpers/isAbsoluteURL.js");
const utils_luchRequest_helpers_combineURLs = require("../helpers/combineURLs.js");
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !utils_luchRequest_helpers_isAbsoluteURL.isAbsoluteURL(requestedURL)) {
    return utils_luchRequest_helpers_combineURLs.combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
exports.buildFullPath = buildFullPath;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/utils/luch-request/core/buildFullPath.js.map
