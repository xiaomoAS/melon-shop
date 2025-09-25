<template>
  <view>
    <view v-if="cartType === CART_TYPE.NORMAL" @click="showCartDetail = !showCartDetail" class="buycar_floor">
			<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f1c89225d7fe4b59b6bd5e23fb6a1fcd/buycar_floor.png?Expires=2073876067&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=4puVWmu8FhXqEHshWItevJABMM8%3D" mode="widthFix"></image>
			<view class="txt">{{ total }}</view>
		</view>

		<view v-else-if="cartType === CART_TYPE.BOTTOM && !showCartDetail" class="bit_buy_cont bottom" @click="showCartDetail = !showCartDetail">
			<view class="l_cont">
				<view class="buy_num">
					<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f1c89225d7fe4b59b6bd5e23fb6a1fcd/buycar_floor.png?Expires=2073876067&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=4puVWmu8FhXqEHshWItevJABMM8%3D" mode="widthFix"></image>
					<text class="num">{{ total }}</text>
				</view>
				<view class="xj">￥{{ priceInfo.realpayPrice || 0  }}</view>
				<view class="yj" v-if="priceInfo.newPersonPrice || priceInfo.shipPrice">￥{{ priceInfo.totalPrice }}</view>
				
				<view v-if="info" class="add-cart-box" @click="addCartHandler">
					<uni-icons class="icon" color="#60C45D" type="cart-filled" size="14"></uni-icons>
					<view>加购</view>
				</view>
			</view>
			<view class="buy_btn" :class="{ disabled: selectedCount === 0 }" @click="settleHandler">立即购买</view>
		</view>
		
		<!-- 遮罩层 -->
		<view v-show="showCartDetail" class="mask" @click="closeShopCart"></view>
		
		<view v-show="showCartDetail" class="join_cart_cont">
			<view class="deta_header">
				<view class="l_cont">
						<label class="sele_rad">
							<view class="ring" :class="{ active: isAllSelected }">
								<checkbox :checked="isAllSelected" @click="toggleSelectAll"></checkbox>
							</view>
							<text>全选</text>
						</label>
						<view class="det_all">（共{{ total }}件商品，已选{{ selectedCount }}件）</view>
					</view>
				<view class="del_all" @click="clearCart"><image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/fe8f46b9761d4e7e8a57bec3f4e49200/ico_2.png?Expires=2073876106&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=ebfmzCkkDbDP7O2pjeFhK8pSobI%3D" mode="widthFix"></image>清空购物车</view>
			</view>
			<view v-for="item in cartList" :key="item.productId" class="pro_list">
				<label class="sele_rad">
					<view class="ring" :class="{ active: item.selected }">
					  <checkbox :checked="item.selected" @click="toggleSelectItem(item)"></checkbox>
					</view>
				</label>
				<view class="pro_detail_cont">
					<view class="pro_i"><image :src="item.imgUrl" mode=""></image> </view>
					<view class="detail_inf">
						<view class="title">{{ item.title }}</view>
						<view class="bits">￥{{ item.price }}/{{ item.specName }}</view>
						<view class="count_cont">
							<image class="btn less" :class="{disabled: item.buyCounts <= 1}" @click="decrease(item)" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/debd0e25572e47af91bba4464c516404/acout_less.png?Expires=2073876207&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=M6WnCyRZy%2BzvT4P48LUAkRFZt%2FU%3D"  mode="widthFix"></image>
							<text class="int">{{ item.buyCounts }}</text>
							<image class="btn plus" @click="increase(item)" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/007b7c6a2307494ab99542b2106ab33a/acout_plus.png?Expires=2073876383&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=JTh8cJynH3CggbgPqexKOe5qsO0%3D" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="total_price_cont">
				<view class="title_head">
					<view class="tle">选中商品总价</view>
					<view class="total">￥{{ priceInfo.totalPrice || 0 }}（运费：{{ priceInfo.shipTotalPrice || 0 }}）</view>
				</view>
				<view v-if="priceInfo.shipPrice" class="dl">
					<view class="dt">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/05a860ef9f874ed696e19c3374f7419c/order_ico_2.png?Expires=2073876488&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=5edejPW2awsLyvfjOWNrI8yBClU%3D" mode="widthFix"></image> </view>
						运费券
					</view>
					<view class="dd">-￥{{ priceInfo.shipPrice }}</view>
				</view>
				<view v-if="priceInfo.newPersonPrice" class="dl">
					<view class="dt">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/525a98181c884d0e854f14f241cde3d4/order_ico_3.png?Expires=2073876622&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=lJjlb4qD0VewJtyVTV5656JOFo8%3D" mode="widthFix"></image> </view>
						新人专享券
					</view>
					<view class="dd">-￥{{ priceInfo.newPersonPrice }}</view>
				</view>
			</view>
			<view class="bit_buy_cont">
				<view class="l_cont">
					<view class="buy_num">
						<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f1c89225d7fe4b59b6bd5e23fb6a1fcd/buycar_floor.png?Expires=2073876067&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=4puVWmu8FhXqEHshWItevJABMM8%3D" mode="widthFix"></image>
						<text class="num">{{ total }}</text>
					</view>
					<view class="xj">￥{{ priceInfo.realpayPrice || 0 }}</view>
					<view class="yj" v-if="priceInfo.newPersonPrice || priceInfo.shipPrice">￥{{ priceInfo.totalPrice }}</view>

					<view v-if="info" class="add-cart-box" @click="addCartHandler">
						<uni-icons class="icon" color="#60C45D" type="cart-filled" size="14"></uni-icons>
						<view>加购</view>
					</view>
				</view>
				<view class="buy_btn" :class="{ disabled: selectedCount === 0 }" @click="settleHandler">立即购买</view>
			</view>
		</view>
  </view>
