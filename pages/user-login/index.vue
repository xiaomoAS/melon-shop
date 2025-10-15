<template>
	<view class="login-container">
		<view class="login-box">
			<view class="logo">
				<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4cba2ff43c034c16aab096a3d322ee2e/orange-logo%20%281%29.png?Expires=2073975970&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=svCx34i6wBqlgJ1PYCcMbpAby3c%3D" mode="aspectFit"></image>
			</view>
			<view class="title">欢迎使用</view>
			<view class="subtitle">请授权登录以获得更好的体验</view>
			
			<button 
				class="login-btn" 
				:loading="loading"
				:disabled="loading"
				@click="handleLogin"
			>
				{{ loading ? '登录中...' : '微信一键登录' }}
			</button>
			
			<view v-if="errorMsg" class="error-msg">
				{{ errorMsg }}
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { http } from '@/utils/service.js'

const loading = ref(false)
const errorMsg = ref('')
const returnUrl = ref(null)

onLoad((options) => {
	returnUrl.value = options.returnUrl ? decodeURIComponent(options.returnUrl) : null
})

// 登录按钮点击事件
const handleLogin = async () => {
	try {
		loading.value = true;
		errorMsg.value = '';
		
		// 1. 获取用户信息（会弹出授权窗口）
		const userInfo = await getUserProfile()
		
		// 2. 获取登录凭证
		const loginRes = await wxLogin();
		
		// 3. 发送到后端验证
		await sendLoginRequest({
			code: loginRes.code,
			userInfo: userInfo.userInfo
		});
		
	} catch (error) {
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
			if (returnUrl.value.includes('/pages/get-coupon/index')) {
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
