<template>
	<view class="contain">
		<view class="coupon_baner">
			<image src="@/static/image/mycoupon_baner.png" mode="widthFix"></image>
		</view>
		<view class="coupon_nav">
			<view class="li active"><text>新人劵</text> </view>
			<view class="li"><text>运费券</text></view>
		</view>
		<coupon-list ref="Couponlast"></coupon-list>
	</view>
</template>

<script>
</script>

<style lang="less">
	@import url(/pages/mycoupon/mycoupon.css);
	
</style>