</template>

<script>
import { CART_TYPE } from './constants'
export default {
	name: 'ShopCart',
  data() {
    return {
      showCartDetail: false,
			cartList: [],
			total: 0,
			priceInfo: {},
			CART_TYPE
    }
  },
  mounted() {
    this.getCartList()
    // 监听全局刷新事件
    uni.$on('refreshShopCart', this.refreshShopCart)
    uni.$on('closeShopCart', this.closeShopCart)
  },
	props: {
		cartType: {
			type: Number,
			default: CART_TYPE.NORMAL
		},
		// 商品信息
		info: {
			type: Object,
			default: null,
			required: false,
		}
	},
	computed: {
		selectList() {
			return this.cartList.filter((item) => item.selected)
		},
		isAllSelected() {
			return this.cartList.length > 0 && this.cartList.every(item => item.selected)
		},
		selectedCount() {
			return this.cartList.filter(item => item.selected).length
		},
	},
  beforeDestroy() {
    // 移除事件监听
    uni.$off('refreshShopCart', this.refreshShopCart)
    uni.$off('closeShopCart', this.closeShopCart)
  },
  methods: {
		async refreshShopCart() {
			await this.getCartList()
			this.updatePrice()
		},
		async addCartHandler() {
			try {
				if (!this.info) return
				await this.$http.post('/shopcart/add', { ...this.info })
				uni.showToast({ title: '添加成功' })
				uni.$emit('refreshShopCart')
			} catch (error) {
				uni.showToast({ title: '添加失败', icon: 'none' })
			}
		},
		settleHandler() {
			const selectProductList = this.selectList.map(item => item.productId)
			uni.navigateTo({ url: `/pages/settlement/index?productIdList=${selectProductList}` })
		},
    closeShopCart() {
      this.showCartDetail = false
    },
    async getCartList() {
      try {
        this.cartList = await this.$http.post('/shopcart/list', {}) || []
				this.cartList = this.cartList.map(item => ({
					...item,
					selected: false // 默认不选中
				}))
				this.total = this.cartList ? this.cartList.length : 0
			} catch (error) {
				this.cartList = []
				this.total = 0
      }
    },
		async updatePrice() {
			try {
				const selectProductList = this.selectList.map(item => item.productId)
				if (!selectProductList.length) {
					this.priceInfo = {}
					return
				}
				this.priceInfo = await this.$http.post('/shopcart/calculate', { checkedProductIdList: selectProductList || [] })
			} catch (error) {
				this.priceInfo = {}
			}
		},
    async decrease(item) {
			if (item.buyCounts <= 1) return
			try {
			  item.buyCounts--
				await this.$http.post('/shopcart/delete', { ...item })
				if (item.selected) {
					this.updatePrice()
				}
			} catch (error) {
				uni.showToast({ title: '减少失败', icon: 'none' })
			}
		},
		async increase(item) {
			item.buyCounts++
			try {
				await this.$http.post('/shopcart/add', { ...item })
				if (item.selected) {
					this.updatePrice()
				}
			} catch (error) {
				uni.showToast({ title: '添加失败', icon: 'none' })
			}
		},
		async clearCart() {
			try {
				await this.$http.post('/shopcart/delete', { clear: true })
				uni.showToast({ title: '清除成功' })
				this.getCartList()
			} catch (error) {
				uni.showToast({ title: '清除失败', icon: 'none' })
			}
		},
		toggleSelectAll() {
			const newState = !this.isAllSelected
			this.cartList.forEach(item => {
				this.$set(item, 'selected', newState)
			})
			this.updatePrice()
		},
		toggleSelectItem(item) {
			this.$set(item, 'selected', !item.selected)
			this.updatePrice()
		}
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>