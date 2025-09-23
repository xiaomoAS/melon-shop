<template>
	<view class="recharge_dc_cont">
		<view class="title_head">
			<view class="tle">充值</view>
			<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/faa8c3d608534f69a2227fc1f0a10499/shut.png?Expires=2073952640&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=POlfdah9P7RWWSP088to3pQmnYU%3D" mode="widthFix" class="shut"></image>
		</view>
		<view class="user_inf_cont">
			<view class="user_inf_head">
				<view class="ava"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1f25a32b4b97447bac8d02f20f0a47b6/user_ava.png?Expires=2073952610&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=IQflZdBMbA4jh2W7oui1vmaxPuU%3D" mode=""></image> </view>
				<view class="inf_cont">
					<view class="name">陌上云霄</view>
					<view class="id">ID:156345</view>
				</view>
			</view>
			<view class="member_bit_inf">
				<view class="lv">当前身份: <image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/08edab9a7aad4ef4b307decc8c79b142/user_vip_1.png?Expires=2073952663&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=xvttI12WxPBmYJFi3BKOIhABmqM%3D" mode="widthFix"></image> 铂金会员 </view>
				<view class="balance">会员余额: <text>123元</text> </view>
			</view>
		</view>
		<view class="member_last_cont">
			<view class="list active">
				<view class="tle">XX会员</view>
				<view class="price">￥ <text>3000</text> </view>
				<view class="bits">享9.5折</view>
			</view>
			<view class="list">
				<view class="tle">XX会员</view>
				<view class="price">￥ <text>8000</text> </view>
				<view class="bits">享9.5折</view>
			</view>
			<view class="list">
				<view class="tle">XX会员</view>
				<view class="price">￥ <text>10000</text> </view>
				<view class="bits">享9.5折</view>
			</view>
		</view>
		<view class="tips_guide">
			<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/fceacd3e07054b23873f4f029b722a72/user_i_4.png?Expires=2073952707&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=HQcc%2FtHavToEV10a%2Bap2RViqVBo%3D" mode="widthFix"></image> 
			会员免费送货上门
		</view>
		<view class="recharge_int_cont">
			<view class="title">充值金额</view>
			<view class="int_cont">
				<view class="dt">￥</view>
				<input type="text" placeholder="请输入充值金额">
			</view>
		</view>
		<view class="recharge_btn">立即充值</view>
	</view>
</template>

<script>
	export default {
		
	}
</script>

<style lang="less" scoped>
	@import url(/components/Recharge/Recharge.css);
	
</style>