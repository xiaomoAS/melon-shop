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
    "Token": common_vendor.index.getStorageSync("token")
  };
  return config;
}, (err) => {
  return Promise.reject(err);
});
let isRefreshing = false;
http.interceptors.response.use((response) => {
  const token = common_vendor.index.getStorageSync("token");
  const refresh_token = common_vendor.index.getStorageSync("refresh_token");
  if (response) {
    common_vendor.index.__f__("log", "at utils/service.js:57", "封装后 结果（1）：", response);
    let show = response.config.custom.show ? response.config.custom.show : false;
    if (show) {
      common_vendor.index.hideLoading();
    }
    switch (response.data.error_code) {
      case 200:
        break;
      case 401:
        const config = response.config;
        if (!isRefreshing) {
          isRefreshing = true;
          return common_vendor.index.request({
            url: baseURL + "/api/v1/Jwtapi/refreshToken",
            method: "POST",
            header: {
              "token": token,
              "refresh-token": refresh_token
            }
          }).then((res) => {
            common_vendor.index.__f__("log", "at utils/service.js:81", "重新获取token");
            if (res.data && res.data.code == 41e3) {
              common_vendor.index.setStorageSync("token", res.data.token);
              common_vendor.index.setStorageSync("refresh_token", res.data.refresh_token);
              common_vendor.index.__f__("log", "at utils/service.js:88", "token重新生成，成功");
            } else {
              common_vendor.index.__f__("log", "at utils/service.js:90", "token过期，重新登录");
              common_vendor.index.showToast({
                title: "令牌过期，请重新登录！",
                icon: "error",
                success() {
                  setTimeout(function() {
                    common_vendor.index.removeStorageSync("token");
                    common_vendor.index.removeStorageSync("refresh_token");
                    common_vendor.index.navigateTo({
                      url: "/pages/user_login/login/login"
                    });
                  }, 2e3);
                }
              });
            }
            return http.request(config);
          }).finally(() => {
            isRefreshing = false;
          });
        } else {
          return new Promise((resolve) => {
          });
        }
      case 431:
        common_vendor.index.showModal({
          title: "提示",
          content: response.data.msg ? response.data.msg : "账号已在其他地方登录！",
          showCancel: false,
          //是否显示取消按钮，默认为 true
          success: function(res) {
            common_vendor.index.__f__("log", "at utils/service.js:133", res);
            if (res.confirm) {
              common_vendor.index.removeStorageSync("token");
              common_vendor.index.removeStorageSync("refresh_token");
              common_vendor.index.navigateTo({
                url: "/pages/user_login/login/login"
              });
            } else if (res.cancel)
              ;
          }
        });
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
