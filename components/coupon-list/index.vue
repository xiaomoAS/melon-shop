<template>
	<view class="coupon-box">
		<view v-for="item in couponList" :key="item.couponId" class="coupon_list">
			<view v-if="item.coupon.expiredFlag" class="expired-box">
				<image class="expired-icon" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/a0503115a7514426a3ab9963a7e2564c/expired-icon.png?Expires=2078190589&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=LdThYZ8dAKu%2Bi%2FUXNfqPVDAGH5c%3D" mode="widthFix"></image>
			</view>
			<view class="coupon_name">{{ getCouponShortName(item) }}</view>
			<view class="coupon_deta">
				<view class="tle">{{ item.coupon.name }}</view>
				<view class="time">{{ formatExpireTime(item.coupon.endTime) }}</view>
				<view class="txt">{{ getCouponDesc(item) }}</view>
			</view>
			<view class="play_cont">
				<view class="txt">1张</view>
				<view class="btn" @click="couponClick(item)">{{ item.useStatus === USE_COUPON_STATUS.WAIT_SEND ? '去赠送' : '去使用' }}</view>
			</view>
		</view>
		<view v-if="!couponList.length" class="no-coupon-tip" :class="{ 'my-coupon': couponType }">
			<view>您当前的优惠券用完啦</view>
			<view>关注<text class="button-text" @click="openOfficial">钰果日记</text>，每天都有券领取哟～</view>
		</view>

		<LoadMore 
			v-if="couponList.length && !noMoreData"
			@visible="loadMoreData" 
			:threshold="50"
			:once="false"
		>
			<view class="custom-load-more">
				<span>上拉加载更多</span>
			</view>
		</LoadMore>

		<GiftPopup ref="giftPopup" />
	</view>
	
</template>

<script>
import { COUPON_TYPE, USE_COUPON_STATUS } from './constants'
import LoadMore from '@/components/load-more/index.vue'
import GiftPopup from './components/gift-popup/index.vue'

export default {
	name: 'CouponList',
	components: {
		LoadMore,
		GiftPopup
	},
	props: {
		couponType: {
			type: Number,
			default: undefined,
			required: false
		},
		expiredType: {
			type: Number,
			default: undefined,
			required: false
		}
	},
	data() {
		return {
			COUPON_TYPE,
			USE_COUPON_STATUS,
			couponList: [],
			page: 1,
			pageSize: 5,
			totalCount: 0
		}
	},
	computed: {
		noMoreData() {
			return this.page * this.pageSize >= this.totalCount
		},
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
		// 格式化到期时间的函数
		formatExpireTime(timestamp) {
			if (!timestamp) return ''
			
			const expireDate = new Date(timestamp)
			const today = new Date()
			
			// 重置时间为当天的开始时间进行比较
			const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
			const expireDateStart = new Date(expireDate.getFullYear(), expireDate.getMonth(), expireDate.getDate())
			
			const hours = String(expireDate.getHours()).padStart(2, '0')
			const minutes = String(expireDate.getMinutes()).padStart(2, '0')
			
			if (todayStart.getTime() === expireDateStart.getTime()) {
			// 如果是今天
				return `今日${hours}:${minutes}到期`
			} else {
				// 如果不是今天
				const month = expireDate.getMonth() + 1
				const day = expireDate.getDate()
				return `${month}月${day}日${hours}:${minutes}到期`
			}
		},
		getCouponDesc(item) {
			if (!item.coupon) return ''
			if (item.coupon.type === COUPON_TYPE.FREIGHT) return '特定品类包邮券'
			return '用户特定品类体验券'
		},
		getCouponShortName(item) {
			if (!item.coupon) return ''
			if (item.coupon.type === COUPON_TYPE.FREIGHT) return '包邮券'
			return '优惠券'
		},
		async getCouponList(clear = false) {
			try {
				if (clear) {
					this.page = 1
					this.couponList = []
				}
				const { rows = [], total = 0 } = await this.$http.post('/user/coupon/list', {
					expiredType: this.expiredType,
					couponType: this.couponType,
					page: this.page,
					pageSize: this.pageSize,
				})
				this.couponList = this.couponList.concat(rows.filter((item) => item.coupon) || [])
				this.totalCount = total
			} catch (error) {
				this.couponList = []
				this.totalCount = 0
			}
		},
		couponClick(item) {
			if (item.useStatus === USE_COUPON_STATUS.WAIT_SEND) {
				this.$refs.giftPopup.open(item.coupon)
			} else {
				uni.navigateTo({ url: `/pages/search-page/index?productIdList=${item.coupon.productIdList}` })
			}
		},
		loadMoreData() {
			// 检查是否还有更多数据
			if (this.noMoreData) {
				console.log('没有更多数据了')
				return
			}
			// 增加页码并加载下一页
			this.page = this.page + 1
			this.getCouponList()
		},
	},
}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>