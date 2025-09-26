<template>
	<view>
		<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/916cae2f99af4241acf65617a6a07bd9/index_head_bg.png?Expires=2073875593&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=6l%2B1kM%2BmbcTT4vmhVbD6zlktjVo%3D" class="index_head_bg" mode="widthFix"></image>
		<view class="contain">
			<view class="index_header_cont">
				<view class="head_logo">
					<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4cba2ff43c034c16aab096a3d322ee2e/orange-logo%20%281%29.png?Expires=2073975970&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=svCx34i6wBqlgJ1PYCcMbpAby3c%3D" mode="aspectFit"></image>
				</view>
				<view class="index_search">
					<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4504ca659b80453ca747baaabba8d106/ico_1.png?Expires=2073875740&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=yYeoocs0saGNdYETNQ9FgrHVaB0%3D" mode="widthFix" @click="toSearchPage"></image>
					<input v-model="searchWords" type="text" placeholder="搜索您喜欢的商品">
					<view class="btn" @click="toSearchPage">搜索</view>
				</view>
				<!-- 轮播图 -->
				<swiper v-if="carouselImages.length" class="index_baner" :autoplay="true" :interval="3000" :duration="1000">
					<swiper-item v-for="(item,index) in carouselImages" :key="index">
						<view class="swiper-item"><image :src="item.url" name="{{item.name}}" id="{{item.id}}" mode="aspectFill"></image> </view>
					</swiper-item>
				</swiper>

				<!-- 类目 -->
				<view class="index_navi_cont">
					<view class="list" @click="toCatePage()">
						<view class="tis_i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/3db470eba37b45109b31a31bc4862b42/quanbushangpin.png?Expires=2073903146&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=DTAVQSjY5F6da5ibaWHkzyipNus%3D" mode="widthFix"></image> </view>
						<view class="txt">全部商品</view>
					</view>
					
					<view v-for="item in cateList.slice(0, 4)" :key="item.id" class="list" @click="toCatePage(item.id)">
						<view class="tis_i"><image :src="item.logoUrl" mode="widthFix"></image> </view>
						<view class="txt">{{ item.name }}</view>
					</view>
				</view>

				<!-- 新人专享 -->
				<view v-if="newPersonList.length" class="index_new_vip">
					<image class="tips" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/29b37b79ca524070b69881a8a0be4d84/tip_1.png?Expires=2073875832&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=yea3i%2FfwVPnD91oEwgNeiUyJ4x8%3D" mode="widthFix" @click="toCatePage()"></image>
					<view class="head_title">
						<view class="tle">新人<text>专享</text> </view>
						<view class="txt">开启品质生活</view>
					</view>
					<view class="pro_last">
						<view v-for="(newItem, index) in newPersonList" :key="index" class="list_cont">
							<navigator :url="`/pages/product-detail/index?id=${newItem.productId}`">
								<view class="tis_i">
									<image class="i" :src="newItem.imgUrl" mode="widthFix"></image> 
									<view class="tip_txt">新客专享</view>
								</view>
								<view class="pro_name">{{ newItem.title }}</view>
								<view class="pro_price">
									<view class="dt">新人价</view>
									<view class="dd">￥{{ newItem.realpayPrice }}</view>
								</view>
							</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 推荐商品 -->
		<view class="index_pro_contain">
			<image class="pro_head_bg" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/608def905ee846eab80b698d5d29c6e5/index_case2_bg.png?Expires=2073875992&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=Zd2Oz8m0uYQy8idN34qA4pxtSJc%3D" mode="widthFix"></image>
			<view class="title_head">
				<image class="logo" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/b5a62a0a9f344046b6ecccd5d5f9184a/pro_logo.png?Expires=2073875894&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=UhwsRTz1JJlnDOlP0K4Tm0ABWGk%3D" mode="widthFix"></image>
				<view class="dt">团购好货</view>
				<view class="txt">三餐四季 尽在知花</view>
			</view>
			<view class="pro_list_cont" v-for="item in productList" :key="item.productId" :class="{ 'null': !item.stock }">
				<ProductItem :info="item" />
			</view>
			<LoadMore 
				v-if="!noMoreData"
				@visible="loadMoreData" 
				:threshold="50"
				:once="false"
			>
				<view class="custom-load-more">
					<span>上拉加载更多</span>
				</view>
			</LoadMore>
		</view>
		<ShopCart ref="shopCartRef" />
	</view>
</template>
<script>
	import ProductItem from '@/components/product-item/index.vue'
	import ShopCart from '@/components/shop-cart/index.vue'
	import LoadMore from '@/components/load-more/index.vue'
	const app = getApp()
	export default {
		data() {
			return {
				baseUrl: this.$baseURL,
				carouselImages: [],
				cateList: [], // 所有类目
				newPersonList: [],
				isShow:0,
				productList: [],
				page: 1,
				pageSize: 5,
				totalCount: 0,
				searchWords: ''
			}
		},
		components: {
			ProductItem,
			ShopCart,
			LoadMore
		},
		computed: {
			noMoreData() {
				return this.page * this.pageSize >= this.totalCount
			},
		},
		onShow() {
			this.page = 1
			this.productList = []
			this.getCarouselImages()
			this.getCates();
			this.getNewPerson()
			this.getProductList()
			// 强制刷新购物车数据
			this.refreshShopCart()
		},
		methods: {
			toCatePage(id = null) {
				wx.setStorageSync('cateId', id)
				uni.switchTab({ url: '/pages/product-list/index' })
			},
			toSearchPage() {
				uni.navigateTo({ url: `/pages/search-page/index?keywords=${this.searchWords}` })
			},
			loadMoreData() {
				// 加载完了
				if (this.noMoreData) return
				this.page = this.page + 1
				this.getProductList()
			},
			async getProductList() {
				try {
					const { rows, total } = await this.$http.post('/items/recommend', {
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
			async getCarouselImages() {
				try {
				console.log(11111)
					this.carouselImages = await this.$http.post('/index/carousel', {})
				} catch (error) {
					this.carouselImages = []
				}
			},
			async getCates() {
				try {
					this.cateList = await this.$http.post('/index/cats', {})
				} catch (error) {
					this.cateList = []
				}
			},
			async getNewPerson() {
				try {
					const { rows } = await this.$http.post('/items/newperson', {
						page: 1,
						pageSize: 10
					})
					this.newPersonList = rows.slice(0, 3)
				} catch (error) {
					this.newPersonList = []
				}
			},
			// 强制刷新购物车数据
			refreshShopCart() {
				// 使用全局事件触发购物车刷新
				uni.$emit('refreshShopCart')
				uni.$emit('closeShopCart')
			}
		},

	}
</script>

<style>
	@import url(/pages/index/index.css);
	@import url(/pages/index/prolast.css);
</style>
