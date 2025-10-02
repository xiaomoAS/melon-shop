<template>
	<view class="pro_list_cont">
		<view v-if="!info.stock" class="no-stock-back"></view>
		<navigator class="navigator" :url="`/pages/product-detail/index?id=${info.productId}`" :class="{ disabled: !info.stock }">
			<view class="pro_i">
				<view v-if="!info.stock" class="no-stock__img-back">
					<image class="no-stock__img-back--img" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/e31f1be8adee4b8ba9e573c3ce3d8f1d/%E7%BB%84%2015166%20%281%29.png?Expires=2074390376&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=IFkA5FRXbVp8sO7DTg9R2hvS7sM%3D" mode="widthFix"></image>
				</view>
				<image class="i" :src="info.imgUrl" mode="widthFix"></image> 
				<view class="pro__tip-box">
					<view v-if="info.stock">预售期：{{ formatDate(Number(info.presaleStartTime), 'MM月DD日') }}</view>
					<view class="pro__tip-box--stock">已售{{ info.saleCount }}{{ info.specName }}/剩余{{ info.stock }}{{ info.specName }}</view>
				</view>
			</view>
			<view class="bit_cont">
				<view class="name">{{ info.title }}</view>
				<view class="det_txt">{{ info.desc }}</view>
				<view class="bit_deta">
					<view class="tips_dl">
						<view v-for="(tag, index) in info.tagList" :key="index" class="dd bg_3">{{ tag }}</view>
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
				<view v-if="curBuyCounts <= 0" class="btn btn_ys_2" @click="addCart">加入购物车</view>
				<view v-else class="count-btn-box">
					<image class="count-btn less" :class="{disabled: curBuyCounts <= 0}" @click="deleteCart" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/debd0e25572e47af91bba4464c516404/acout_less.png?Expires=2073876207&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=M6WnCyRZy%2BzvT4P48LUAkRFZt%2FU%3D"  mode="widthFix"></image>
					<view class="count-btn__text">{{ curBuyCounts }}</view>
					<image class="count-btn plus" @click="addCart" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/007b7c6a2307494ab99542b2106ab33a/acout_plus.png?Expires=2073876383&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=JTh8cJynH3CggbgPqexKOe5qsO0%3D" mode="widthFix"></image>
				</view>
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
		},
		cartList: {
			type: Array,
			required: false,
			default: () => ([])
		}
	},
	computed: {
		curBuyCounts() {
			// 当前商品购物车数量
			const curProductInCart = this.cartList.find((item) => item.productId === this.info.productId)
			return curProductInCart ? curProductInCart.buyCounts || 0 : 0
		}
	},
	methods: {
		async deleteCart() {
			try {
				if (this.curBuyCounts <= 0) return
				// 只剩一个了，购物车清除该商品
				if (this.curBuyCounts === 1) {
					uni.showModal({
						title: '',
						content: '确认要剔除该商品?',
						success: async (res) => {
							if (res.confirm) {
								await this.$http.post('/shopcart/delete', { ...this.info, buyCounts: undefined, changeCount: 1 })
								uni.showToast({ title: '剔除成功', icon: 'none' })
								this.$emit('refreshShopCart')
							} else if (res.cancel) {}
						}
					})
				} else {
					await this.$http.post('/shopcart/delete', { ...this.info, buyCounts: undefined, changeCount: 1 })
					this.$emit('refreshShopCart')
				}
			} catch (error) {
				console.log('error', error);
			}
		},
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
				this.$emit('refreshShopCart')
			} catch (error) {}
		}
	}
}
</script>

<style lang="scss">
@import './index.scss';  	       
</style>
