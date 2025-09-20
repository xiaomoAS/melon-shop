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
    a: common_assets._imports_0$2,
    b: common_assets._imports_1$2,
    c: $data.dlzt
  }, $data.dlzt ? {} : {}, {
    d: common_assets._imports_2$1,
    e: common_assets._imports_3$2,
    f: common_assets._imports_3$2,
    g: common_assets._imports_4,
    h: common_assets._imports_5,
    i: common_assets._imports_6,
    j: common_assets._imports_7$2,
    k: _ctx.wxpay,
    l: common_assets._imports_8$1,
    m: _ctx.hypay
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
