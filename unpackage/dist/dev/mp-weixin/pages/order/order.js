"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      dlzt: true
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: $data.dlzt
  }, $data.dlzt ? {} : {}, {
    c: common_assets._imports_1,
    d: common_assets._imports_2,
    e: common_assets._imports_2,
    f: common_assets._imports_3,
    g: _ctx.wxpay,
    h: common_assets._imports_4,
    i: _ctx.hypay
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
