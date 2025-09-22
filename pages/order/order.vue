<template>
	<view class="contain">
		<view class="order_baner">
			<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/54f5a8bc158e4dcfb6cf4187ab8b3711/order_baner.png?Expires=2073876026&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=lAFR587No%2B7paT%2F4bUr4YNED5zk%3Dimage/order_baner.png" mode="widthFix"></image>
		</view>
		<navigator url="/pages/adres/adres" class="order_adres_cont">
			<view class="l_cont">
				<view class="dt"><image src="@/static/image/order_ico_1.png" mode="widthFix"></image> </view>
				<view class="dd">
					<view class="add_txt" v-if="dlzt">添加收货地址</view>
					<view class="add_deta" v-else >
						<view class="name"><text>铁板鱿鱼</text>12200033322</view>
						<view class="tel">北京  朝阳区  团结湖路17号楼南门502</view>
					</view>
				</view>
			</view>
			<image class="arr" src="@/static/image/arr_1.png" mode="widthFix"></image>
		</navigator>
		<view class="order_product_contain">
			<view class="title_head">
				<view class="tle">社区团购商品</view>
				<view class="num">订单号 86445540021123312</view>
			</view>
			<view class="pro_last">
				<view class="pro_list">
					<view class="pro_i"><image src="@/static/image/order_pro_1.png"></image> </view>
					<view class="deta_cont">
						<view class="name">新鲜小橙子团购</view>
						<view class="specs">规格：约500g/份</view>
						<view class="num">x2</view>
						<view class="price">￥19.90</view>
					</view>
				</view>
				<view class="pro_list">
					<view class="pro_i"><image src="@/static/image/order_pro_1.png"></image> </view>
					<view class="deta_cont">
						<view class="name">新鲜小橙子团购</view>
						<view class="specs">规格：约500g/份</view>
						<view class="num">x2</view>
						<view class="price">￥19.90</view>
					</view>
				</view>
			</view>
			<view class="bit_more">展开(共<text>11</text>件) <image class="arr" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1c1b0a37f2274686890fdc70f9a7331f/arr_2.png?Expires=2073876560&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=gTx%2F3%2BfjIlY9%2FKTXvmmYbv%2Fq5dE%3D" mode="widthFix"></image> </view>
		</view>
		<view class="order_coupon_cont">
			<view class="title_head">
				<view class="dt ">优惠券</view>
				<view class="dd">有2张可用</view>
			</view>
			<view class="det_cont">
				<view class="dl">
					<view class="dt">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/05a860ef9f874ed696e19c3374f7419c/order_ico_2.png?Expires=2073876488&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=5edejPW2awsLyvfjOWNrI8yBClU%3D" mode="widthFix"></image> </view>
						运费券
					</view>
					<view class="dd">
						-￥8.00 
						<checkbox value="yfq" color="#61C55E" borderColor="#A0A0A0" activeBackgroundColor="#61C55E" activeBorderColor="#61C55E"  style="transform:scale(0.7)" />
					</view>
				</view>
				<view class="dl">
					<view class="dt">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/525a98181c884d0e854f14f241cde3d4/order_ico_3.png?Expires=2073876622&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=lJjlb4qD0VewJtyVTV5656JOFo8%3D" mode="widthFix"></image> </view>
						新人专享券
					</view>
					<view class="dd">
						-￥5.00 
						<checkbox value="yfq" color="#61C55E" borderColor="#A0A0A0" activeBackgroundColor="#61C55E" activeBorderColor="#61C55E"  style="transform:scale(0.7)" />
					</view>
				</view>
			</view>
		</view>
		<view class="order_total_cont">
			<view class="tle_total">
				<view class="tle">商品总价</view>
				<view class="dd">￥11.99</view>
			</view>
			<view class="dl">
				<view class="dt">商品种类</view>
				<view class="dd">X1</view>
			</view>
			<view class="dl">
				<view class="dt">商品数量</view>
				<view class="dd">X1</view>
			</view>
			<view class="dl">
				<view class="dt">运费</view>
				<view class="dd">
					<view class="yj">￥8.00</view>
					<view class="xj">￥0.00</view>
				</view>
			</view>
		</view>
		<view class="order_pay_cont">
			<view class="title">支付方式</view>
			<view class="pay_list">
				<view class="l_cont">
					<view class="i"><image src="@/static/image/order_ico_4.png" mode="widthFix"></image> </view>
					<view class="cont">
						<view class="tle">微信支付</view>
					</view>
				</view>
				<view class="r_cont">
					<checkbox :value="wxpay" style="transform:scale(0.7)" />
				</view>
			</view>
			<view class="pay_list">
				<view class="l_cont">
					<view class="i"><image src="@/static/image/order_ico_5.png" mode="widthFix"></image> </view>
					<view class="cont">
						<view class="tle">会员支付</view>
						<view class="txt">当前会员等级：黄金会员</view>
						<view class="txt">账户余额：<text>￥1,250.00</text> </view>
					</view>
				</view>
				<view class="r_cont">
					<view class="charge_btn">充值</view>
					<checkbox :value="hypay" style="transform:scale(0.7)" />
				</view>
			</view>
			<view class="bit_txt">如果您有问题，可以电话联系XXX,我们将高效解决！您还可以在我们未覆盖区域当团长，挣佣金！</view>
		</view>
		<view class="order_foot_cont">
			<view class="cont">
				<view class="l_cont">
					总价: <text>￥29.99</text>
				</view>
				<view class="btn">提交订单</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
				data() {
					return {
						dlzt: true
					}
				}
			}
</script>

<style lang="less">
	@import url(/pages/order/order.css);
	
</style>