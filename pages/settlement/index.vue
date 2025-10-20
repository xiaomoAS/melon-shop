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
						<view class="price">￥{{ product.price }}</view>
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
				<view class="dt">优惠券</view>
				<view class="dd">有{{ couponList.length }}张可用</view>
			</view>
			<view v-if="couponList.length" class="det_cont">
				<view v-for="(coupon, couponIndex) in couponList" :key="coupon.couponId" class="dl">
					<view v-if="COUPON_TYPE.FREIGHT === coupon.coupon.type" class="dt">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/05a860ef9f874ed696e19c3374f7419c/order_ico_2.png?Expires=2073876488&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=5edejPW2awsLyvfjOWNrI8yBClU%3D" mode="widthFix"></image> </view>
						包邮券
					</view>
					<view v-else-if="COUPON_TYPE.NEW_DISCOUNT === coupon.coupon.type" class="dt">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/525a98181c884d0e854f14f241cde3d4/order_ico_3.png?Expires=2073876622&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=lJjlb4qD0VewJtyVTV5656JOFo8%3D" mode="widthFix"></image> </view>
						专享券
					</view>
					<view  class="dd">
						<view v-if="coupon.coupon">-￥{{ COUPON_TYPE.NEW_DISCOUNT === coupon.coupon.type ? coupon.coupon.newPersonPrice || 0 : coupon.coupon.waybillPriceLimit || 0 }}</view>
						<!-- 订单跳转结算情况不能重新选择优惠券 -->
						<checkbox v-show="!this.orderId" :checked="coupon.selected" color="#61C55E" borderColor="#A0A0A0" activeBackgroundColor="#61C55E" activeBorderColor="#61C55E"  style="transform:scale(0.7)" @click="couponSelectChange(coupon, couponIndex)"/>
					</view>
				</view>
			</view>
			<view v-else class="no-coupon-tip">
				<view>您当前的优惠券用完啦</view>
				<view>关注<text class="button-text" @click="openOfficial">瓜田里一只猹</text>，每天都有券领取哟～</view>
			</view>
		</view>
		<view class="order_total_cont">
			<view class="tle_total">
				<view class="tle">商品价格明细</view>
			</view>
			<view class="dl">
				<view class="dt strong">商品总价(含运费)</view>
				<view class="dd">
					<view v-if="newCouponSelect || freightCouponSelect" class="dd">
						<view class="yj">￥{{ priceInfo.totalPrice || 0 }}</view>
						<view class="xj">￥{{ realTotalPrice || 0 }}</view>
					</view>
					<view v-else class="dd">
						<view class="xj">￥{{ priceInfo.totalPrice || 0 }}</view>
					</view>
				</view>
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
				<view class="dt">仅商品总价</view>
				<view class="dd">
					<view v-if="newCouponSelect" class="dd">
						<view class="yj">￥{{ goodsPrice || 0 }}</view>
						<view class="xj">￥{{ realGoodsPrice || 0 }}</view>
					</view>
					<view v-else class="dd">
						<view class="xj">￥{{ goodsPrice || 0 }}</view>
					</view>
				</view>
			</view>
			<view class="dl">
				<view class="dt">运费</view>
				<view v-if="userAddress">
					<!-- 运费有优惠的样式 -->
					<view v-if="freightCouponSelect" class="dd">
						<view class="yj">￥{{ priceInfo.shipTotalPrice || 0 }}</view>
						<view class="xj">￥{{ realFreightPrice || 0 }}</view>
					</view>
					<view v-else class="dd">
						<view class="xj">￥{{ priceInfo.shipTotalPrice || 0 }}</view>
					</view>
				</view>
				<view v-else class="dd">选择默认收货地址后查看</view>
			</view>
		</view>
		<view class="order_pay_cont">
			<view class="title">支付方式</view>
			<radio-group>
				<view class="pay_list" @click="payMethodChange(PAY_METHOD.WE_CHAT)">
					<view class="l_cont">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/7bf717a5de2f4d6d96385b79d7208d9c/order_ico_4.png?Expires=2073953856&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=hqNrVt4wn%2FQH1AUGdu2DZVnuxtI%3D" mode="widthFix"></image> </view>
						<view class="cont">
							<view class="tle">微信支付</view>
						</view>
					</view>
					<view class="r_cont">
						<radio :value="PAY_METHOD.WE_CHAT" :checked="payMethod === PAY_METHOD.WE_CHAT" class="pay-radio" />
					</view>
				</view>
				<view class="pay_list" @click="payMethodChange(PAY_METHOD.MEMBER_CARD)">
					<view class="l_cont">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f96029eafb244211b53a05a59f376bef/order_ico_5.png?Expires=2073953887&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=LjRrr5ecgpw0kNHxoDxr98iR%2FV4%3D" mode="widthFix"></image> </view>
						<view class="cont">
							<view class="tle">会员支付</view>
							<view v-if="memberInfo.level" class="txt">当前会员等级：{{ MEMBER_LEVEL_NAME[memberInfo.level] }}</view>
							<view v-if="memberInfo.discount" class="txt">折扣：{{ memberInfo.discount * 10 }}折</view>
							<view class="txt">账户余额：<text>￥{{ memberInfo.remainPrice || 0.00 }}</text> </view>
						</view>
					</view>
					<view class="r_cont">
						<view class="charge_btn" @click.stop="chargeHandler">充值</view>
						<radio :value="PAY_METHOD.MEMBER_CARD" class="pay-radio" :checked="payMethod === PAY_METHOD.MEMBER_CARD"/>
					</view>
				</view>
			</radio-group>
			
			<view class="bit_txt">如果您有问题，可以电话联系<text class="phone-text" @click="phoneHandler">18612655137</text>,我们将高效解决！</view>
		</view>
		<view class="order_foot_cont">
			<view class="cont">
				<view class="l_cont">
					总价: <text>￥{{ realTotalPrice }}</text>
				</view>
				<button class="btn" :disabled="payLoading" @click="submitHandler">提交订单</button>
			</view>
		</view>

		<Recharge ref="rechargeRef" @success="getMemberInfo"></Recharge>
	</view>
