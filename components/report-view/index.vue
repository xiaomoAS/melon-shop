<template>
  <view class="report-view" :class="customClass">
    <!-- 触发按钮插槽 -->
    <view @click="showPreview" class="trigger-slot">
      <slot></slot>
    </view>
    
    <!-- 底部弹层 -->
    <view 
      v-if="visible" 
      class="popup-mask" 
      @click="hidePreview"
    >
      <view class="popup-container" @click.stop>
        <!-- 头部标题栏 -->
        <view class="popup-header">
          <text class="popup-title">{{ getTitle() }}</text>
          <view class="close-btn" @click="hidePreview">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <!-- 内容区域 -->
        <view class="popup-content">
          <!-- 图片预览 -->
          <view v-if="reportType === REPORT_TYPE.IMAGE" class="image-preview">
            <image 
              :src="url" 
              mode="aspectFit" 
              class="preview-image"
              @error="onImageError"
              @load="onImageLoad"
            />
          </view>
          
          <!-- PDF预览 -->
          <view v-else-if="reportType === REPORT_TYPE.PDF" class="pdf-preview">
            <!-- <web-view 
              :src="getPdfViewerUrl()" 
              class="pdf-webview"
              @error="onPdfError"
            /> -->
            <!-- 请点击下方按钮下载PDF文件 -->
          </view>
          
          <!-- 不支持的类型 -->
          <view v-else class="unsupported-type">
            <text class="error-text">不支持的文件类型</text>
          </view>
        </view>
        
        <!-- 底部操作栏 -->
        <view class="popup-footer">
          <button 
            class="action-btn download-btn" 
            @click="downloadFile"
            :disabled="downloading"
          >
            {{ downloading ? '下载中...' : '下载' }}
          </button>
          <button class="action-btn close-btn-footer" @click="hidePreview">
            关闭
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { REPORT_TYPE } from './constants'

export default {
  name: 'ReportViewer',
  props: {
    title: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    },
    productId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      downloading: false,
      url: null,
      reportType: REPORT_TYPE.IMAGE,
      REPORT_TYPE
    }
  },
  methods: {
    // 显示预览
    async showPreview() {
      if (!this.productId) return
      await this.getReportDetail()
      if (this.reportType === REPORT_TYPE.IMAGE) {
        this.visible = true
      } else if (this.reportType === REPORT_TYPE.PDF) {
        this.downloadFile()
      }
    },
    
    // 隐藏预览
    hidePreview() {
      this.visible = false
    },
    
    // 获取标题
    getTitle() {
      if (this.title) {
        return this.title
      }
      return this.reportType === REPORT_TYPE.IMAGE ? '图片预览' : 'PDF下载'
    },
    
    // 获取PDF查看器URL
    getPdfViewerUrl() {
      // 使用在线PDF查看器，或者返回原始URL让webview处理
      // 这里提供几种方案：
      
      // 方案1: 使用腾讯浏览服务
      // return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(this.url)}`
      
      // 方案2: 使用谷歌文档查看器
      // return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(this.url)}`
      
      // 方案3: 直接返回原始URL（适用于支持PDF的浏览器）
      return this.url
    },
    
    // 图片加载成功
    onImageLoad() {
      console.log('图片加载成功')
    },
    
    // 图片加载失败
    onImageError() {
      uni.showToast({
        title: '图片加载失败',
        icon: 'none'
      })
    },
    
    // PDF加载失败
    onPdfError() {
      uni.showToast({
        title: 'PDF加载失败',
        icon: 'none'
      })
    },
    
    // 获取轮播图片数据
    async getReportDetail() {
      try {
        const info = await this.$http.post('/items/report', { productId: this.productId })
        this.url = info.url
        this.reportType = info.reportType
      } catch (error) {
        this.carouselImages = []
      }
    },
    
    // 下载文件
    downloadFile() {
      if (!this.url) {
        uni.showToast({
          title: '文件地址不能为空',
          icon: 'none'
        })
        return
      }
      
      this.downloading = true
      
      // 使用uni.downloadFile下载文件
      uni.downloadFile({
        url: this.url,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: '下载成功',
              icon: 'success'
            })
            
            // 根据文件类型进行保存
            if (this.reportType === REPORT_TYPE.IMAGE) {
              // 保存图片到相册
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  uni.showToast({
                    title: '已保存到相册',
                    icon: 'success'
                  })
                },
                fail: (err) => {
                  console.error('保存图片失败:', err)
                  uni.showToast({
                    title: '保存失败，请检查相册权限',
                    icon: 'none'
                  })
                }
              })
            } else if (this.reportType === REPORT_TYPE.PDF) {
              // 处理PDF文件
              uni.openDocument({
								filePath: res.tempFilePath,
								showMenu: true, // 右上角菜单，可以进行分享保存pdf
								success: function(file) {
									console.log("文件打开成功", file)
								}
							})
              // this.handlePdfSave(res.tempFilePath)
            }
          } else {
            uni.showToast({
              title: '下载失败',
              icon: 'none'
            })
          }
        },
        fail: () => {
          uni.showToast({
            title: '下载失败',
            icon: 'none'
          })
        },
        complete: () => {
          this.downloading = false
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>