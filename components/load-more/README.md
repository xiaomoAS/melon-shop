# LoadMore 组件使用说明

## 功能描述
当组件在页面上可见时，自动触发 `visible` 事件，可用于实现无限滚动加载等功能。

## 使用方法

### 1. 引入组件
```javascript
import LoadMore from '@/components/load-more/index.vue'

export default {
  components: {
    LoadMore
  }
}
```

### 2. 在模板中使用
```html
<LoadMore @visible="handleVisible" :threshold="100" :once="false">
  <!-- 自定义内容（可选） -->
  <view>加载更多内容</view>
</LoadMore>
```

### 3. 处理事件
```javascript
methods: {
  handleVisible(event) {
    console.log('组件可见', event)
    // 这里可以执行加载更多数据的操作
  }
}
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| threshold | Number | 50 | 距离视口底部的触发阈值（单位：px） |
| once | Boolean | false | 是否只触发一次，true 表示只触发一次，false 表示每次可见都会触发 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| visible | { timestamp, component } | 组件进入视口时触发 |

## 方法说明

| 方法名 | 说明 |
|--------|------|
| reset() | 重置触发状态，可用于需要重复触发的场景 |

## 使用示例

### 基本用法
```html
<LoadMore @visible="loadMoreData" />
```

### 自定义阈值和单次触发
```html
<LoadMore 
  @visible="loadMoreData" 
  :threshold="100"
  :once="true"
/>
```

### 自定义内容
```html
<LoadMore @visible="loadMoreData">
  <view class="custom-load-more">
    <text>点击加载更多</text>
  </view>
</LoadMore>
```

## 注意事项
1. 组件使用 `uni.createIntersectionObserver` 实现可见性检测
2. 确保组件在页面中有足够的高度，否则可能无法正常触发
3. 在组件销毁时会自动断开观察器，避免内存泄漏
4. 如果需要重复触发，可以调用组件的 `reset()` 方法