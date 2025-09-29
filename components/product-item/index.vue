<template>
	<view class="pro_list_cont">
		<view v-if="!info.stock" class="no-stock-back"></view>
		<navigator class="navigator" :url="`/pages/product-detail/index?id=${info.productId}`" :class="{ disabled: !info.stock }">
			<view class="pro_i">
				<view v-if="!info.stock" class="no-stock__img-back">
					<image class="no-stock__img-back--img" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/e31f1be8adee4b8ba9e573c3ce3d8f1d/%E7%BB%84%2015166%20%281%29.png?Expires=2074390376&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=IFkA5FRXbVp8sO7DTg9R2hvS7sM%3D" mode="widthFix"></image>
				</view>
				<image class="i" :src="info.imgUrl" mode="widthFix"></image> 
			</view>
			<view class="bit_cont">
				<view class="name">{{ info.title }}</view>
				<view class="det_txt">{{ info.desc }}</view>
				<view class="bit_deta">
					<view class="tips_dl">
						<view v-for="(tag, index) in info.tagList" :key="index" class="dd bg_3">{{ tag }}</view>
					</view>
					<view v-if="info.stock" class="ys_time">
						<view class="dt">预售期</view>
						<view class="dd">{{ formatDate(Number(info.presaleStartTime), 'MM月DD日') }}</view>
					</view>
				</view>
			</view>
		</navigator>

		<view class="bit_seet">
			<view class="price">￥<text>{{ info.price }}</text> 
				<view class="dd">/{{ info.specName }}</view> 
			</view>
			<view class="btn_dl">
				<ReportViewer :product-id="info.productId">
					<view class="btn btn_ys_1">检测报告</view>
				</ReportViewer>
				<view class="btn btn_ys_2" @click="addCart(info)">加入购物车</view>
			</view>
		</view>
	</view>
</template>

<script>
import { formatDate } from '../../utils/common';
import ReportViewer from '../report-view/index.vue';

export default {
	name: 'ProductItem',
	components: {
		ReportViewer
	},
	props: {
		info: {
			type: Object,
			required: true,
			default: () => ({})
		}
	},
	methods: {
		formatDate,
		async addCart() {
			try {
				const cartList = await this.$http.post('/shopcart/list', {}) || []
				const curProductStock = this.info.stock
				const curProductInCart = cartList.find((item) => item.productId === this.info.productId)
				if (curProductInCart && curProductInCart.buyCounts >= curProductStock) {
					uni.showToast({ title: '该商品购物车数量已到达库存最大值', icon: 'none' })
					return
				}
				await this.$http.post('/shopcart/add', { ...this.info, changeCount: 1 })
				uni.showToast({ title: '添加成功', icon: 'none' })
				uni.$emit('refreshShopCart')
			} catch (error) {
				uni.showToast({ title: '添加失败', icon: 'none' })
			}
		}
	}
}
</script>

<style lang="scss">
@import './index.scss';  	       
</style>
