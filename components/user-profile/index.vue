<template>
  <view class="user_inf_content" :class="{'leader': scene === PROFILE_SCENE.LEADER}">
		<UploadProfile @updateUserInfo="handleUpdateUserInfo">
			<view class="ava_inf">
				<view class="tips_txt">点击头像上传个人信息</view>
				<view class="ava">
					<image :src="userInfo.headImgUrl || 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1f25a32b4b97447bac8d02f20f0a47b6/user_ava.png?Expires=2073952610&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=IQflZdBMbA4jh2W7oui1vmaxPuU%3D'" mode=""></image>
					<image class="ava__frame" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/59c8d701ec82439eb346d3c228b18edf/%E5%A4%B4%E5%83%8F%E5%8A%A8%E6%80%81_422.6KB.gif?Expires=2079334132&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=Nf%2FEOYE1sAR0dT4EkHDOolZKjtU%3D" />
				</view>
			</view>
		</UploadProfile>
		<view class="deta_inf">
			<view class="name">{{ userInfo.nickName || '微信用户' }}</view>
      <view v-if="userInfo.id" class="user-id">ID: {{ userInfo.id || '-' }} <image class="copy-icon" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/bd39793bb992485995a2cad9664fd851/copy-icon.png?Expires=2078101640&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=Ss38DuvAw0efEqUHnF%2FWSuB1dqI%3D" @click="copyUserId(userInfo.id)"></image></view>
		</view>
	</view>
</template>

<script>
	import UploadProfile from '@/components/upload-profile/index.vue'
	import { PROFILE_SCENE } from './constants';

  export default {
    name: 'UserProfile',
		props: {
			scene: {
				required: false,
				type: PROFILE_SCENE,
				default: PROFILE_SCENE.PERSONAL
			},
		},
    components: {
      UploadProfile,
    },
    data() {
      return {
        userInfo: {},
				PROFILE_SCENE
      }
    },
    mounted() {
      this.getUserInfo()
    },
    methods: {
      copyUserId(data) {
        wx.setClipboardData({
          data: String(data),
          success (res) {
            console.log(res)
          },
          fail(res) {
            console.log(res)
          }
        })
      },
      async getUserInfo() {
				try {
					this.userInfo = await this.$http.post('/wechat/user/getUserInfo', {})
				} catch (error) {
					this.userInfo = {}
				}
				this.$emit('updateUserInfo', this.userInfo)
			},
      async handleUpdateUserInfo(userInfo) {
				try {
					const { url } = await this.$http.post('/file/upload', {
						fileContent: userInfo.avatar,
						fileName: `${userInfo.nickname}用户头像`
					})
					await this.$http.post('/wechat/user/patchUserInfo', {
						nickName: userInfo.nickname,
						headImgUrl: url
					})
					uni.showToast({ title: '更新成功', icon: 'none' })
					// 更新本地用户信息
					if (url) {
						this.userInfo.headImgUrl = url;
					}
					if (userInfo.nickname) {
						this.userInfo.nickName = userInfo.nickname;
					}
				} catch (error) {
					uni.showToast({ title: '更新失败', icon: 'none' })
				}
			},
    },
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>