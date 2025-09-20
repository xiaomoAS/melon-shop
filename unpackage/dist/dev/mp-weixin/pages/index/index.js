"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
getApp();
const _sfc_main = {
  data() {
    return {
      baseUrl: this.$baseURL,
      lbt: [],
      isShow: 0,
      joinCart: false,
      prorow: [],
      page: 0,
      total: 0,
      records: 0,
      loading: true,
      quantity: 1,
      reportFile: [],
      reportFileShow: false
    };
  },
  onLoad(option) {
    var that = this;
    that.getAll();
    that.proAll();
  },
  methods: {
    getAll() {
      var that = this;
      let param = {};
      this.$http.get("/index/carousel", param, {
        custom: {
          show: false
        }
      }).then((res) => {
        that.lbt = res;
      });
    },
    proAll() {
      this.loading = true;
      var that = this;
      let param = {};
      this.$http.get("/items/catItems", param, {}).then((res) => {
        that.prorow = res.rows || [];
      });
    },
    decrease() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_assets._imports_0$1,
    c: common_vendor.f($data.lbt, (item, index, i0) => {
      return {
        a: item.ItemUrl,
        b: index
      };
    }),
    d: common_assets._imports_2$2,
    e: common_assets._imports_3,
    f: common_assets._imports_4$1,
    g: common_assets._imports_5$2,
    h: common_assets._imports_6$1,
    i: common_assets._imports_7$1,
    j: common_assets._imports_8,
    k: common_assets._imports_1,
    l: common_assets._imports_10,
    m: common_assets._imports_1$1,
    n: common_assets._imports_2$3,
    o: common_vendor.f($data.prorow, (item, index, i0) => {
      return {
        a: item.mainImgUrl,
        b: common_vendor.t(item.itemName),
        c: common_vendor.t(item.price),
        d: item.itemId
      };
    }),
    p: common_assets._imports_3$1,
    q: common_assets._imports_4$2,
    r: common_assets._imports_3$1,
    s: common_vendor.o(($event) => $data.reportFileShow = !$data.reportFileShow),
    t: common_assets._imports_4$2,
    v: common_assets._imports_3$1,
    w: common_assets._imports_2,
    x: common_vendor.o(($event) => $data.joinCart = !$data.joinCart),
    y: $data.reportFile
  }, $data.reportFile ? {
    z: common_assets._imports_5$1,
    A: common_vendor.o(($event) => $data.reportFileShow = !$data.reportFileShow),
    B: common_assets._imports_2$1,
    C: common_assets._imports_7,
    D: $data.reportFileShow
  } : {}, {
    E: common_assets._imports_19,
    F: common_assets._imports_8,
    G: $data.quantity <= 1 ? 1 : "",
    H: common_vendor.o((...args) => $options.decrease && $options.decrease(...args)),
    I: common_assets._imports_20,
    J: common_vendor.t($data.quantity),
    K: common_vendor.o(($event) => $data.quantity++),
    L: common_assets._imports_21,
    M: common_assets._imports_5,
    N: common_assets._imports_4,
    O: common_assets._imports_6,
    P: common_assets._imports_4,
    Q: common_assets._imports_2,
    R: $data.joinCart
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
