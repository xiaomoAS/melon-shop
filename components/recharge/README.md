# Recharge 充值组件

这是一个基于 uni-popup-dialog 改写的充值组件，提供了弹窗式的充值界面。

## 特性

- ✅ 使用 uni-popup-dialog 实现弹窗效果
- ✅ 支持会员套餐选择
- ✅ 自定义充值金额输入
- ✅ 用户信息展示
- ✅ 响应式设计
- ✅ 事件回调支持

## 使用方法

### 1. 导入组件

```vue
<script>
import Recharge from '@/components/Recharge/Recharge.vue'

export default {
  components: {
    Recharge
  }
}
</script>
```

### 2. 在模板中使用

```vue
<template>
  <view>
    <!-- 触发按钮 -->
    <button @click="showRecharge">打开充值</button>
    
    <!-- 充值组件 -->
    <Recharge 
      :show="isRechargeVisible" 
      @confirm="onRechargeConfirm"
      @close="onRechargeClose"
    />
  </view>
</template>
```

### 3. 处理事件

```vue
<script>
export default {
  data() {
    return {
      isRechargeVisible: false
    }
  },
  methods: {
    // 显示充值弹窗
    showRecharge() {
      this.isRechargeVisible = true
    },
    
    // 充值确认回调
    onRechargeConfirm(result) {
      console.log('充值信息：', result)
      // result 包含：
      // {
      //   amount: 3000,           // 充值金额
      //   packageIndex: 0,        // 选中的套餐索引
      //   packageInfo: {          // 套餐信息
      //     title: 'XX会员',
      //     price: '3000',
      //     discount: '享9.5折'
      //   }
      // }
      
      this.isRechargeVisible = false
      
      // 处理充值逻辑
      this.handleRecharge(result)
    },
    
    // 充值弹窗关闭回调
    onRechargeClose() {
      this.isRechargeVisible = false
    },
    
    // 处理充值逻辑
    async handleRecharge(rechargeData) {
      try {
        // 调用充值 API
        const response = await this.$http.post('/api/recharge', {
          amount: rechargeData.amount,
          packageId: rechargeData.packageIndex
        })
        
        if (response.success) {
          uni.showToast({
            title: '充值成功',
            icon: 'success'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '充值失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| show | Boolean | false | 是否显示充值弹窗 |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| confirm | 确认充值时触发 | result: { amount, packageIndex, packageInfo } |
| close | 关闭弹窗时触发 | - |

## 自定义配置

### 修改会员套餐

在 `Recharge.vue` 的 `data` 中修改 `memberPackages` 数组：

```javascript
memberPackages: [
  {
    title: '青铜会员',
    price: '1000',
    discount: '享9.8折'
  },
  {
    title: '白银会员',
    price: '3000',
    discount: '享9.5折'
  },
  {
    title: '黄金会员',
    price: '8000',
    discount: '享9.2折'
  }
]
```

### 修改用户信息

在组件模板中修改用户信息显示：

```vue
<view class="inf_cont">
  <view class="name">{{ userInfo.name || '陌上云霄' }}</view>
  <view class="id">ID:{{ userInfo.id || '156345' }}</view>
</view>
```

## 样式自定义

组件使用了 Less 预处理器，你可以通过修改 CSS 变量来自定义样式：

```less
// 主题色
$primary-color: #61C55E;
$accent-color: #FF5745;
$text-color: #333333;

// 圆角
$border-radius: 10rpx;

// 间距
$spacing: 20rpx;
```

## 注意事项

1. 确保项目中已安装 uni-ui 组件库
2. 组件依赖 uni-popup 和 uni-popup-dialog
3. 建议在使用前先测试弹窗的显示效果
4. 充值逻辑需要根据实际业务需求进行调整

## 完整示例

参考 `RechargeExample.vue` 文件查看完整的使用示例。