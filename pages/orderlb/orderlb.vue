<template>
	<view class="contain">
		<view class="order_head_navi">
			<view class="li active">全部</view>
			<view class="li">待付款</view>
			<view class="li">待收货</view>
			<view class="li">已完成</view>
		</view>
		<view class="order_search_cont">
			<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4504ca659b80453ca747baaabba8d106/ico_1.png?Expires=2073875740&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=yYeoocs0saGNdYETNQ9FgrHVaB0%3D" mode="widthFix"></image>
			<input type="text" placeholder="搜索您的订单号">
		</view>
		<view class="order_infor_last">
			<view class="order_title">
				<view class="num">订单号：1231231231</view>
				<view class="time_zt">
					1-08 19:15下单
					<view class="tips">待付款</view>
				</view>
			</view>
			<view class="pro_last">
				<view class="list">
					<view class="pro_i"><image src="@/static/image/index_case1_2.png" mode="widthFix"></image> </view>
					<navigator url="/pages/product-detail/index" class="detail_cont">
						<view class="name">测试商品请勿下单23 褐色</view>
						<view class="bis">褐色</view>
						<view class="price_inf">
							<view class="price"><text>￥</text>0.01 </view>
							<view class="num">×1</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="total_inf">
				<view class="dd">优惠：<text>¥0.01</text> </view>
				<view class="dd">运费：<text>¥16.23</text> </view>
				<view class="dd">共 <text> 1</text> 件商品 应收: <text>¥0.01</text></view>
			</view>
			<view class="deliv_exp">
				<view class="dl">
					<view class="dt">送达时间：</view>
					<view class="dd">预计3月14日送达</view>
				</view>
				<view class="dl">
					<view class="dt">收货地址：</view>
					<view class="dd">
						<text>测试员  165****9999</text>
						<text>北京大兴区北京经济技术开</text>
						<text>*************</text>
					</view>
				</view>
			</view>
			<view class="bit_seet_cont">
				<view class="btn">联系客服</view>
				<view class="btn">检测报告</view>
				<view class="btn sub">提交订单</view>
			</view>
		</view>
		<view class="order_infor_last"  v-for="(item,index) in prolast" :key="item.itemId">
			<view class="order_title">
				<view class="num">订单号：1111</view>
				<view class="time_zt">
					{{ item.createdTime }}下单
					<view class="tips">{{ item.orderStatus }}</view>
				</view>
			</view>
			<view class="pro_last">
				<view  class="list">
					<view class="pro_i"><image src="@/static/image/index_case1_2.png" mode="widthFix"></image> </view>
					<navigator url="/pages/product-detail/index" class="detail_cont">
						<view class="name">测试商品请勿下单23 褐色</view>
						<view class="bis">褐色</view>
						<view class="price_inf">
							<view class="price"><text>￥</text>0.01 </view>
							<view class="num">×1</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="total_inf">
				<view class="dd">优惠：<text>¥0.01</text> </view>
				<view class="dd">运费：<text>¥16.23</text> </view>
				<view class="dd">共 <text> 1</text> 件商品 应收: <text>¥ {{ item.realPayAmount }}</text></view>
			</view>
			<view class="deliv_exp">
				<view class="dl">
					<view class="dt">送达时间：</view>
					<view class="dd">预计3月14日送达</view>
				</view>
				<view class="dl">
					<view class="dt">收货地址：</view>
					<view class="dd">
						<text>测试员  165****9999</text>
						<text>北京大兴区北京经济技术开</text>
						<text>*************</text>
					</view>
				</view>
			</view>
			<view class="bit_seet_cont">
				<view class="btn">联系客服</view>
				<view class="btn">检测报告</view>
				<view class="btn sub">提交订单</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				reportFile:false,
				prolast: [],
				page: 0,
				total: 0,
				records: 0,
				loading: true,
				reportFileShow:false
			}
		},
		onShow(option) {
			var that = this;
			that.proorder();
			
		},
		methods: {
			
			proorder() {
				this.loading = true;
				var that = this;
				let param = {};
				
				that.$http.get('/myorders/query', param, {
				}).then((res) => {
					that.prolast=res || []; 
					// 	console.log(that.prolast)
				})
			
			},
		},
	}
</script>

<style lang="less">
	@import url(/pages/orderlb/orderlb.css);
	
</style>