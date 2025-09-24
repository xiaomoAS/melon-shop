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
				@click="handleLogin"
				:loading="loading"
				:disabled="loading"
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
import { ref, onMounted } from 'vue';

const loading = ref(false);
const errorMsg = ref('');

// 自动登录
onMounted(() => {
	// console.log('登录页面加载完成，开始自动登录...');
	// autoLogin();
});

// 登录按钮点击事件
const handleLogin = async () => {
	try {
		loading.value = true;
		errorMsg.value = '';
		
		// 1. 获取用户信息（会弹出授权窗口）
		const userInfo = await getUserProfile();
		console.log('获取用户信息成功:', userInfo);
		
		// 2. 获取登录凭证
		const loginRes = await wxLogin();
		console.log('获取登录凭证成功:', loginRes);
		
		// 3. 发送到后端验证
		await sendLoginRequest({
			code: loginRes.code,
			userInfo: userInfo.userInfo
		});
		
	} catch (error) {
		console.error('登录失败:', error);
		loading.value = false;
		if (error.errMsg && error.errMsg.includes('deny')) {
			errorMsg.value = '需要授权才能登录';
		} else {
			errorMsg.value = '登录失败，请重试';
		}
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
	// 这里替换为你的实际API地址
	const apiUrl = 'https://www.melon-bamboo.com/wechat/user/code2Session';
	
	try {
		const res = await uni.request({
			url: apiUrl,
			method: 'POST',
			data: {
				code: data.code,
			}
		});
		
		console.log('后端登录响应:', res);
		
		if (res.data && res.data.success) {
			// 登录成功
			uni.showToast({
				title: '登录成功',
				icon: 'success'
			});
			
			// 保存用户信息到本地
			// uni.setStorageSync('userInfo', res.data.userInfo);
			uni.setStorageSync('token', res.data.data.token);
			
			// 跳转到首页
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}, 1500);
		} else {
			throw new Error(res.data.message || '登录失败');
		}
	} catch (error) {
		console.error('后端登录失败:', error);
		throw error;
	}
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
