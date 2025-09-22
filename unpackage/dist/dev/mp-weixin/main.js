"use strict";
const common_vendor = require("./common/vendor.js");
const utils_service = require("./utils/service.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/ifica/ifica.js";
  "./pages/order/order.js";
  "./pages/orderlb/orderlb.js";
  "./pages/detail/detail.js";
  "./pages/adres/adres.js";
  "./pages/adresxz/adresxz.js";
  "./pages/mycoupon/mycoupon.js";
  "./pages/user-login/login.js";
  "./pages/my/my.js";
}
const _sfc_main$1 = {};
function _sfc_render(_ctx, _cache) {
  return {};
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-e56f1e0f"]]);
const _sfc_main = {
  components: { Couponlast: Component },
  onLaunch: function() {
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$http = utils_service.http;
  app.config.globalProperties.$baseURL = utils_service.baseURL;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.Component = Component;
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/main.js.map
