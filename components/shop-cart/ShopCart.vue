<template>
  <view>
    <view @click="showCartDetail = !showCartDetail" class="buycar_floor">
			<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f1c89225d7fe4b59b6bd5e23fb6a1fcd/buycar_floor.png?Expires=2073876067&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=4puVWmu8FhXqEHshWItevJABMM8%3D" mode="widthFix"></image>
			<view class="txt">{{ total }}</view>
		</view>
		
		<!-- 遮罩层 -->
		<view v-show="showCartDetail" class="mask" @click="closeCartDetail"></view>
		
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
							<image class="btn plus" @click="item.buyCounts++" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/007b7c6a2307494ab99542b2106ab33a/acout_plus.png?Expires=2073876383&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=JTh8cJynH3CggbgPqexKOe5qsO0%3D" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="total_price_cont">
				<view class="title_head">
					<view class="tle">商品总价</view>
					<view class="total">￥640.5</view>
				</view>
				<view class="dl">
					<view class="dt">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/05a860ef9f874ed696e19c3374f7419c/order_ico_2.png?Expires=2073876488&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=5edejPW2awsLyvfjOWNrI8yBClU%3D" mode="widthFix"></image> </view>
						运费券
					</view>
					<view class="dd">-￥15.6 <image class="arr" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1c1b0a37f2274686890fdc70f9a7331f/arr_2.png?Expires=2073876560&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=gTx%2F3%2BfjIlY9%2FKTXvmmYbv%2Fq5dE%3D" mode="widthFix"></image> </view>
				</view>
				<view class="dl">
					<view class="dt">
						<view class="i"><image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/525a98181c884d0e854f14f241cde3d4/order_ico_3.png?Expires=2073876622&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=lJjlb4qD0VewJtyVTV5656JOFo8%3D" mode="widthFix"></image> </view>
						新人专享券
					</view>
					<view class="dd">-￥5.6 <image class="arr" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1c1b0a37f2274686890fdc70f9a7331f/arr_2.png?Expires=2073876560&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=gTx%2F3%2BfjIlY9%2FKTXvmmYbv%2Fq5dE%3D" mode="widthFix"></image> </view>
				</view>
			</view>
			<view class="bit_buy_cont">
				<view class="l_cont">
					<view class="buy_num">
						<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f1c89225d7fe4b59b6bd5e23fb6a1fcd/buycar_floor.png?Expires=2073876067&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=4puVWmu8FhXqEHshWItevJABMM8%3D" mode="widthFix"></image>
						<text class="num">{{ selectedCount }}</text>
					</view>
					<view class="xj">￥{{ selectedTotalPrice }}</view>
					<view class="yj" v-if="selectedCount > 0">￥{{ (parseFloat(selectedTotalPrice) + 20).toFixed(2) }}</view>
				</view>
				<view class="buy_btn" :class="{ disabled: selectedCount === 0 }">立即购买</view>
			</view>
		</view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        showCartDetail: false,
				cartList: [],
				total: 0
      }
    },
    mounted() {
      this.getCartList()
      // 监听全局刷新事件
      uni.$on('refreshShopCart', this.getCartList)
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
			selectedTotalPrice() {
				return this.cartList
					.filter(item => item.selected)
					.reduce((total, item) => total + (item.price * item.buyCounts), 0)
					.toFixed(2)
			}
		},
    beforeDestroy() {
      // 移除事件监听
      uni.$off('refreshShopCart', this.getCartList)
    },
    methods: {
      closeCartDetail() {
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
      decrease(item) {
				if (item.buyCounts > 1) {
				  item.buyCounts--;
				}
			},
			async clearCart() {
				try {
					await Promise.all(this.cartList.map((item) => this.$http.post('/shopcart/delete', { ...item })))
					uni.showToast({ title: '清除成功' })
					this.getCartList()
				} catch (error) {
					uni.showToast({ title: '清除失败', icon: 'error' })
				}
			},
			toggleSelectAll() {
				const newState = !this.isAllSelected
				this.cartList.forEach(item => {
					this.$set(item, 'selected', newState)
				})
			},
			toggleSelectItem(item) {
				this.$set(item, 'selected', !item.selected)
			}
    },
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>