"use strict";
const common_vendor = require("../common/vendor.js");
const utils_luchRequest_core_Request = require("./luch-request/core/Request.js");
const baseURL = "https://www.melon-bamboo.com";
const http = new utils_luchRequest_core_Request.Request();
http.setConfig((config) => {
  config.baseURL = baseURL;
  config.header = {
    ...config.header
  };
  return config;
});
http.interceptors.request.use((config) => {
  let show = config.custom.show ? config.custom.show : false;
  if (show) {
    let title_name = show != true ? show : "";
    common_vendor.index.showLoading({
      title: title_name,
      mask: true
      //是否显示透明蒙层，防止触摸穿透，默认：false
    });
  }
  config.header = {
    ...config.header,
    "wechat_token": common_vendor.index.getStorageSync("token")
  };
  return config;
}, (err) => {
  return Promise.reject(err);
});
http.interceptors.response.use((response) => {
  common_vendor.index.getStorageSync("token");
  common_vendor.index.getStorageSync("refresh_token");
  if (response) {
    common_vendor.index.__f__("log", "at utils/service.js:57", "封装后 结果（1）：", response);
    let show = response.config.custom.show ? response.config.custom.show : false;
    if (show) {
      common_vendor.index.hideLoading();
    }
    switch (response.data.code) {
      case 200:
        return Promise.resolve(response.data.data);
      case 401:
        common_vendor.index.navigateTo({
          url: "/pages/user-login/login"
        });
        return Promise.reject(response);
      default:
        return Promise.reject(response);
    }
  }
  return response["data"];
}, (err) => {
  return Promise.reject(err);
});
exports.baseURL = baseURL;
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/service.js.map
