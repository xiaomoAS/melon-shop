<template>
	<view class="pro_list_cont">
		<view class="pro_i">
			<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/ca9ad615ebb2406c8c43d0a88a7c1726/pro_i_1.png?Expires=2073876674&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=kTdBclTZdy3VJykCaO8LpJPdcEU%3D" mode="widthFix"></image> 
			<image class="i_over" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/6fe849515c0a4aec8c00118a90480a67/pro_over.png?Expires=2073876962&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=OruFFlkcGDyUcpsNLbKRtVpdNWo%3D" mode="widthFix"></image> 
		</view>
		<view class="bit_cont">
			<view class="name">{{ info.title }}</view>
			<view class="det_txt">{{ info.desc }}</view>
			<view class="bit_deta">
				<view class="tips_dl">
					<view v-for="(tag, index) in info.tagList" :key="index" class="dd bg_3">{{ tag }}</view>
				</view>
				<view class="ys_time">
					<view class="dt">预售期</view>
					<view class="dd">{{ formatDate(Number(info.presaleStartTime), 'MM月DD日') }}</view>
				</view>
			</view>
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
				await this.$http.post('/shopcart/add', { ...this.info })
				uni.showToast({ title: '添加成功' })
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
