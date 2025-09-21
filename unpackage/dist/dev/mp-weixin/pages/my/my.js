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
    a: common_assets._imports_0,
    b: common_assets._imports_1$5,
    c: common_assets._imports_2$5,
    d: $data.lvdj === "pj"
  }, $data.lvdj === "pj" ? {
    e: common_assets._imports_2$4
  } : $data.lvdj === "pt" ? {
    g: common_assets._imports_4$3
  } : $data.lvdj === "zs" ? {
    i: common_assets._imports_5$3
  } : {}, {
    f: $data.lvdj === "pt",
    h: $data.lvdj === "zs",
    j: common_assets._imports_6$2,
    k: common_assets._imports_7$3,
    l: common_assets._imports_8$2,
    m: $data.lvdj === "pj",
    n: common_assets._imports_9,
    o: $data.lvdj === "pt",
    p: common_assets._imports_10$1,
    q: common_assets._imports_11,
    r: $data.lvdj === "zs",
    s: common_assets._imports_12,
    t: $data.lvdj === "pj",
    v: common_assets._imports_13,
    w: $data.lvdj === "pt",
    x: $data.lvdj === "pj" ? 1 : "",
    y: $data.lvdj === "pt" ? 1 : "",
    z: $data.lvdj === "zs" ? 1 : "",
    A: common_assets._imports_14,
    B: common_vendor.sr("Couponlast", "fe465e50-0"),
    C: $data.dczt,
    D: common_vendor.sr("Recharge", "fe465e50-1"),
    E: $data.dczt
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
