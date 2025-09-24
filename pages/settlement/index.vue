<template>
	<view class="contain">
		<view class="order_baner">
			<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/d419c2daf131498484ff07beb7e1d06e/banner%20%281%29.png?Expires=2074071887&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=47k6WS%2FO6HxHFI3i%2B%2FsunBvm53k%3D" mode="widthFix"></image>
		</view>
		<navigator url="/pages/address-manage/index" class="order_adres_cont">
			<view class="l_cont">
				<view class="dt"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/448679a90eb74a30b8f4ce9a87ee4f2e/order_ico_1.png?Expires=2073953745&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=bG4RpdbkOM4DCD6QpKH4Hthxq6g%3D" mode="widthFix"></image> </view>
				<view class="dd">
					<view class="add_txt" v-if="!userAddress">添加默认收货地址</view>
					<view class="add_deta" v-else >
						<view class="name"><text>{{ userAddress.receiver }}</text>{{ userAddress.mobile }}</view>
						<view class="tel">{{ userAddress.province }} {{ userAddress.city }} {{ userAddress.district }} {{ userAddress.detail }}</view>
					</view>
				</view>
			</view>
			<image class="arr" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/36862d6137584d809a266fd4eddced20/arr_1.png?Expires=2073953778&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=TVUd0tFwBlx8rj4rZbRwDg%2Fzigg%3D" mode="widthFix"></image>
		</navigator>
		<view class="order_product_contain">
			<view class="title_head">
				<view class="tle">购买商品</view>
				<view v-if="orderId" class="num">订单号 {{ orderId }}</view>
			</view>
			<view class="pro_last">
				<view v-for="product in displayProductList" :key="product.productId" class="pro_list">
					<view class="pro_i"><image :src="product.imgUrl"></image> </view>
					<view class="deta_cont">
						<view class="name">{{ product.title }}</view>
						<view class="specs">{{ product.desc }}</view>
						<view class="num">x{{ product.buyCounts }}</view>
						<view class="price">￥{{ product.totalPrice }}</view>
					</view>
				</view>
			</view>
			<view v-if="shouldShowToggleButton" class="bit_more" @click="toggleExpand">
				{{ toggleButtonText }}
				<image
					class="arr"
					:class="{ 'rotated': isExpanded }"
					src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1c1b0a37f2274686890fdc70f9a7331f/arr_2.png?Expires=2073876560&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=gTx%2F3%2BfjIlY9%2FKTXvmmYbv%2Fq5dE%3D"
					mode="widthFix"
				></image>
			</view>
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
				<view class="dd">￥{{ priceInfo.totalPrice }}</view>
			</view>
			<view class="dl">
				<view class="dt">商品种类</view>
				<view class="dd">x{{ productList.length }}</view>
			</view>
			<view class="dl">
				<view class="dt">商品数量</view>
				<view class="dd">x{{ allCount }}</view>
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
					<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/7bf717a5de2f4d6d96385b79d7208d9c/order_ico_4.png?Expires=2073953856&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=hqNrVt4wn%2FQH1AUGdu2DZVnuxtI%3D" mode="widthFix"></image> </view>
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
					<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f96029eafb244211b53a05a59f376bef/order_ico_5.png?Expires=2073953887&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=LjRrr5ecgpw0kNHxoDxr98iR%2FV4%3D" mode="widthFix"></image> </view>
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
					总价: <text>￥{{ priceInfo.totalPrice }}</text>
				</view>
				<view class="btn">提交订单</view>
			</view>
		</view>
	</view>
</template>

<script>
import { MEMBER_LEVEL } from '@/constants/common.js'

export default {
	data() {
		return {
			baseProductList: [], // 基础商品信息，用于查详细信息
			orderId: null,
			couponList: [],
			productList: [],
			userAddress: null,
			pageOptions: null,
			productIdList: [],
			priceInfo: {},
			isExpanded: false, // 控制商品列表展开/收起状态
			maxShowCount: 2, // 初始最多显示的商品数量
			memberInfo: {},
			MEMBER_LEVEL,
		}
	},
	computed: {
		// 根据展开状态控制显示的商品列表
		displayProductList() {
			if (this.isExpanded || this.productList.length <= this.maxShowCount) {
				return this.productList
			}
			return this.productList.slice(0, this.maxShowCount)
		},
		// 是否需要显示展开/收起按钮
		shouldShowToggleButton() {
			return this.productList.length > this.maxShowCount
		},
		// 展开按钮的文本
		toggleButtonText() {
			if (this.isExpanded) {
				return `收起`
			}
			return `展开(共${this.productList.length}件)`
		},
		allCount() {
			return this.productList.reduce((total, product) => total + product.buyCounts, 0)
		}
	},
	async onLoad(options) {
		console.log('options', Object.prototype.toString.call(options).split(' ')[1].split(']')[0], '===', options);
		this.productIdList = options.productIdList ? options.productIdList.split(',').map((id) => Number(id)) : []
		this.orderId = options.orderId || null
		// 初始化数据
		await this.initPageData();
		// 保存页面参数到data中，供onShow使用
		this.pageOptions = options;
	},
	async onShow() {
		// 页面显示时，如果有保存的参数，重新加载数据
		if (this.pageOptions) {
			console.log('onShow - 使用保存的参数重新加载数据');
			await this.initPageData();
		}
	},
	methods: {
		// 统一的数据初始化方法
		async initPageData() {
			if (this.productIdList && this.productIdList.length > 0) {
				await this.getBaseProductInfo()
				this.getPriceInfo()
			}
			this.getDetail()
			this.getMemberInfo()
		},
		async getMemberInfo() {
			try {
				this.memberInfo = await this.$http.post('/user/member/getUserMember', {})
			} catch (error) {
				this.memberInfo = {}
			}
		},
		async getPriceInfo() {
			try {
				this.priceInfo = await this.$http.post('/shopcart/calculate', {
					checkedProductIdList: this.productIdList
				})
			} catch (error) {
				this.priceInfo = {}
			}
		},
		async getBaseProductInfo() {
			try {
				// 先筛选出购物车内选中的商品信息
				const cartList = await this.$http.post('/shopcart/list', {})
				this.baseProductList = cartList.filter((item) => this.productIdList.includes(Number(item.productId)))
			} catch (error) {
				this.baseProductList = []
			}
		},
		async getDetail() {
			try {
				if (this.orderId) {
					// 订单列表-待付款 进来
				} else if (this.baseProductList.length) {
					// 购物车进来
					const { couponList, productList, userAddress } =await this.$http.post('/order/trade', {
						tradeProductRequestList: this.baseProductList
					})
					this.couponList = couponList
					this.productList = productList
					this.userAddress = userAddress
				}
			} catch (error) {
				
			}
		},
		// 切换展开/收起状态
		toggleExpand() {
			this.isExpanded = !this.isExpanded
		}
	},
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>