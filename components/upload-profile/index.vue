<template>
  <view>
    <view @click="open"><slot></slot></view>

    <uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" background-color="#fff">
      <view class="getnickbox">
        <view class="flex_align_center">
          <image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/da449df52fc542dc9750403211634c3a/yuguo_logo%20%281%29.png?Expires=2076054860&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=MD4eu2NbpcKOFbv7%2BtjyfdHlctI%3D" class="logoimg" mode="aspectFit"></image>
          <view class="name">
            <text>钰果日记生鲜申请</text>
          </view>
        </view>
        <view class="m1 mt30">获取你的头像、昵称</view>
        <view class="m2">展示个人信息</view>
        <view class="xin1">
          <button 
          type="default" class="flex_spacebetween buttoncss" open-type="chooseAvatar"  @chooseavatar="chooseavatar">
            <view class="flex_align_center toubox">
              <view class="t1">头像</view>
              <view v-if="!avatar" class="avatar-text-box">
                <uni-icons v-if="!avatar" type="auth-filled" size="25" color="#999"></uni-icons>
                <text class="avatar-text">点击获取头像</text>
              </view>
              <view v-else class="avatarbox">
                <image :src="avatar" class="avatarimg"></image>
              </view>
            </view>
            <uni-icons type="right" size="25" color="#999"></uni-icons>
          </button>
        </view>
        <view class="nick">
          <view class="n1">昵称:</view>
          <input type="nickname" v-model="nickname" placeholder="请输入昵称">
        </view>
        <view class="fixedBtn wan">
          <button size="mini" open-type="getUserInfo"  @click="getUserInfo" :plain='true' class="btn">完成</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  export default {
    name: 'UploadProfile',
    data() {
      return {
        avatar: null,
        nickname: ''
      }
    },
    methods: {
      chooseavatar(e){
        console.log('选择头像:', e.detail.avatarUrl);
        this.avatar = e.detail.avatarUrl;
      },
      open() {
        this.$refs.popup.open()
      },
      getUserInfo() {
        console.log('获取用户信息');
        // 这里可以添加保存用户信息的逻辑
        if (this.avatar && this.nickname) {
          // 保存头像和昵称到本地或服务器
          this.$refs.popup.close();
          // 触发父组件更新用户信息
          this.$emit('updateUserInfo', {
            avatar: this.avatar,
            nickname: this.nickname
          });
        } else {
          uni.showToast({
            title: '请选择头像或输入昵称',
            icon: 'none'
          });
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>