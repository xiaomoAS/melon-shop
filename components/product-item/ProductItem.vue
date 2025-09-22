<template>
	<view class="pro_list_cont">
		<view class="pro_i">
			<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/ca9ad615ebb2406c8c43d0a88a7c1726/pro_i_1.png?Expires=2073876674&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=kTdBclTZdy3VJykCaO8LpJPdcEU%3D" mode="widthFix"></image> 
			<image class="i_over" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/6fe849515c0a4aec8c00118a90480a67/pro_over.png?Expires=2073876962&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=OruFFlkcGDyUcpsNLbKRtVpdNWo%3D" mode="widthFix"></image> 
		</view>
		<view class="bit_cont">
			<view class="name">广西高山沃柑超甜多水（中型果）</view>
			<view class="det_txt">
				高山种植 | 天然不洗果 | 个别带青苔 | 甜润爽喉 | 新鲜鲜甜
			</view>
			<view class="bit_deta">
				<view class="tips_dl">
					<view class="dd bg_1">送货上门</view>
					<view class="dd bg_2">免费包邮</view>
					<view class="dd bg_3">无公害果蔬</view>
				</view>
				<view class="ys_time">
					<view class="dt">预售期</view>
					<view class="dd">6月28日</view>
				</view>
			</view>
			<view class="bit_seet">
				<view class="price">￥<text>29.99</text> 
					<view class="dd">/斤/个/份</view> 
				</view>
				<view class="btn_dl">
					<view class="btn btn_ys_1" @click="reportFileShow =! reportFileShow">检测报告</view>
					<view class="btn btn_ys_2">加入购物车</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	
	const props = withDefaults(defineProps(), {
		info: () => ({})
	})
	
	console.log(props, 'props')
</script>

<style lang="scss">
@import './index.scss';  	       
</style>
