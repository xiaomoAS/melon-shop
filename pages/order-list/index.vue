<template>
	<view class="contain mian-box">
		<scroll-view class="order_head_navi" scroll-x="true" :show-scrollbar="false">
			<view class="tab-container">
				<view
					class="li"
					:class="{ active: currentTab === tab.value }"
					v-for="tab in ORDER_TABS"
					:key="tab.value"
					@click="switchTab(tab.value)"
				>
					{{ tab.label }}
				</view>
			</view>
		</scroll-view>
		<view class="order_search_cont">
			<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4504ca659b80453ca747baaabba8d106/ico_1.png?Expires=2073875740&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=yYeoocs0saGNdYETNQ9FgrHVaB0%3D" mode="widthFix" @click="searchHandler"></image>
			<input v-model="orderId" type="text" placeholder="搜索您的订单号" @confirm="searchHandler">
			<view class="btn" @click="searchHandler">搜索</view>
		</view>

		<view v-if="!orderList.length" class="no-order-box">
			<view>您当前未享受好吃、健康、可信赖的精选好果</view>
			<text class="text-button" @click="toMainPage">去下单</text>
		</view>

		<view class="order_infor_last" v-for="order in orderList" :key="order.id">
			<view class="order_title">
				<view class="num">订单号：{{ order.id }}</view>
				<view class="time_zt">
					{{ formatDate(order.createdTime, 'MM-DD HH:mm:ss') }}下单
					<view class="tips" :class="getOrderConfig(order).iconClass">{{ getOrderConfig(order).label }}</view>
				</view>
			</view>
			<view class="pro_last">
				<view  class="list">
					<view v-for="product in getDisplayProducts(order)" :key="product.productId" class="detail_cont">
						<navigator :url="`/pages/product-detail/index?id=${product.productId}`">
							<view class="detail__content-box">
								<view class="detail__left-box">
									<view class="pro_i"><image :src="product.imgUrl || 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/204d3d96231349298d64fd8bc225bf0a/index_case1_2.png?Expires=2074059755&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=KOk2NNsu%2BaSUpyPUrTzkrc00TPE%3D'" mode="widthFix"></image> </view>
									<view class="">
										<view class="name">{{ product.productName }}</view>
										<!-- <view class="text">{{ product.desc }}</view> -->
										<view v-if="product.tagList">
											<view v-for="tag in product.tagList" :key="tag" class="bis">{{ tag }}</view>
										</view>
									</view>
								</view>
								
								<view class="price_inf">
									<view class="price"><text>￥</text>{{ product.price }}</view>
									<view class="num">×{{ product.buyCounts }}</view>
								</view>
							</view>
						</navigator>
<!-- 
						<ReportViewer :product-id="product.productId" custom-class="order-report">
							<view class="btn">检测报告</view>
						</ReportViewer> -->
					</view>
					
					<!-- 展开/收起按钮 -->
					<view v-if="order.productList.length > 2" class="expand-toggle" @click="toggleExpand(order.id)">
						<text>{{ isExpanded(order.id) ? '收起' : `展开 (还有${order.productList.length - 2}个商品)` }}</text>
						<text class="arrow" :class="{ 'expanded': isExpanded(order.id) }">▼</text>
					</view>
				</view>
			</view>
			<view class="total_inf">
				<view class="dd">
					共 <text class="amount">{{ order.productList.length }}</text> 件商品
					原价: <text class="amount">¥{{ order.totalAmount }} </text>
					<text v-if="order.orderStatus > ORDER_STATUS.WAIT_PAY"> 实付: <text class="amount">¥{{ order.realPayAmount }}</text></text>
				</view>
			</view>
			<view class="deliv_exp">
				<view v-if="order.waybillInfo && order.waybillInfo.estimatedDeliveryTime" class="dl delivery-time">
					<view class="dt">送达时间：</view>
					<view class="dd">{{ formatDate(order.waybillInfo.estimatedDeliveryTime, 'MM月DD日') }}</view>
				</view>
				<view v-if="order.waybillInfo" class="dl">
					<view class="dt">物流信息：</view>
					<view class="dd">
						物流公司：{{ order.waybillInfo.waybillCompanyName }}
						<view v-if="order.waybillInfo.waybillCode">运单号：{{ order.waybillInfo.waybillCode }}</view>
					</view>
				</view>
				<view class="dl">
					<view class="dt">收货地址：</view>
					<view class="dd">
						<text>{{ order.receiverName }}  {{ order.receiverMobile }}</text>
						<view>{{ order.receiverAddress }}</view>
					</view>
				</view>
			</view>
			<view class="bit_seet_cont">
				<view class="btn" @click="phoneHandler">联系客服</view>
				<view v-if="order.orderStatus === ORDER_STATUS.WAIT_PAY" class="btn" @click="cancelOrder(order)">取消订单</view>
				<view v-if="order.orderStatus === ORDER_STATUS.WAIT_PAY" class="btn sub" @click="toSettlePage(order)">继续支付</view>
				<view v-if="order.orderStatus === ORDER_STATUS.WAIT_RECEIVE" class="btn sub" @click="confirmReceive(order)">确认收货</view>
			</view>
		</view>

		<LoadMore 
			v-if="orderList.length && !noMoreData"
			:threshold="50"
			:once="false"
			@visible="loadMoreData" 
		>
			<view class="custom-load-more">
				<span>上拉加载更多</span>
			</view>
		</LoadMore>
	</view>
