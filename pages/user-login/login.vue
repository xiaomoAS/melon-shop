<template>
	<view class="login-container">
		<view class="login-box">
			<view class="logo">
				<image src="/static/logo.png" mode="aspectFit"></image>
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
			throw new Error(res.data?.message || '登录失败');
		}
	} catch (error) {
		console.error('后端登录失败:', error);
		throw error;
	}
};
</script>

<style>
.login-container {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx;
}

.login-box {
	background: white;
	border-radius: 20rpx;
	padding: 80rpx 60rpx;
	text-align: center;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	width: 100%;
	max-width: 600rpx;
}

.logo {
	margin-bottom: 40rpx;
}

.logo image {
	width: 120rpx;
	height: 120rpx;
}

.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 60rpx;
}

.login-btn {
	width: 100%;
	height: 88rpx;
	background: #07c160;
	color: white;
	border-radius: 44rpx;
	font-size: 32rpx;
	border: none;
	margin-bottom: 40rpx;
}

.login-btn:active {
	background: #06ad56;
}

.login-btn[disabled] {
	background: #cccccc;
}

.error-msg {
	color: #ff4757;
	font-size: 28rpx;
	margin-top: 20rpx;
}
</style>
