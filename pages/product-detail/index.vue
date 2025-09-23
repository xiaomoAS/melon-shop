<template>
	<view class="warpin">
		<swiper class="detail_baner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item>
				<view class="swiper-item"><image :src="detail.mainImgUrl" mode="widthFix"></image> </view>
			</swiper-item>
		</swiper>
		<view class="detail_inf_cont">
			<view class="title">{{ detail.title }}</view>
			<view class="price_inf">
				<view class="price">￥{{ detail.price }}</view>
				<view class="dw"> /{{ detail.specName }}</view>
			</view>
			<view class="allow">
				<view>剩余</view>
				<text>{{ detail.stock }}</text>
				<view>份</view>
			</view>
		</view>
		<view class="contain">
			<view class="merch_speci_cont">
				<view class="merch_pulic_tle">商品描述</view>
				<view class="desc-text">{{ detail.desc }}</view>
				<view class="tips_dl">
					<view v-for="tag in detail.tagList" class="dd">{{ tag }}</view>
				</view>
			</view>
			<view class="merch_detail">
				<view class="merch_pulic_tle">商品详情</view>
				<view class="deta_inf">
					<image :src="detail.detailImgUrl" mode="widthFix"></image>
				</view>
			</view>
			
			<ShopCart :cart-type="CART_TYPE.BOTTOM" :info="detail"/>
		</view>
		
	</view>
</template>

<script>
import ShopCart from '@/components/shop-cart/index.vue'
import { CART_TYPE } from '@/components/shop-cart/constants.js'

export default {
	name: 'ProductDetail',
	data() {
		return {
			detail: {},
			CART_TYPE
		}
	},
	components: {
		ShopCart
	},
	methods: {
		async getProductDetail(id) {
			try {
				if (!id) return
				this.detail = await this.$http.post('/items/getProduct', { productId: Number(id) })
			} catch (error) {
				console.error('获取商品详情失败:', error)
				this.detail = {}
			}
		}
	},
	onLoad(options) {
		console.log('页面加载参数:', options)
		this.detail = {}
		if (options && options.id) {
			this.getProductDetail(options.id)
		}
	}
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>