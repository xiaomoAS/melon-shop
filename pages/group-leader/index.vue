<template>
  <view class="leader-box">
    <UserProfile ref="userProfileRef" :scene="PROFILE_SCENE.LEADER" @updateUserInfo="updateUserInfo"/>

    <!-- 数据统计卡片区域 -->
    <view class="stats-cards">
      <view class="stats-row">
        <view class="stat-item">
          <view class="stat-label">团员数量</view>
          <view class="stat-value">{{ leaderInfo.userCount }}</view>
        </view>
        <view class="stat-item">
          <view class="stat-label">团订单量</view>
          <view class="stat-value" v-html="formatNum(leaderInfo.orderCount)"></view>
        </view>
      </view>
      <view class="stats-row">
        <view class="stat-item">
          <view class="stat-label">团销售金额</view>
          <view class="stat-value" v-html="formatNum(leaderInfo.salePrice)"></view>
        </view>
        <view class="stat-item">
          <view class="stat-label">团长推广金</view>
          <view class="stat-value" v-html="formatNum(leaderInfo.commissionPrice)"></view>
        </view>
      </view>
    </view>

    <!-- 团长营销考核通知栏 -->
    <view class="notice-bar">
      <view class="notice-icon">🏆</view>
      <view class="notice-content">
        <text class="notice-label">团长营销考核通知，结算通知！</text>
        <uni-icons type="arrowright" size="16" color="#FFFFFF"></uni-icons>
      </view>
    </view>

    <!-- 功能菜单区域 -->
    <view class="function-menu">
      <view class="menu-row">
        <view class="menu-item" @click="navigateTo('/pages/team-manage/index')">
          <uni-icons type="person-filled" size="24" color="#666666"></uni-icons>
          <text class="menu-label">团队管理</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/order-manage/index')">
          <uni-icons type="list" size="24" color="#666666"></uni-icons>
          <text class="menu-label">订单管理</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/group-promotion/index')">
          <uni-icons type="gift-filled" size="24" color="#666666"></uni-icons>
          <text class="menu-label">拼团促销</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/product-table/index')">
          <uni-icons type="shop-filled" size="24" color="#666666"></uni-icons>
          <text class="menu-label">商品表格</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/account-view/index')">
          <uni-icons type="wallet-filled" size="24" color="#666666"></uni-icons>
          <text class="menu-label">账户提现</text>
        </view>
      </view>
    </view>

    <!-- 最高佣金推荐 -->
    <view class="recommendation-section">
      <view class="section-title">最高佣金推荐</view>
      <view class="product-card">
        <view class="product-info">
          <text class="product-name">{{ recommendProduct.name }}</text>
          <view class="product-details">
            <text class="product-price">销量：{{ recommendProduct.sales }}</text>
            <text class="product-stock">库存：{{ recommendProduct.stock }}</text>
          </view>
          <view class="commission-info">
            <text class="commission-label">佣金：</text>
            <text class="commission-amount">💰 {{ recommendProduct.commission }}/件</text>
          </view>
        </view>
        <view class="product-action">
          <button class="start-group-btn" @click="startGroup">立即开团</button>
        </view>
      </view>
    </view>

    <!-- 钱果信息列表 -->
    <view class="fruit-info-section">
      <view class="section-title">钱果信息</view>
      <view class="fruit-list">
        <view 
          class="fruit-item" 
          v-for="(item, index) in fruitList" 
          :key="index"
          @click="viewFruitDetail(item)"
        >
          <view class="fruit-avatar">
            <uni-icons :type="item.icon" size="32" color="#FF6B9D"></uni-icons>
          </view>
          <view class="fruit-content">
            <view class="fruit-title">{{ item.title }}</view>
            <view class="fruit-description">{{ item.description }}</view>
          </view>
          <uni-icons type="arrowright" size="14" color="#999999"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 团长二维码 -->
    <view class="qrcode-section">
      <button class="qrcode-btn" @click="showQRCode">
        <uni-icons type="scan" size="20" color="#1F2937"></uni-icons>
        <text>团长二维码</text>
      </button>
    </view>
  </view>
</template>

<script>
import UserProfile from '@/components/user-profile/index.vue'
import { PROFILE_SCENE } from '@/components/user-profile/constants.ts'

export default {
  name: 'GroupLeader',
  options: {
    styleIsolation: 'shared'
  },
  components: {
    UserProfile
  },
  data() {
    return {
      PROFILE_SCENE,
      leaderInfo: {},
      recommendProduct: {
        name: '山东xxxxxxxxxx',
        sales: 13123,
        stock: 12314,
        commission: 5
      },
      fruitList: [
        {
          title: '钱果科普营销',
          description: '了解钱果种植技术和营销策略',
          icon: 'leaf'
        },
        {
          title: '钱果科普营销',
          description: '掌握钱果销售技巧和客户维护',
          icon: 'chat-filled'
        },
        {
          title: '钱果科普营销',
          description: '学习钱果品牌推广和市场拓展',
          icon: 'sound-filled'
        }
      ]
    }
  },
  onShow() {
		this.initData()
		this.$nextTick(() => {
			this.$refs.userProfileRef && this.$refs.userProfileRef.getUserInfo()
		})
	},
  methods: {
    formatNum(num) {
      if (!num) return '0'
      if (num < 10000) return `${num}`
      return `${Math.round((num / 10000) * 100) / 100}<span class="stat-value__unit">万</span>`
    },
    updateUserInfo(val) {
      const { teamLeader } = val
			this.leaderInfo = teamLeader;
		},
    async initData() {
      try {

      } catch (error) {
        console.log('获取统计数据失败:', error)
      }
    },
    navigateTo(url) {
      uni.navigateTo({
        url: url
      })
    },
    startGroup() {
      uni.showToast({
        title: '开团功能开发中',
        icon: 'none'
      })
    },
    viewFruitDetail(item) {
      uni.navigateTo({
        url: `/pages/fruit-detail/index?title=${item.title}`
      })
    },
    showQRCode() {
      uni.navigateTo({
        url: '/pages/leader-qrcode/index'
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
<style>
.stat-value__unit {
  font-size: 24rpx;
  color: #6B7280;
  margin-left: 4rpx;
}
</style>