<template>
	<view class="contain">
		<view class="coupon_baner">
			<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/5afee24142bf489296f7fef96b518e85/mycoupon_baner.png?Expires=2074059814&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=%2BwNBpwUFlP6ndANdFXM6N8smgx4%3D" mode="widthFix"></image>
		</view>
		<view class="coupon_nav">
			<view class="li active"><text>新人劵</text> </view>
			<view class="li"><text>运费券</text></view>
		</view>
		<CouponList></CouponList>
	</view>
</template>

<script>
import CouponList from '@/components/coupon-list/index.vue'

export default {
	name: 'MyCounpon',
	components: {
		CouponList
	}
}
</script>

<style lang="less">
	@import url(/pages/mycoupon/mycoupon.css);
	
</style>