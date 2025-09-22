"use strict";
const common_vendor = require("../../common/vendor.js");
const ProductItem = () => "../../components/product-item/ProductItem.js";
const LoadMore = () => "../../components/load-more/index.js";
const _sfc_main = {
  data() {
    return {
      cateList: [],
      productList: [],
      page: 1,
      pageSize: 5,
      totalCount: 0,
      activeCate: null
    };
  },
  computed: {
    noMoreData() {
      return this.page * this.pageSize >= this.totalCount;
    }
  },
  components: {
    ProductItem,
    LoadMore
  },
  async onShow() {
    this.productList = [];
    this.page = 1;
    const id = common_vendor.wx$1.getStorageSync("cateId");
    await this.getCates();
    this.activeCate = id || (this.cateList.length ? this.cateList[0].id : null);
    this.getProductList();
  },
  methods: {
    cateClickHandler(id) {
      this.productList = [];
      this.page = 1;
      this.activeCate = id;
      this.getProductList();
    },
    async getCates() {
      try {
        this.cateList = await this.$http.post("/index/cats", {});
      } catch (error) {
        this.cateList = [];
      }
    },
    loadMoreData() {
      if (this.noMoreData) {
        common_vendor.index.__f__("log", "at pages/ifica/ifica.vue:91", "没有更多数据了");
        return;
      }
      this.page = this.page + 1;
      this.getProductList();
    },
    async getProductList() {
      try {
        const { rows, total } = await this.$http.post("/items/catItems", {
          cateId: this.activeCate ? Number(this.activeCate) : null,
          page: this.page,
          pageSize: this.pageSize
        });
        this.productList.push(...rows);
        this.totalCount = total;
      } catch (error) {
        this.productList = [];
        this.totalCount = 0;
      }
    }
  }
};
if (!Array) {
  const _component_ProductItem = common_vendor.resolveComponent("ProductItem");
  const _component_LoadMore = common_vendor.resolveComponent("LoadMore");
  (_component_ProductItem + _component_LoadMore)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.cateList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: item.id === $data.activeCate ? 1 : "",
        c: item.id,
        d: common_vendor.o(($event) => $options.cateClickHandler(item.id), item.id)
      };
    }),
    b: common_vendor.f($data.productList, (item, index, i0) => {
      return {
        a: "6beea982-0-" + i0,
        b: common_vendor.p({
          info: item
        }),
        c: index,
        d: !item.stock ? 1 : ""
      };
    }),
    c: !$options.noMoreData
  }, !$options.noMoreData ? {
    d: common_vendor.o($options.loadMoreData),
    e: common_vendor.p({
      threshold: 50,
      once: false
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ifica/ifica.js.map
