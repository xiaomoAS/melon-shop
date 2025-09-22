<template>
  <view class="demo-page">
    <view class="demo-header">
      <text class="demo-title">ReportView 组件使用示例</text>
    </view>
    
    <view class="demo-content">
      <!-- 图片预览示例 -->
      <view class="demo-section">
        <text class="section-title">图片预览示例</text>
        
        <report-view 
          :url="imageUrl" 
          :type="1" 
          title="产品图片"
        >
          <view class="demo-trigger image-trigger">
            <image :src="imageUrl" mode="aspectFill" class="thumbnail" />
            <text class="trigger-text">点击预览图片</text>
          </view>
        </report-view>
      </view>
      
      <!-- PDF预览示例 -->
      <view class="demo-section">
        <text class="section-title">PDF预览示例</text>
        
        <report-view 
          :url="pdfUrl" 
          :type="2" 
          title="产品说明书"
        >
          <view class="demo-trigger pdf-trigger">
            <view class="pdf-icon">📄</view>
            <text class="trigger-text">点击预览PDF</text>
          </view>
        </report-view>
      </view>
      
      <!-- 自定义触发器示例 -->
      <view class="demo-section">
        <text class="section-title">自定义触发器示例</text>
        
        <report-view 
          :url="imageUrl2" 
          :type="1"
        >
          <button class="custom-btn">
            查看商品详情图
          </button>
        </report-view>
      </view>
      
      <!-- 编程式调用示例 -->
      <view class="demo-section">
        <text class="section-title">编程式调用示例</text>
        
        <report-view 
          ref="reportViewRef"
          :url="pdfUrl2" 
          :type="2"
          title="技术文档"
        >
          <!-- 空插槽，不显示默认触发器 -->
        </report-view>
        
        <button class="custom-btn" @click="showProgrammatically">
          编程式打开PDF
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import reportView from './reportView.vue'

// 示例数据
const imageUrl = ref('https://picsum.photos/800/600?random=1')
const imageUrl2 = ref('https://picsum.photos/800/600?random=2')
const pdfUrl = ref('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
const pdfUrl2 = ref('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')

// 组件引用
const reportViewRef = ref()

// 编程式调用
const showProgrammatically = () => {
  if (reportViewRef.value) {
    reportViewRef.value.showPreview()
  }
}
</script>

<style scoped lang="scss">
.demo-page {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.demo-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.demo-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333333;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 60rpx;
}

.demo-section {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.section-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.demo-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  padding: 40rpx;
  border: 2rpx dashed #cccccc;
  border-radius: 16rpx;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #007aff;
    background-color: #f8f9ff;
  }

  &.image-trigger {
    .thumbnail {
      width: 200rpx;
      height: 150rpx;
      border-radius: 12rpx;
      object-fit: cover;
    }
  }

  &.pdf-trigger {
    .pdf-icon {
      font-size: 80rpx;
      line-height: 1;
    }
  }
}

.trigger-text {
  font-size: 28rpx;
  color: #666666;
  text-align: center;
}

.custom-btn {
  width: 100%;
  height: 88rpx;
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056d3;
  }

  &:active {
    background-color: #004bb5;
  }
}

// 响应式设计
@media (max-width: 750rpx) {
  .demo-page {
    padding: 32rpx;
  }

  .demo-title {
    font-size: 42rpx;
  }

  .demo-content {
    gap: 48rpx;
  }

  .demo-section {
    padding: 32rpx;
  }

  .section-title {
    font-size: 32rpx;
  }

  .demo-trigger {
    padding: 32rpx;

    &.image-trigger {
      .thumbnail {
        width: 160rpx;
        height: 120rpx;
      }
    }

    &.pdf-trigger {
      .pdf-icon {
        font-size: 64rpx;
      }
    }
  }

  .trigger-text {
    font-size: 26rpx;
  }

  .custom-btn {
    height: 80rpx;
    font-size: 30rpx;
  }
}
</style>