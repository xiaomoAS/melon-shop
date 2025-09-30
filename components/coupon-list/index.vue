<template>
	<view class="coupon-last">
		<view v-for="item in couponList" :key="item.couponId" class="coupon_list">
			<view class="coupon_name">{{ getCouponShortName(item) }}</view>
			<view class="coupon_deta">
				<view class="tle">{{ getCouponName(item) }}</view>
				<view class="time">{{ formatExpireTime(item.coupon.endTime) }}</view>
				<view class="txt">{{ getCouponDesc(item) }}</view>
			</view>
			<view class="play_cont">
				<view class="txt">1张</view>
				<view class="btn" @click="toSearchPage(item)">去使用</view>
			</view>
		</view>
		<view v-if="!couponList.lengths" class="no-coupon-tip">暂无优惠券~</view>

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
	</view>
	
</template>

<script>
import { COUPON_TYPE } from './constants'
import LoadMore from '@/components/load-more/index.vue'

export default {
	name: 'CouponList',
	components: {
		LoadMore
	},
	props: {
		couponType: {
			type: Number,
			default: undefined,
			required: false
		}
	},
	data() {
		return {
			COUPON_TYPE,
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
			
			// 如果是今天
			if (todayStart.getTime() === expireDateStart.getTime()) {
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
			if (item.coupon.type === COUPON_TYPE.NEW_DISCOUNT) return '新用户特定品类体验券'
			if (item.coupon.type === COUPON_TYPE.FREIGHT) return '特定品类包邮券'
		},
		getCouponShortName(item) {
			if (!item.coupon) return ''
			if (item.coupon.type === COUPON_TYPE.NEW_DISCOUNT) return '优惠券'
			if (item.coupon.type === COUPON_TYPE.FREIGHT) return '包邮券'
		},
		getCouponName(item) {
			if (!item.coupon) return ''
			if (item.coupon.type === COUPON_TYPE.NEW_DISCOUNT) return '新用户优惠券'
			if (item.coupon.type === COUPON_TYPE.FREIGHT) return '包邮券'
		},
		async getCouponList(clear = false) {
			try {
				if (clear) {
					this.page = 1
					this.couponList = []
				}
				const { rows = [], total = 0 } = await this.$http.post('/user/coupon/list', {
					couponType: this.couponType,
					page: this.page,
					pageSize: this.pageSize,
				})
				this.couponList = this.couponList.concat(rows)
				this.totalCount = total
			} catch (error) {
				this.couponList = []
				this.totalCount = 0
			}
		},
		toSearchPage(item) {
			uni.navigateTo({ url: `/pages/search-page/index?productIdList=${item.coupon.productIdList}` })
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
	// 适配所有优惠券列表，切换优惠券类型时
	watch: {
		couponType: {
			handler(newVal, oldVal) {
				if (newVal && newVal !== oldVal) {
					this.getCouponList(true)
				}
			},
			immediate: true
		},
	},
}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>