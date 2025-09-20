<template>
	<view>
		<view class="ifica_search_head">
			<view class="int_cont">
				<image class="i" src="@/static/image/ico_1.png" mode="widthFix"></image>
				<input type="text" placeholder="搜索您的订单号">
			</view>
		</view>
		<view class="ifiac_filter_cont">
			<view class="l_filter_nav">
				<view class="li active">产地水果</view>
				<view class="li">备点直播</view>
				<view class="li" v-for="(item,index) in filnav"  :key="item.Name" :id="item.id" @click="catItemsid(item.id)">{{ item.Name }}11</view>
			
			</view>
			<view class="main_cont">
			<view class="index_pro_contain">
				<image class="pro_head_bg" src="@/static/image/index_case2_bg.png" mode="widthFix"></image>
				<view class="title_head">
					<image class="logo" src="@/static/image/pro_logo.png" mode="widthFix"></image>
					<view class="dt">团购好货</view>
					<view class="txt">三餐四季 尽在知花</view>
				</view>
				<view class="pro_list_cont" v-for="(item,index) in prorow" :key="item.itemId">
					<view class="pro_i">
						<image class="i" :src="item.mainImgUrl" mode="widthFix"></image> 
						<image class="i_over" src="@/static/image/pro_over.png" mode="widthFix"></image> 
					</view>
					<view class="bit_cont">
						<view class="name">{{ item.itemName }}</view>
						<view class="det_txt">
							<!-- 高山种植 | 天然不洗果 | 个别带青苔 | 甜润爽喉 | 新鲜鲜甜 -->
							{{item.ItemAttribute}}
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
							<view class="price">￥<text>{{ item.price}}</text> 
								<view class="dd">/斤/个/份</view> 
							</view>
							<view class="btn_dl">
								<view class="btn btn_ys_1" @click="reportFileShow =! reportFileShow">检测报告</view>
								<view class="btn btn_ys_2">加入购物车</view>
							</view>
						</view>
					</view>
				</view>
				<view class="pro_list_cont">
					<view class="pro_i">
						<image class="i" src="@/static/image/pro_i_1.png" mode="widthFix"></image> 
						<image class="i_over" src="@/static/image/pro_over.png" mode="widthFix"></image> 
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
								<view class="btn btn_ys_1"  @click="reportFileShow =! reportFileShow">检测报告</view>
								<view class="btn btn_ys_2">加入购物车</view>
							</view>
						</view>
					</view>
				</view>
				<view class="pro_list_cont null">
					<view class="pro_i">
						<image class="i" src="@/static/image/pro_i_1.png" mode="widthFix"></image> 
						<image class="i_over" src="@/static/image/pro_over.png" mode="widthFix"></image> 
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
								<view class="btn btn_ys_1">检测报告</view>
								<view class="btn btn_ys_2">加入购物车</view>
							</view>
						</view>
					</view>
				</view>
			</view>
				
			</view>
		</view>
		<view v-if="reportFile"  v-show="reportFileShow" class="test_report_dc">
			<view class="title_head">
				<view class="tle">
					<image class="i" src="@/static/image/ico_3.png" mode="widthFix"></image>
					广西高山粑粑柑
				</view>
				<image class="arr" src="@/static/image/arr_1.png" mode="widthFix"></image>
			</view>
			<view class="report_img">
				<image src="@/static/image/report_i_1.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				reportFile:false,
				prorow: [],
				filnav:[],
				page: 0,
				total: 0,
				records: 0,
				loading: true,
				reportFileShow:false
			}
		},
		onLoad(option) {
			var that = this;
			that.proAll();
			that.filenav()();
		},
		methods: {
			catItemsid(id) {
				this.filenav(id) 
			},
			filenav(id) {
				this.loading = true;
				var that = this;
				let param = {id};
				
				this.$http.get('/index/cats', param, {
				}).then((res) => {
					that.filnav=res; 
				})
			},
			proAll() {
				this.loading = true;
				var that = this;
				let param = {};
				
				this.$http.get('/items/catItems', param, {
				}).then((res) => {
					that.prorow=res.rows || []; 
				})
			},
		},
	}
</script>

<style lang="less">
	@import url(/pages/ifica/ifica.css);
	@import url(/pages/index/prolast.css);
</style>