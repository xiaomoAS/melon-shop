"use strict";
const common_vendor = require("../../common/vendor.js");
const ProductItem = () => "../../components/product-item/ProductItem.js";
const ShopCart = () => "../../components/shop-cart/ShopCart.js";
getApp();
const _sfc_main = {
  data() {
    return {
      baseUrl: this.$baseURL,
      carouselImages: [],
      cateList: [],
      // 所有类目
      newPersonList: [],
      isShow: 0,
      productList: [],
      noMoreData: false,
      page: 1,
      pageSize: 5
    };
  },
  components: {
    ProductItem,
    ShopCart
  },
  onShow() {
    this.getCarouselImages();
    this.getCates();
    this.getNewPerson();
    this.getProductList();
    this.refreshShopCart();
  },
  methods: {
    loadMoreData() {
      if (this.noMoreData)
        return;
      this.page = this.page + 1;
      this.getProductList();
    },
    async getProductList() {
      try {
        const { rows } = await this.$http.post("/items/recommend", {
          page: this.page,
          pageSize: this.pageSize
        });
        if (!rows.length) {
          this.noMoreData = true;
        }
        this.productList = this.productList.concat(rows);
      } catch (error) {
        this.productList = [];
      }
    },
    async getCarouselImages() {
      try {
        common_vendor.index.__f__("log", "at pages/index/index.vue:114", 11111);
        this.carouselImages = await this.$http.post("/index/carousel", {});
      } catch (error) {
        this.carouselImages = [];
      }
    },
    async getCates() {
      try {
        this.cateList = await this.$http.post("/index/cats", {});
      } catch (error) {
        this.cateList = [];
      }
    },
    async getNewPerson() {
      try {
        const { rows } = await this.$http.post("/items/newperson", {
          page: 1,
          pageSize: 10
        });
        this.newPersonList = rows.slice(0, 3);
      } catch (error) {
        this.newPersonList = [];
      }
    },
    // 强制刷新购物车数据
    refreshShopCart() {
      common_vendor.index.$emit("refreshShopCart");
    }
  }
};
if (!Array) {
  const _component_ProductItem = common_vendor.resolveComponent("ProductItem");
  const _component_ShopCart = common_vendor.resolveComponent("ShopCart");
  (_component_ProductItem + _component_ShopCart)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.carouselImages, (item, index, i0) => {
      return {
        a: item.url,
        b: index
      };
    }),
    b: common_vendor.f($data.cateList, (item, k0, i0) => {
      return {
        a: item.logoUrl,
        b: common_vendor.t(item.name),
        c: item.id
      };
    }),
    c: $data.newPersonList.length
  }, $data.newPersonList.length ? {
    d: common_vendor.f($data.newPersonList, (newItem, index, i0) => {
      return {
        a: newItem.imgUrl,
        b: common_vendor.t(newItem.title),
        c: common_vendor.t(newItem.realpayPrice),
        d: index
      };
    })
  } : {}, {
    e: common_vendor.f($data.productList, (item, k0, i0) => {
      return {
        a: "7d753c92-0-" + i0,
        b: common_vendor.p({
          info: item
        }),
        c: item.productId,
        d: !item.stock ? 1 : ""
      };
    }),
    f: common_vendor.sr("shopCartRef", "7d753c92-1"),
    g: common_vendor.o((...args) => $options.loadMoreData && $options.loadMoreData(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
