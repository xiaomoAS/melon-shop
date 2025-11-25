<template>
  <uni-popup ref="codePopup" class="code-popup">
    <view class="popup-container">
      <!-- 标题 -->
      <view class="title">钰果日记</view>
      
      <!-- 用户信息区域 -->
      <view class="user-info-section">
        <!-- 用户头像 -->
        <view class="avatar-container">
          <image
            class="avatar"
            :src="userInfo.headImgUrl || 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1f25a32b4b97447bac8d02f20f0a47b6/user_ava.png?Expires=2073952610&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=IQflZdBMbA4jh2W7oui1vmaxPuU%3D'"
            mode="aspectFill">
          </image>
          <image class="avatar-container__frame" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/59c8d701ec82439eb346d3c228b18edf/%E5%A4%B4%E5%83%8F%E5%8A%A8%E6%80%81_422.6KB.gif?Expires=2079334132&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=Nf%2FEOYE1sAR0dT4EkHDOolZKjtU%3D" />
        </view>
        
        <!-- 用户详细信息 -->
        <view class="user-details">
          <view class="nickname-row">
            <text class="nickname">{{ userInfo.nickName || '微信用户' }}</text>
            <!-- 等级图标 -->
            <image
              v-if="userInfo.teamLeader && userInfo.teamLeader.level"
              class="level-icon"
              :src="LEADER_LEVEL_ICON[userInfo.teamLeader.level]"
              mode="aspectFit">
            </image>
          </view>
          <view class="user-id">ID: {{ userInfo.id || '-' }}</view>
          <view class="invitation-text">扫描下方二维码入团</view>
        </view>
      </view>
      
      <!-- 二维码区域 -->
      <view class="qrcode-section">
        <view class="qrcode-container">
          <image
            v-if="userInfo.teamLeader && userInfo.teamLeader.qrCode"
            class="qrcode"
            :src="userInfo.teamLeader.qrCode"
            mode="aspectFit">
          </image>
          <view v-else class="qrcode-placeholder">
            <text>暂无二维码</text>
          </view>
        </view>
      </view>
      
      <!-- 保存分享按钮 -->
      <view class="save-btn" @click="saveQRCode">
        <text class="save-btn-text">保存分享</text>
      </view>
    </view>
  </uni-popup>
</template>

<script>
  import { LEADER_LEVEL_ICON } from '@/components/user-profile/constants';

  export default {
    name: 'CodePopup',
    data() {
      return {
        userInfo: {},
        LEADER_LEVEL_ICON
      }
    },
    methods: {
      open(info) {
        if (!info) return
        this.userInfo = info
        this.$refs.codePopup.open('center')
      },
      async saveQRCode() {
        if (!this.userInfo.teamLeader.qrCode) {
          uni.showToast({
            title: '暂无二维码可保存',
            icon: 'none'
          })
          return
        }
        
        try {
          // 下载图片到本地
          const res = await new Promise((resolve, reject) => {
            uni.downloadFile({
              url: this.userInfo.teamLeader.qrCode,
              success: resolve,
              fail: reject
            })
          })
          
          // 保存图片到相册
          await new Promise((resolve, reject) => {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: resolve,
              fail: reject
            })
          })
          
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
          
        } catch (error) {
          console.error('保存二维码失败:', error)
          
          // 处理权限问题
          if (error.errMsg && error.errMsg.includes('auth')) {
            uni.showModal({
              title: '提示',
              content: '需要相册权限才能保存图片，请在设置中开启',
              showCancel: false
            })
          } else {
            uni.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>