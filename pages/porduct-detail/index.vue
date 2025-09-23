<template>
	<view class="warpin">
		<swiper class="detail_baner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item>
				<view class="swiper-item"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/35b6dbbc60d34ad8a8a03a15937aa4f3/detail_baner.png?Expires=2073987305&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=HPTik%2Bvv3K5xRFnUDywF47pdBug%3D" mode="widthFix"></image> </view>
			</swiper-item>
		</swiper>
		<view class="detail_inf_cont">
			<view class="title">新鲜秋葵 300g+15g(1份)</view>
			<view class="price_inf">
				<view class="price">￥29.99</view>
				<view class="dw">/斤/个/份</view>
			</view>
			<view class="allow">
				已售 <text> 120</text> 份  剩余 <text>1000</text> 份
			</view>
		</view>
		<view class="contain">
			<view class="merch_speci_cont">
				<view class="merch_pulic_tle">商品规格</view>
				<view class="tips_dl">
					<view class="dd">300g+15g(份)</view>
				</view>
			</view>
			<view class="merch_detail">
				<view class="merch_pulic_tle">商品详情</view>
				<view class="deta_inf">
					<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/2bfdd90d61d24b0d909cb394cd37f40c/detail_img.png?Expires=2073987347&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=T7vtvOYB4Ok%2FDY0V0bV88QAdtzk%3D" mode="widthFix"></image>
				</view>
			</view>
			<view class="foot_buy_cont">
				<view class="bit_buy_cont">
					<view class="l_cont">
						<view class="buy_num">
							<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f1c89225d7fe4b59b6bd5e23fb6a1fcd/buycar_floor.png?Expires=2073876067&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=4puVWmu8FhXqEHshWItevJABMM8%3D" mode="widthFix"></image>
							<text class="num">23</text>
						</view>
						<view class="xj">￥255</view>
						<view class="yj">￥275</view>
					</view>
					<view class="buy_btn">加入购物车</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	name: 'ProductDetail',
	data() {
		return {
			
		}
	},
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>