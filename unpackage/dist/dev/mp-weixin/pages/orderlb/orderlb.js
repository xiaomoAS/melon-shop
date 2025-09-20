"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      reportFile: false,
      prolast: [],
      page: 0,
      total: 0,
      records: 0,
      loading: true,
      reportFileShow: false
    };
  },
  onLoad(option) {
    var that = this;
    that.proorder();
  },
  methods: {
    proorder() {
      this.loading = true;
      var that = this;
      let param = {};
      that.$http.get("/myorders/query", param, {}).then((res) => {
        that.prolast = res || [];
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_assets._imports_1,
    c: common_vendor.f($data.prolast, (item, index, i0) => {
      return {
        a: common_vendor.t(item.createdTime),
        b: common_vendor.t(item.orderStatus),
        c: common_vendor.t(item.realPayAmount),
        d: item.itemId
      };
    }),
    d: common_assets._imports_1
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/orderlb/orderlb.js.map
