<template>
	<view class="main-box">
		<view class="ifica_search_head">
			<view class="int_cont">
				<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4504ca659b80453ca747baaabba8d106/ico_1.png?Expires=2073875740&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=yYeoocs0saGNdYETNQ9FgrHVaB0%3D" mode="widthFix" @click="searchHandlder"></image>
				<input v-model="keywords" type="text" placeholder="搜索您的商品" @confirm="searchHandlder">
				<view class="btn" @click="searchHandlder">搜索</view>
			</view>
		</view>
		<view class="ifiac_filter_cont">
			<view class="main_cont">
				<view class="index_pro_contain">
					<image class="pro_head_bg" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/608def905ee846eab80b698d5d29c6e5/index_case2_bg.png?Expires=2073875992&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=Zd2Oz8m0uYQy8idN34qA4pxtSJc%3D" mode="widthFix"></image>
					<view class="title_head">
						<image class="logo" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/b5a62a0a9f344046b6ecccd5d5f9184a/pro_logo.png?Expires=2073875894&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=UhwsRTz1JJlnDOlP0K4Tm0ABWGk%3D" mode="widthFix"></image>
						<view class="dt">钰果精选</view>
						<view v-if="productIdList" class="txt">该券可用商品</view>
						<view v-else class="txt">搜索商品结果</view>
					</view>

					<view v-if="!productList.length" class="no-content">暂无相关商品～</view>

					<view class="pro_list_cont" v-for="item in productList" :key="item.productId" :class="{ 'null': !item.stock }">
						<ProductItem :info="item" :cart-list="cartList" @refreshShopCart="refreshShopCart"/>
					</view>
					
					<ShopCart v-if="token" ref=shopCartRef @updateCartList="(val) => cartList = val" />
					<LoadMore 
						v-if="productList.length && !noMoreData"
						@visible="loadMoreData" 
						:threshold="50"
						:once="false"
					>
						<view class="custom-load-more">
							<span>上拉加载更多</span>
						</view>
					</LoadMore>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import ProductItem from '@/components/product-item/index.vue'
import LoadMore from '@/components/load-more/index.vue'
import ShopCart from '@/components/shop-cart/index.vue'

export default{
	data(){
		return {
			productList: [],
			page: 1,
			pageSize: 5,
			totalCount: 0,
			keywords: '',
			productIdList: undefined,
			cartList: [],
			token: null,
		}
	},
	components: {
		ProductItem,
		LoadMore,
		ShopCart
	},
	computed: {
		noMoreData() {
			return this.page * this.pageSize >= this.totalCount
		},
	},
	async onLoad(options) {
		if (options.productIdList) {
			this.productIdList =  options.productIdList.split(',')
		}
		this.keywords = options.keywords || ''
		this.getProductList()
	},
	onShow() {
		this.token = uni.getStorageSync('token')
		this.refreshShopCart()
	},
	methods: {
		refreshShopCart() {
			if (this.$refs.shopCartRef) {
				this.$refs.shopCartRef.refreshShopCart()
			}
		},
		searchHandlder() {
			this.productList = []
			this.page = 1 // 重置页码
			this.productIdList = undefined
			this.getProductList()
		},
		loadMoreData() {
			// 检查是否还有更多数据
			if (this.noMoreData) {
				console.log('没有更多数据了')
				return
			}
			// 增加页码并加载下一页
			this.page = this.page + 1
			this.getProductList()
		},
		async getProductList() {
			try {
				const { rows, total } = await this.$http.post('/items/search', {
					keywords: this.keywords,
					productIdList: this.productIdList,
					page: this.page,
					pageSize: this.pageSize,
				})
				this.productList = this.productList.concat(rows)
				this.totalCount = total
			} catch (error) {
				this.productList = []
				this.totalCount = 0
			}
		},
	},
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>