</template>

<script>
import { formatDate } from '@/utils/common';
import { ORDER_STATUS, ORDER_TABS, ALL_ORDER_CONFIGS } from './constants';
import ReportViewer from '@/components/report-view/index.vue';
import LoadMore from '@/components/load-more/index.vue'

export default {
	name: 'OrderList',
	components: {
		ReportViewer,
		LoadMore
	},
	data() {
		return {
			orderId: '',
			orderList: [],
			page: 0,
			pageSize: 5,
			totalCount: 0,
			ORDER_STATUS,
			ORDER_TABS,
			currentTab: ORDER_STATUS.ALL, // 默认选中全部
			formatDate,
			expandedOrders: [] // 记录已展开的订单ID
		}
	},
	computed: {
		noMoreData() {
			return this.page * this.pageSize >= this.totalCount
		},
	},
	onShow() {
		const defaultTab = wx.getStorageSync('orderTab')
		this.currentTab = defaultTab || this.currentTab || ORDER_STATUS.ALL
		wx.setStorageSync('orderTab', null) // 重置默认
		this.page = 1
		this.orderList = []
		this.getOrderList()
	},
	onShareAppMessage() {
		return {
			path: '/pages/index/index'
		}
	},
	onShareTimeline() {
		return {
			path: '/pages/index/index'
		}
	},
	methods: {
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
		toMainPage() {
			uni.switchTab({ url: '/pages/index/index' })
		},
		async cancelOrder(order) {
			try {
				uni.showModal({
					title: '',
					content: '确认取消该订单?',
					success: async (res) => {
						if (res.confirm) {
							await this.$http.post('/order/cancel', { orderId: order.id })
							uni.showToast({ title: '取消成功', icon: 'none' })
							this.switchTab(ORDER_STATUS.CANCELED)
						} else if (res.cancel) {}
					}
				})
			} catch (error) {
				console.log(error)
			}
		},
		toSettlePage(order) {
			uni.navigateTo({ url: `/pages/settlement/index?orderId=${order.id}` })
		},
		async confirmReceive(order) {
			try {
				uni.showModal({
					title: '',
					content: '确认收货吗?',
					success: async (res) => {
						if (res.confirm) {
							await this.$http.post('/order/receive', { orderId: order.id })
							uni.showToast({ title: '收货成功', icon: 'none' })
							this.switchTab(ORDER_STATUS.COMPLETED)
						} else if (res.cancel) {}
					}
				})
			} catch (error) {
				console.log(error)
			}
		},
		switchTab(tabValue) {
			this.currentTab = tabValue;
			this.orderId = ''
			this.page = 1; // 重置分页
			this.orderList = []; // 清空列表
			this.getOrderList(); // 重新加载数据
		},
		loadMoreData() {
			// 检查是否还有更多数据
			if (this.noMoreData) {
				console.log('没有更多数据了')
				return
			}
			// 增加页码并加载下一页
			this.page = this.page + 1
			this.getOrderList()
		},
		searchHandler() {
			this.page = 1; // 重置分页
			this.orderList = []; // 清空列表
			this.getOrderList(); // 重新加载数据
		},
		handleSettle() {
			uni.navigateTo({url: `/pages/settlement/index?orderId=1`})
		},
		getOrderConfig(order) {
			const tabItem = ALL_ORDER_CONFIGS.find((tab) => tab.value === order.orderStatus)
			return tabItem || {}
		},
		async getOrderList() {
			try {
				const { total = 0, rows = []} = await this.$http.post('/order/listOrder', {
					orderId: this.orderId,
					orderStatus: this.currentTab === ORDER_STATUS.ALL ? undefined : this.currentTab,
					page: this.page,
					pageSize: this.pageSize,
				})
				this.orderList = this.orderList.concat(rows)
				this.totalCount = total
			} catch (error) {
				this.orderList = []
				this.totalCount = 0
			}
		},
		// 切换展开/收起状态
		toggleExpand(orderId) {
			const index = this.expandedOrders.indexOf(orderId);
			if (index > -1) {
				// 如果已展开，则收起
				this.expandedOrders.splice(index, 1);
			} else {
				// 如果未展开，则展开
				this.expandedOrders.push(orderId);
			}
		},
		// 检查订单是否已展开
		isExpanded(orderId) {
			return this.expandedOrders.includes(orderId);
		},
		// 获取要显示的商品列表
		getDisplayProducts(order) {
			if (this.isExpanded(order.id) || order.productList.length <= 2) {
				return order.productList;
			}
			return order.productList.slice(0, 2);
		},
	},
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>