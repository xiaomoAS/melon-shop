<template>
	<view class="warpin">
		<view class="detail_baner">
			<image :src="detail.mainImgUrl" mode="widthFix"></image>
			<uni-icons class="detail_baner-icon" type="left" size="30" color="#FFFFFF" @click="backHandler"></uni-icons>
			<!-- <view class="detail_baner-title">{{ detail.title }}</view> -->
		</view>
		<view class="detail_inf_cont">
			<view class="title">{{ detail.title }}</view>
			<view class="detail-info-box">
				<view class="price_inf">
					<view class="price">￥{{ detail.price }}</view>
					<view class="dw"> /{{ detail.specName }}</view>
				</view>
				<view class="detail-info-box__right">
					<view class="allow">
						<view>发货时间:</view>
						<text>{{ formatDate(Number(detail.presaleStartTime), 'MM月DD日') }}</text>
					</view>
					<view class="allow">
						<view>已售</view>
						<text>{{ detail.saleCount }}</text>
						<view>{{ detail.specName }}</view>
					</view>
					<view class="allow">
						<view>剩余</view>
						<text>{{ detail.stock }}</text>
						<view>{{ detail.specName }}</view>
					</view>
				</view>
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
			
			<ShopCart v-if="token" :cart-type="CART_TYPE.BOTTOM" :info="{ ...detail, imgUrl: detail.mainImgUrl }"/>
		</view>
		
	</view>
</template>

<script>
import ShopCart from '@/components/shop-cart/index.vue'
import { CART_TYPE } from '@/components/shop-cart/constants.js'
import { formatDate } from '@/utils/common';

export default {
	name: 'ProductDetail',
	data() {
		return {
			detail: {},
			CART_TYPE,
			token: null
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
		},
		formatDate,
		backHandler() {
			uni.navigateBack()
		}
	},
	onLoad(options) {
		console.log('页面加载参数:', options)
		this.detail = {}
		this.token = uni.getStorageSync('token')
		if (options && options.id) {
			this.getProductDetail(options.id)
		}
	}
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>