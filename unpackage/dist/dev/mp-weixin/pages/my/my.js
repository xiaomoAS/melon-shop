"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const Recharge = () => "../../components/Recharge/Recharge.js";
const _sfc_main = {
  components: {
    "re-charge": Recharge
  },
  data() {
    return {
      lvdj: "zs",
      dczt: false
    };
  }
};
if (!Array) {
  const _easycom_coupon_list2 = common_vendor.resolveComponent("coupon-list");
  const _component_re_charge = common_vendor.resolveComponent("re-charge");
  (_easycom_coupon_list2 + _component_re_charge)();
}
const _easycom_coupon_list = () => "../../components/coupon-list/coupon-list.js";
if (!Math) {
  _easycom_coupon_list();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_1$3,
    b: common_assets._imports_1$4,
    c: $data.lvdj === "pj"
  }, $data.lvdj === "pj" ? {
    d: common_assets._imports_2$1
  } : $data.lvdj === "pt" ? {
    f: common_assets._imports_3$1
  } : $data.lvdj === "zs" ? {
    h: common_assets._imports_4$1
  } : {}, {
    e: $data.lvdj === "pt",
    g: $data.lvdj === "zs",
    i: common_assets._imports_5,
    j: common_assets._imports_6,
    k: common_assets._imports_7,
    l: $data.lvdj === "pj",
    m: common_assets._imports_8,
    n: $data.lvdj === "pt",
    o: common_assets._imports_9,
    p: common_assets._imports_10,
    q: $data.lvdj === "zs",
    r: common_assets._imports_11,
    s: $data.lvdj === "pj",
    t: common_assets._imports_12,
    v: $data.lvdj === "pt",
    w: $data.lvdj === "pj" ? 1 : "",
    x: $data.lvdj === "pt" ? 1 : "",
    y: $data.lvdj === "zs" ? 1 : "",
    z: common_assets._imports_13,
    A: common_vendor.sr("Couponlast", "e5092228-0"),
    B: $data.dczt,
    C: common_vendor.sr("Recharge", "e5092228-1"),
    D: $data.dczt
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
