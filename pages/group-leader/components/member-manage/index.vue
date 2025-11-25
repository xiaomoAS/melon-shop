<template>
  <view class="member-manage">
    <!-- 筛选区域 -->
    <view class="filter-section">
      <view class="filter-row">
        <view class="filter-item">
          <input
            v-model="form.userId"
            class="filter-input"
            placeholder="团员用户ID"
          />
        </view>
        <view class="filter-item">
          <input
            v-model="form.nickName"
            class="filter-input"
            placeholder="团员昵称"
          />
        </view>
        <view class="search-btn-item">
          <button
            class="search-btn"
            @click="handleSearch"
            :disabled="loading"
          >
            {{ loading ? '搜索中...' : '搜索' }}
          </button>
        </view>
      </view>
      <view class="sort-section">
        <picker
          :value="sortIndex"
          :range="SORT_LIST"
          range-key="label"
          @change="onSortChange"
          class="sort-picker"
        >
          <view class="sort-display">
            <text class="sort-text">{{ currentSortLabel }}</text>
            <text class="sort-arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <button class="batch-btn">下载明细</button>


    <!-- 团员列表 -->
    <view class="member-list">
      <view
        v-for="member in memberList"
        :key="member.id"
        class="member-card"
      >
        <view class="member-header">
          <view class="member-info">
            <image
              :src="member.headImgUrl || '/static/default-avatar.png'"
              class="member-avatar"
              mode="aspectFill"
            />
            <view class="member-details">
              <text class="member-name">{{ member.nickName }}</text>
              <text class="member-id">ID: {{ member.userId }}</text>
            </view>
          </view>
          <view class="member-actions">
            <button
              class="remove-btn"
              @click="removeMember(member)"
            >
              删除团员
            </button>
          </view>
        </view>
        
        <view class="member-stats">
          <view class="stat-item">
            <text class="stat-value">{{ member.orderCount }}</text>
            <text class="stat-label">订单量</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ member.totalPayPrice }}</text>
            <text class="stat-label">购买金额</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ formatJoinTime(member.joinTeamTime) }}</text>
            <text class="stat-label">入团时间</text>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="!memberList.length && !loading" class="empty-state">
        <text class="empty-text">暂无团员数据</text>
      </view>
    </view>

    <!-- 加载更多 -->
    <LoadMore
      v-if="memberList.length && !noMoreData"
      :threshold="50"
      :once="false"
      @visible="loadMoreData"
    >
      <view class="custom-load-more">
        <text>上拉加载更多</text>
      </view>
    </LoadMore>

  </view>
</template>

<script>
import LoadMore from '@/components/load-more/index.vue'
import { SORT_LIST, SORT_KEY } from './constants';

export default {
  name: 'MemberManage',
  components: {
    LoadMore
  },
  data() {
    return {
      form: {
        userId: '',
        nickName: '',
        sortField: SORT_KEY.PRICE,
      },
      memberList: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      loading: false,
      SORT_LIST,
    }
  },
  computed: {
    noMoreData() {
      return this.page * this.pageSize >= this.totalCount
    },
    sortIndex() {
      return SORT_LIST.findIndex(item => item.value === this.form.sortField)
    },
    currentSortLabel() {
      const currentSort = SORT_LIST.find(item => item.value === this.form.sortField)
      return currentSort ? currentSort.label : SORT_LIST[0].label
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData(isLoadMore = false) {
      if (this.loading) return
      
      try {
        this.loading = true
        const params = {
          ...this.form,
          page: this.page,
          pageSize: this.pageSize,
        }
        
        const { rows = [], total = 0 } = await this.$http.post('/team/leader/listUser', params)
        
        if (isLoadMore) {
          // 加载更多时追加数据
          this.memberList = [...this.memberList, ...rows]
        } else {
          // 重新搜索时替换数据
          this.memberList = rows
        }
        this.totalCount = total
      } catch (error) {
        this.memberList = []
      } finally {
        this.loading = false
      }
    },
    
    loadMoreData() {
      // 检查是否还有更多数据
      if (this.noMoreData || this.loading) {
        console.log('没有更多数据了')
        return
      }
      // 增加页码并加载下一页
      this.page = this.page + 1
      this.getTableData(true)
    },
    
    handleSearch() {
      this.resetAndSearch()
    },
    
    onSortChange(e) {
      const index = e.detail.value
      this.form.sortField = SORT_LIST[index].value
      this.resetAndSearch()
    },
    
    resetAndSearch() {
      this.page = 1
      this.getTableData()
    },
    
    formatJoinTime(timeStr) {
      if (!timeStr) return '--'
      try {
        const date = new Date(timeStr)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      } catch (error) {
        return timeStr
      }
    },
    
    async removeMember(member) {
      const result = await uni.showModal({
        title: '确认删除',
        content: `确定要删除团员"${member.nickName}"吗？`,
        confirmText: '删除',
        confirmColor: '#ff4757'
      })
      
      if (!result.confirm) return
      
      try {
        await this.$http.post('/team/leader/removeUser', {
          userId: member.userId
        })
        
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
        
        // 重新加载数据
        this.resetAndSearch()
      } catch (error) {
        console.error('删除团员失败:', error)
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>