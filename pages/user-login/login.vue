<template>
	<view>
		登陆
	</view>
</template>

<script setup>
import { onMounted } from 'vue';

const getUserProfile = () => {
	uni.getUserProfile({
	  desc: '用于完善用户资料', // 必填，用户授权原因
	  success: (res) => {
	    const userInfo = res.userInfo; // 用户信息
	    console.log('用户信息:', userInfo);
	  },
	  fail: (err) => {
	    console.error('授权失败:', err);
	    uni.showToast({ title: '授权失败', icon: 'none' });
	  }
	});
}

onMounted(
	getUserProfile()
)
</script>

<style>
	       
</style>
