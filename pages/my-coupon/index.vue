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
		<CouponList ref="couponListRef" :coupon-type="couponType" :expired-type="expiredType" :scene="COUPON_LIST_SCENE.ALL"></CouponList>
	</view>
</template>

<script>
import CouponList from '@/components/coupon-list/index.vue'
import { COUPON_TYPE, EXPIRED_TYPE, COUPON_LIST_SCENE } from '@/components/coupon-list/constants.js'
import { resourceHrefHandler } from '@/utils/common'
import { COUNPON_TABS, COUPON_TAB_TYPE } from './constants'

export default {
	name: 'MyCounpon',
	components: {
		CouponList
	},
	data() {
		return {
			activeTab: COUPON_TAB_TYPE.ALL, // 当前激活的tab
			COUPON_TYPE,
			COUPON_LIST_SCENE,
			resourceInfo: {
				url: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/42bed1e64df34a5bae49856265907066/carousel-1.png?Expires=2073865388&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=wibX0MJ%2By7WmGBHvAoaHXBrkaEE%3D'
			},
			COUNPON_TABS
		}
	},
	computed: {
		couponType() {
			if (this.activeTab === COUPON_TAB_TYPE.NEW_DISCOUNT) {
				return COUPON_TYPE.NEW_DISCOUNT
			}
			if (this.activeTab === COUPON_TAB_TYPE.FREIGHT) {
				return COUPON_TYPE.FREIGHT
			}
			return null
		},
		expiredType() {
			if (this.activeTab === COUPON_TAB_TYPE.EXPIRED) {
				return EXPIRED_TYPE.EXPIRED
			}
			return null
		},
	},
	onLoad() {
		this.getTopImg()
		this.$nextTick(() => {
			this.$refs.couponListRef && this.$refs.couponListRef.getCouponList(true)
		})
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
			this.$nextTick(() => {
				this.$refs.couponListRef && this.$refs.couponListRef.getCouponList(true)
			})
		},
		resourceHrefHandler
	}
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>