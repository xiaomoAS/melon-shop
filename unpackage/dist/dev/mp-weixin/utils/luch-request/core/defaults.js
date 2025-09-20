"use strict";
const defaults = {
  baseURL: "",
  header: {},
  method: "GET",
  dataType: "json",
  paramsSerializer: null,
  responseType: "text",
  custom: {},
  timeout: 6e4,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  // 是否尝试将响应数据json化
  forcedJSONParsing: true
};
exports.defaults = defaults;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/utils/luch-request/core/defaults.js.map
