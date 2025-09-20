<template>
	<view class="contain">
		<view class="adres_detail_cont">
			<view class="dl">
				<view class="dt"><text>*</text>收货人</view>
				<view class="dd"><input type="text" placeholder="请填写收货人"> </view>
			</view>
			<view class="dl">
				<view class="dt"><text>*</text>电话</view>
				<view class="dd"><input type="text" placeholder="请填写联系电话"> </view>
			</view>
			<view class="dl">
				<picker @change="bindPickerChange">
					<view class="uni-input">地区选择 <image class="arr" src="@/static/image/adres_arr.png" mode="widthFix"></image> </view>
				</picker>
			</view>
			<textarea class="deta_inf" name="" id="" placeholder="街道、小区门牌等详细信息"></textarea>
		</view>
		<view class="adres_default_seet">
			<view class="tle">设置为默认地址</view>
			<switch checked="true" @change="" />
		</view>
	</view>
</template>

<script>
</script>

<style lang="less">
	@import url(/pages/adresxz/adresxz.css);
</style>