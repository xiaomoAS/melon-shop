# ReportView 组件使用说明

## 概述

ReportView 是一个用于预览图片和PDF文件的底部弹层组件，支持uniapp多端运行。

## 功能特性

- ✅ 支持图片预览（type=1）
- ✅ 支持PDF预览（type=2）
- ✅ 底部弹层展示，用户体验友好
- ✅ 支持文件下载功能
- ✅ 图片支持保存到相册
- ✅ 自定义触发器（插槽支持）
- ✅ 编程式调用API
- ✅ 响应式设计，支持多端适配
- ✅ 暗色主题支持
- ✅ 优雅的动画效果

## 基本用法

### 1. 引入组件

```vue
<script setup>
import reportView from '@/components/report-view/reportView.vue'
</script>
```

### 2. 图片预览

```vue
<template>
  <report-view 
    :url="imageUrl" 
    :type="1" 
    title="产品图片"
  >
    <button>查看图片</button>
  </report-view>
</template>

<script setup>
import { ref } from 'vue'

const imageUrl = ref('https://example.com/image.jpg')
</script>
```

### 3. PDF预览

```vue
<template>
  <report-view 
    :url="pdfUrl" 
    :type="2" 
    title="说明文档"
  >
    <button>查看PDF</button>
  </report-view>
</template>

<script setup>
import { ref } from 'vue'

const pdfUrl = ref('https://example.com/document.pdf')
</script>
```

## Props 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| url | String | 是 | - | 文件地址 |
| type | Number | 是 | - | 文件类型：1=图片，2=PDF |
| title | String | 否 | '' | 弹层标题，为空时自动生成 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| default | 触发预览的内容，可以是按钮、图片等任意内容 |

## 方法

通过 ref 可以调用以下方法：

| 方法名 | 参数 | 说明 |
|--------|------|------|
| showPreview | - | 显示预览弹层 |
| hidePreview | - | 隐藏预览弹层 |

### 编程式调用示例

```vue
<template>
  <report-view 
    ref="reportViewRef"
    :url="fileUrl" 
    :type="1"
  >
    <!-- 空插槽，不显示默认触发器 -->
  </report-view>
  
  <button @click="openPreview">打开预览</button>
</template>

<script setup>
import { ref } from 'vue'

const reportViewRef = ref()
const fileUrl = ref('https://example.com/file.jpg')

const openPreview = () => {
  reportViewRef.value?.showPreview()
}
</script>
```

## 高级用法

### 自定义触发器样式

```vue
<template>
  <report-view :url="imageUrl" :type="1">
    <view class="custom-trigger">
      <image :src="imageUrl" class="thumbnail" />
      <text>点击查看大图</text>
    </view>
  </report-view>
</template>

<style>
.custom-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #ccc;
  border-radius: 10rpx;
}

.thumbnail {
  width: 200rpx;
  height: 150rpx;
  border-radius: 8rpx;
}
</style>
```

## PDF预览说明

PDF预览使用 `web-view` 组件实现，支持以下几种方案：

1. **直接预览**（默认）：直接加载PDF URL
2. **在线查看器**：可配置使用腾讯浏览服务或谷歌文档查看器

### 配置在线PDF查看器

在组件的 `getPdfViewerUrl()` 方法中可以选择不同的预览方案：

```javascript
// 方案1: 使用腾讯浏览服务
return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(props.url)}`

// 方案2: 使用谷歌文档查看器  
return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(props.url)}`

// 方案3: 直接返回原始URL（默认）
return props.url
```

## 注意事项

1. **图片格式**：支持常见的图片格式（jpg、png、gif、webp等）
2. **PDF兼容性**：PDF预览在不同平台表现可能有差异，建议测试目标平台
3. **网络权限**：确保应用有网络访问权限
4. **HTTPS要求**：部分平台要求文件URL使用HTTPS协议
5. **文件大小**：大文件可能影响加载速度，建议优化文件大小

## 平台兼容性

| 平台 | 图片预览 | PDF预览 | 下载功能 |
|------|----------|---------|----------|
| 微信小程序 | ✅ | ✅ | ✅ |
| H5 | ✅ | ✅ | ✅ |
| App | ✅ | ✅ | ✅ |
| 支付宝小程序 | ✅ | ✅ | ✅ |

## 更新日志

### v1.0.0
- 初始版本发布
- 支持图片和PDF预览
- 底部弹层交互
- 文件下载功能
- 响应式设计