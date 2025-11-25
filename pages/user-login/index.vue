<template>
	<view class="login-container">
		<view class="login-box">
			<view class="logo">
				<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/da449df52fc542dc9750403211634c3a/yuguo_logo%20%281%29.png?Expires=2076054860&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=MD4eu2NbpcKOFbv7%2BtjyfdHlctI%3D" mode="aspectFit"></image>
			</view>
			<view class="title">欢迎使用</view>
			<view class="subtitle">请授权登录以获得更好的体验</view>
			
			<button 
				class="login-btn" 
				:loading="loading"
				:disabled="loading"
				@click="handleLogin"
			>
				{{ loading ? '登录中...' : '一键登录' }}
			</button>
			
			<view v-if="errorMsg" class="error-msg">
				{{ errorMsg }}
			</view>
		</view>

		<UserPrivacy ref="userPrivacyRef" :privacyName="privacyInfo.privacyContractName"/>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { http } from '@/utils/service.js'
import UserPrivacy from '@/components/user-privacy/index.vue'

const loading = ref(false)
const errorMsg = ref('')
const returnUrl = ref(null)
const userPrivacyRef = ref()
const privacyInfo = ref({})
// 需要返回的页面
const needReturnPages = [
	'/pages/get-coupon/index',
	'/pages/sendCoupon/index',
	'/pages/middle-pages/'
]

onLoad((options) => {
	returnUrl.value = options.returnUrl ? decodeURIComponent(options.returnUrl) : null
})

/**
 * @description: 是否需要获取用户隐私
 */
const getPrivacySetting = async () => {
	return new Promise((resolve, reject) => {
		wx.getPrivacySetting({
      success: res => {
        // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
				privacyInfo.value = res
				resolve(res)
      },
      fail: (res) => {
				reject(res)
			},
      complete: () => {}
    })
	})
}

// 登录按钮点击事件
const handleLogin = async () => {
	try {
		errorMsg.value = ''
		// 1. 获取用户信息
		const userInfo = await getUserProfile()

		// 2.是否同意协议
		getPrivacySetting()
		const agree = await userPrivacyRef.value.open()
		if (!agree) return

		loading.value = true
	
		// 3. 获取登录凭证
		const loginRes = await wxLogin()
		// 4. 发送到后端验证
		await sendLoginRequest({
			code: loginRes.code,
			userInfo: userInfo.userInfo
		});
		
	} catch (error) {
		console.log('error', Object.prototype.toString.call(error).split(' ')[1].split(']')[0], '===', error);
		loading.value = false
		errorMsg.value = '登录失败，请重试'
	}
};

// 获取用户信息
const getUserProfile = () => {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			desc: '用于完善用户资料',
			success: resolve,
			fail: reject
		});
	});
};

// 微信登录
const wxLogin = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: resolve,
			fail: reject
		});
	});
};

// 发送登录请求到后端
const sendLoginRequest = async (data) => {
  try {
    const { token } = await http.post('/wechat/user/code2Session', {
        code: data.code
    })

		// 登录成功
		uni.showToast({
			title: '登录成功',
			icon: 'success'
		})
		
		// 保存用户信息到本地
		uni.setStorageSync('token', token)
		
		// 跳转到原来页面
		setTimeout(() => {
			if (needReturnPages.some((url) => returnUrl.value.includes(url))) {
				uni.redirectTo({ url: returnUrl.value })
			} else {
				uni.switchTab({ url: '/pages/index/index' })
			}
		}, 500)
	} catch (error) {
		console.error('后端登录失败:', error)
	}
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
