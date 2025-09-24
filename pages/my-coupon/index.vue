<template>
	<view class="contain">
		<view class="coupon_baner">
			<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/42bed1e64df34a5bae49856265907066/carousel-1.png?Expires=2073865388&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=wibX0MJ%2By7WmGBHvAoaHXBrkaEE%3D" mode="widthFix"></image>
		</view>
		<view class="coupon_nav">
			<view
				class="li"
				:class="{ active: activeTab === COUPON_TYPE.NEW_DISCOUNT }"
				@click="switchTab(COUPON_TYPE.NEW_DISCOUNT)"
			>
				<text>新人劵</text>
			</view>
			<view
				class="li"
				:class="{ active: activeTab === COUPON_TYPE.FREIGHT }"
				@click="switchTab(COUPON_TYPE.FREIGHT)"
			>
				<text>运费券</text>
			</view>
		</view>
		<CouponList :coupon-type="activeTab"></CouponList>
	</view>
</template>

<script>
import CouponList from '@/components/coupon-list/index.vue'
import { COUPON_TYPE } from '@/components/coupon-list/constants.js'


export default {
	name: 'MyCounpon',
	components: {
		CouponList
	},
	data() {
		return {
			activeTab: COUPON_TYPE.NEW_DISCOUNT, // 当前激活的tab，默认为新人专享券
			tabList: [
				{ name: '新人劵', value: COUPON_TYPE.NEW_DISCOUNT },
				{ name: '运费券', value: COUPON_TYPE.FREIGHT }
			],
			COUPON_TYPE
		}
	},
	methods: {
		// 切换tab
		switchTab(type) {
			this.activeTab = type;
			// 可以在这里添加切换tab时的其他逻辑，比如重新加载数据
			const tabName = this.tabList.find(tab => tab.value === type)?.name;
			console.log('切换到tab:', tabName, 'type:', type);
		}
	}
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>