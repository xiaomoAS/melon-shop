<template>
  <div class="load-more-container">
    <div class="load-more-content">
      <slot>
        <div class="default-content">
          <text class="text">加载更多</text>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadMore',
  props: {
    // 触发距离底部的阈值（单位px）
    threshold: {
      type: Number,
      default: 50
    },
    // 是否只触发一次
    once: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasTriggered: false,
      observer: null
    }
  },
  mounted() {
    this.initObserver()
  },
  beforeDestroy() {
    this.disconnectObserver()
  },
  methods: {
    initObserver() {
      // 创建交叉观察器
      this.observer = uni.createIntersectionObserver(this, {
        thresholds: [0],
        observeAll: false
      })
      
      // 观察当前组件
      this.observer.relativeToViewport({ bottom: this.threshold }).observe('.load-more-container', (res) => {
        if (res.intersectionRatio > 0) {
          // 组件进入视口
          this.handleVisible()
        }
      })
    },
    
    handleVisible() {
      // 如果设置了只触发一次，且已经触发过，则不再触发
      if (this.once && this.hasTriggered) {
        return
      }
      
      // 标记已触发
      this.hasTriggered = true
      
      // 触发自定义事件
      this.$emit('visible', {
        timestamp: Date.now(),
        component: this
      })
      
      console.log('LoadMore组件已进入视口，触发visible事件')
    },
    
    disconnectObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },
    
    // 重置触发状态（用于需要重复触发的场景）
    reset() {
      this.hasTriggered = false
    }
  }
}
</script>

<style lang="scss" scoped>
.load-more-container {
  width: 100%;
  padding: 20rpx 0;
}

.load-more-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80rpx;
}

.default-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
}

.text {
  font-size: 28rpx;
  color: #666;
}
</style>