</template>

<script>
import { MEMBER_LEVEL, MEMBER_LEVEL_NAME, PAY_METHOD, SOURCE, PAY_STATUS } from '@/constants/common.js'
import { COUPON_TYPE } from '@/components/coupon-list/constants.js'
import { ORDER_STATUS } from '@/pages/order-list/constants.js'
import Recharge from '@/components/recharge/index.vue'
import { resourceHrefHandler } from '@/utils/common'

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
			payMethod: PAY_METHOD.WE_CHAT,
			isExpanded: false, // 控制商品列表展开/收起状态
			maxShowCount: 2, // 初始最多显示的商品数量
			memberInfo: {},
			MEMBER_LEVEL,
			MEMBER_LEVEL_NAME,
			COUPON_TYPE,
			PAY_METHOD,
			payLoading: false,
			resourceInfo: {
				url: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/d419c2daf131498484ff07beb7e1d06e/banner%20%281%29.png?Expires=2074071887&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=47k6WS%2FO6HxHFI3i%2B%2FsunBvm53k%3D', // 资源地址
			}
		}
	},
	components: {
		Recharge
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
		},
		// 仅商品价格
		goodsPrice() {
			const price = Number(this.priceInfo.totalPrice || 0) - Number(this.priceInfo.shipTotalPrice || 0)
			return Math.round(price * 100) / 100
		},
		// 商品扣减专享券的价格
		realGoodsPrice() {
			// 优惠券金额>现有金额 = 0.01
			const price = this.priceInfo.newPersonPrice >= this.goodsPrice ? 0.01 : this.goodsPrice - this.priceInfo.newPersonPrice
			return Math.round(price * 100) / 100
		},
		// 运费减去包邮券金额
		realFreightPrice() {
			// 优惠券金额>现有金额 = 0
			const price = this.priceInfo.waybillPriceLimit >= this.priceInfo.shipTotalPrice ? 0 : this.priceInfo.shipTotalPrice - this.priceInfo.waybillPriceLimit
			return Math.round(price * 100) / 100
		},
		// 实际总价
		realTotalPrice() {
			if (!this.priceInfo.totalPrice) return 0
			let total = 0
			// 运费价格
			if (this.freightCouponSelect) {
				total += (this.realFreightPrice || 0)
			} else {
				total += (this.priceInfo.shipTotalPrice || 0)
			}
			// 商品价格
			if (this.newCouponSelect) {
				total += (this.realGoodsPrice || 0)
			} else {
				total += (this.goodsPrice || 0)
			}
			// 选择会员充值卡，会员折扣
			if (this.payMethod === PAY_METHOD.MEMBER_CARD && this.memberInfo.level !== MEMBER_LEVEL.NORMAL) {
				const discount = (this.memberInfo.discount || 1)
				total *= discount
			}
			return Math.round(total * 100) / 100
		},
		// 包邮券是否选中
		freightCouponSelect() {
			const coupon = this.couponList.find((coupon) => COUPON_TYPE.FREIGHT === coupon.coupon.type)
			if (!coupon) return false
			return coupon.selected
		},
		// 专享券是否选中
		newCouponSelect() {
			const coupon = this.couponList.find((coupon) => COUPON_TYPE.NEW_DISCOUNT === coupon.coupon.type)
			if (!coupon) return false
			return coupon.selected
		},
	},
	async onLoad(options) {
		this.productIdList = options.productIdList ? options.productIdList.split(',').map((id) => Number(id)) : []
		this.orderId = options.orderId || null
		this.getTopImg()
		// 初始化数据
		await this.initPageData();
		// 保存页面参数到data中，供onShow使用
		this.pageOptions = options;
	},
	async onShow() {
		this.payLoading = false
		// 页面显示时，如果有保存的参数，重新加载数据
		if (this.pageOptions) {
			console.log('onShow - 使用保存的参数重新加载数据');
			await this.initPageData();
		}
	},
	methods: {
		openOfficial() {
			wx.openOfficialAccountProfile({
				username: 'gh_f67e74cdaf08',
				success(res) {
					// 调用成功的回调函数
					console.log('打开成功', res);
				},
				fail(err) {
					// 调用失败的回调函数
					console.log('打开失败', err);
				}
			})
		},
		async getTopImg() {
			try {
				this.resourceInfo = await this.$http.post('/resource/get', { id: 7 })
			} catch (error) {
				this.resourceInfo.url = 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/d419c2daf131498484ff07beb7e1d06e/banner%20%281%29.png?Expires=2074071887&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=47k6WS%2FO6HxHFI3i%2B%2FsunBvm53k%3D'
			}
		},
		phoneHandler() {
			wx.makePhoneCall({
				phoneNumber: '18612655137',
				success(res) {
					console.log('拨打电话成功', res);
				},
				fail(err) {
					console.error('拨打电话失败', err);
				}
			});
		},
		couponSelectChange(coupon, couponIndex) {
			this.$set(this.couponList[couponIndex], 'selected', !coupon.selected)
		},
		chargeHandler() {
			console.log(this.$refs.rechargeRef)
			this.$refs.rechargeRef.open()
		},
		// 统一的数据初始化方法
		async initPageData() {
			if (this.productIdList && this.productIdList.length > 0) {
				await this.getBaseProductInfo()
			}
			await this.getDetail()
			this.getPriceInfo(this.productIdList.length ? this.productIdList : this.productList.map((item) => item.productId))
			this.getMemberInfo()
		},
		payMethodChange(val) {
			this.payMethod = Number(val)
		},
		async getMemberInfo() {
			try {
				this.memberInfo = await this.$http.post('/user/member/getUserMember', {})
			} catch (error) {
				this.memberInfo = {}
			}
		},
		async getPriceInfo(list) {
			try {
				if(!list || !list.length) return
				this.priceInfo = await this.$http.post('/shopcart/calculate', {
					checkedProductIdList: list,
					orderId: this.orderId
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
					const { couponList = [], productList = [], userAddress } = await this.$http.post('/order/secondPay', { orderId: this.orderId })
					this.couponList = couponList.map((item) => ({ ...item, selected: true }))
					this.productList = productList
					this.userAddress = userAddress
				} else if (this.baseProductList.length) {
					// 购物车进来
					const { couponList = [], productList = [], userAddress } = await this.$http.post('/order/trade', {
						tradeProductRequestList: this.baseProductList
					})
					this.couponList = couponList.map((item) => ({ ...item, selected: true }))
					this.productList = productList
					this.userAddress = userAddress
				}
			} catch (error) {
				this.couponList = []
				this.productList = []
				this.userAddress = null
			}
		},
		async submitHandler() {
			try {
				if (!this.userAddress) {
					uni.showToast({ title: '请先选择默认收货地址', icon: 'none' })
					return
				}
				this.payLoading = true
				const param = {
					orderId: this.orderId ? Number(this.orderId) : undefined,
					requestSource: this.orderId ? undefined : SOURCE.CART, // 仅购物车结算传
					productList: this.productList.map((item) => ({
						productId: item.productId,
						specId: item.specId,
						buyCounts: item.buyCounts
					})),
					addressId: this.userAddress.id,
					payMethod: this.payMethod,
					couponIdList: this.couponList.filter((item) => item.selected).map((item) => item.couponId)
				}
				const data = await this.$http.post('/order/create', param)
				let that = this
				// 微信支付
				if (this.payMethod === PAY_METHOD.WE_CHAT) {
					wx.requestPayment
					(
					  {
					    timeStamp: data.timestamp,
					    nonceStr: data.nonceStr,
					    package: data.packageStr,
					    signType: data.signType,
					    paySign: data.paySign,
					    success:function(res){
							console.log('成功', res)
							let startTime = Date.now()
							const intervalId = setInterval(async () => {
							    try {
							        const res = await that.$http.post('/order/queryWechatPay', { orderId: data.orderId })
							        // 支付成功
							        if (res.orderStatus === PAY_STATUS.SUCCESS) {
										uni.showToast({ title: '支付成功' , icon: 'none'})
										wx.setStorageSync('orderTab', ORDER_STATUS.WAIT_SEND)
							            clearInterval(intervalId) // 清除定时器
										// 等待显示提示
										const timer = setTimeout(() => {
											uni.switchTab({ url: '/pages/order-list/index' })
											clearTimeout(timer)
										}, 500);
							            return
							        }
							        if (Date.now() - startTime >= 10000) {
										uni.showToast({ title: '支付超时' , icon: 'none'})
										wx.setStorageSync('orderTab', ORDER_STATUS.WAIT_PAY)
							            clearInterval(intervalId) // 超过10秒也停止轮询
										// 等待显示提示
										const timer = setTimeout(() => {
											uni.switchTab({ url: '/pages/order-list/index' })
											clearTimeout(timer)
										}, 500);
							        }
							    } catch (error) {
							        uni.showToast({ title: '支付失败' , icon: 'none'})
							        wx.setStorageSync('orderTab', ORDER_STATUS.WAIT_PAY)
							        clearInterval(intervalId) // 出错也停止轮询
									// 等待显示提示
									const timer = setTimeout(() => {
										uni.switchTab({ url: '/pages/order-list/index' })
										clearTimeout(timer)
									}, 500);
							    }
							}, 1000); // 例如每1秒轮询一次
						},
					    fail:function(res){
							console.log('失败', res)
							uni.showToast({ title: '支付失败' , icon: 'none'})
							wx.setStorageSync('orderTab', ORDER_STATUS.WAIT_PAY)
							// 等待显示提示
							const timer = setTimeout(() => {
								uni.switchTab({ url: '/pages/order-list/index' })
								clearTimeout(timer)
							}, 500);
						},
					    complete:function(res){
							console.log('完成', res)
						}
					  }
					)
				} else if (this.payMethod === PAY_METHOD.MEMBER_CARD) {
					// 充值卡支付
					if (data.paySuccess) {
						uni.showToast({ title: '支付成功' , icon: 'none'})
						wx.setStorageSync('orderTab', ORDER_STATUS.WAIT_SEND)
					} else {
						uni.showToast({ title: '支付失败' , icon: 'none'})
						wx.setStorageSync('orderTab', ORDER_STATUS.WAIT_PAY)
					}
					// 等待显示提示
					const timer = setTimeout(() => {
						uni.switchTab({ url: '/pages/order-list/index' })
						clearTimeout(timer)
					}, 500);
				}
			} catch (error) {
				this.payLoading = false
				console.log(error)
			}
		},
		// 切换展开/收起状态
		toggleExpand() {
			this.isExpanded = !this.isExpanded
		}
	},
	resourceHrefHandler
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>