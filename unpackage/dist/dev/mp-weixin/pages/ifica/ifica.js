"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      reportFile: false,
      prorow: [],
      filnav: [],
      page: 0,
      total: 0,
      records: 0,
      loading: true,
      reportFileShow: false
    };
  },
  onLoad(option) {
    var that = this;
    that.proAll();
    that.filenav()();
  },
  methods: {
    catItemsid(id) {
      this.filenav(id);
    },
    filenav(id) {
      this.loading = true;
      var that = this;
      let param = { id };
      this.$http.get("/index/cats", param, {}).then((res) => {
        that.filnav = res;
      });
    },
    proAll() {
      this.loading = true;
      var that = this;
      let param = {};
      this.$http.get("/items/catItems", param, {}).then((res) => {
        that.prorow = res.rows || [];
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$1,
    b: common_vendor.f($data.filnav, (item, index, i0) => {
      return {
        a: common_vendor.t(item.Name),
        b: item.Name,
        c: item.id,
        d: common_vendor.o(($event) => $options.catItemsid(item.id), item.Name)
      };
    }),
    c: common_assets._imports_1$1,
    d: common_assets._imports_2$1,
    e: common_vendor.f($data.prorow, (item, index, i0) => {
      return {
        a: item.mainImgUrl,
        b: common_vendor.t(item.itemName),
        c: common_vendor.t(item.ItemAttribute),
        d: common_vendor.t(item.price),
        e: common_vendor.o(($event) => $data.reportFileShow = !$data.reportFileShow, item.itemId),
        f: item.itemId
      };
    }),
    f: common_assets._imports_3$1,
    g: common_assets._imports_4$1,
    h: common_assets._imports_3$1,
    i: common_vendor.o(($event) => $data.reportFileShow = !$data.reportFileShow),
    j: common_assets._imports_4$1,
    k: common_assets._imports_3$1,
    l: $data.reportFile
  }, $data.reportFile ? {
    m: common_assets._imports_5$2,
    n: common_assets._imports_2$3,
    o: common_assets._imports_7$1,
    p: $data.reportFileShow
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ifica/ifica.js.map
