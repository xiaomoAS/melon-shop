<template>
	<view>
		<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/916cae2f99af4241acf65617a6a07bd9/index_head_bg.png?Expires=2073875593&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=6l%2B1kM%2BmbcTT4vmhVbD6zlktjVo%3D" class="index_head_bg" mode="widthFix"></image>
		<view class="ifica_search_head">
			<view class="head_logo">
				<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/da449df52fc542dc9750403211634c3a/yuguo_logo%20%281%29.png?Expires=2076054860&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=MD4eu2NbpcKOFbv7%2BtjyfdHlctI%3D" mode="aspectFit"></image>
			</view>
			<view class="int_cont">
				<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4504ca659b80453ca747baaabba8d106/ico_1.png?Expires=2073875740&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=yYeoocs0saGNdYETNQ9FgrHVaB0%3D" mode="widthFix" @click="toSearchPage"></image>
				<input v-model="searchWords" type="text" placeholder="搜索您的商品" @confirm="toSearchPage">
				<view class="btn" @click="toSearchPage">搜索</view>
			</view>
		</view>
		<view class="ifiac_filter_cont">
			<view class="l_filter_nav">
				<view class="li" :class="{ active: item.id === activeCate }" v-for="item in cateList" :key="item.id" @click="cateClickHandler(item.id)">{{ item.name }}</view>
			</view>
			<view class="main_cont">
				<view class="index_pro_contain">
					<image class="pro_head_bg" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/608def905ee846eab80b698d5d29c6e5/index_case2_bg.png?Expires=2073875992&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=Zd2Oz8m0uYQy8idN34qA4pxtSJc%3D" mode="widthFix"></image>
					<view class="title_head">
						<image class="logo" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/b5a62a0a9f344046b6ecccd5d5f9184a/pro_logo.png?Expires=2073875894&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=UhwsRTz1JJlnDOlP0K4Tm0ABWGk%3D" mode="widthFix"></image>
						<view class="dt">猹精选</view>
						<view class="txt">好吃，健康，可信赖</view>
					</view>
					<view class="pro_list_cont" v-for="(item, index) in productList" :key="index" :class="{ 'null': !item.stock }">
						<ProductItem :info="item" :cart-list="cartList" @refreshShopCart="refreshShopCart"/>
					</view>
					<ShopCart ref="shopCartRef" @updateCartList="(val) => cartList = val"/>
				</view>
				
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
</template>

<script>
import ProductItem from '@/components/product-item/index.vue'
import LoadMore from '@/components/load-more/index.vue'
import ShopCart from '@/components/shop-cart/index.vue'

export default{
	data(){
		return {
			cateList:[],
			productList: [],
			page: 1,
			pageSize: 5,
			totalCount: 0,
			activeCate: null,
			searchWords: '',
			cartList: []
		}
	},
	computed: {
		noMoreData() {
			return this.page * this.pageSize >= this.totalCount
		},
	},
	components: {
		ProductItem,
		LoadMore,
		ShopCart
	},
	async onShow() {
		this.productList = []
		this.page = 1 // 重置页码
		const id = wx.getStorageSync('cateId')
		await this.getCates()
		this.activeCate = id || (this.cateList.length ? this.cateList[0].id : null)
		this.getProductList()
		this.refreshShopCart()
	},
	methods: {
		refreshShopCart() {
			if (this.$refs.shopCartRef) {
				this.$refs.shopCartRef.refreshShopCart()
			}
		},
		toSearchPage() {
			uni.navigateTo({ url: `/pages/search-page/index?keywords=${this.searchWords}` })
		},
		cateClickHandler(id) {
			this.productList = []
			this.page = 1 // 重置页码
			this.activeCate = id;
			wx.setStorageSync('cateId', id)
			this.getProductList()
		},
		async getCates() {
			try {
				this.cateList = await this.$http.post('/index/cats', {})
			} catch (error) {
				this.cateList = []
			}
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
				const { rows, total } = await this.$http.post('/items/catItems', {
					cateId:this.activeCate ? Number(this.activeCate) : null,
					page: this.page,
					pageSize: this.pageSize,
				})
				this.productList.push(...rows)
				this.totalCount = total
			} catch (error) {
				this.productList = []
				this.totalCount = 0
			}
		},
	},
}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>