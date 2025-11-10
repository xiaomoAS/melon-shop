<template>
	<view class="contain">
		<view class="coupon_baner">
			<image :src="resourceInfo.url" mode="widthFix" @click="resourceHrefHandler(resourceInfo)"></image>
		</view>
		<view class="coupon_nav">
			<view
				v-for="tab in COUNPON_TABS"
				:key="tab.label"
				class="li"
				:class="{ active: activeTab === tab.value }"
				@click="switchTab(tab.value)"
			>
				<text>{{ tab.label }}</text>
			</view>
		</view>
		<CouponList :coupon-type="activeTab"></CouponList>
	</view>
</template>

<script>
import CouponList from '@/components/coupon-list/index.vue'
import { COUPON_TYPE } from '@/components/coupon-list/constants.js'
import { resourceHrefHandler } from '@/utils/common'
import { COUNPON_TABS } from './constants'

export default {
	name: 'MyCounpon',
	components: {
		CouponList
	},
	data() {
		return {
			activeTab: COUPON_TYPE.ALL, // 当前激活的tab
			COUPON_TYPE,
			resourceInfo: {
				url: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/42bed1e64df34a5bae49856265907066/carousel-1.png?Expires=2073865388&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=wibX0MJ%2By7WmGBHvAoaHXBrkaEE%3D'
			},
			COUNPON_TABS
		}
	},
	onLoad() {
		this.getTopImg()
	},
	onShareAppMessage() {
		return {
			path: '/pages/index/index'
		}
	},
	onShareTimeline() {
		return {
			path: '/pages/index/index'
		}
	},
	methods: {
		async getTopImg() {
			try {
				this.resourceInfo = await this.$http.post('/resource/get', { id: 16 })
			} catch (error) {
				this.resourceInfo.url = 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/42bed1e64df34a5bae49856265907066/carousel-1.png?Expires=2073865388&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=wibX0MJ%2By7WmGBHvAoaHXBrkaEE%3D'
			}
		},
		// 切换tab
		switchTab(type) {
			this.activeTab = type;
			console.log('切换到tab:', tabName, 'type:', type);
		},
		resourceHrefHandler
	}
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>