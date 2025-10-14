import Request from '@/utils/luch-request/index.js'

const baseURL = 'https://www.melon-bamboo.com';
// if (process.env.NODE_ENV === 'development') {
// 	// 开发环境
// 	// var baseURL = 'http://127.0.0.1:4523/m1/6785558-6497977-default'; //域名(网站启动时的域名)，目前用这个 js（【注意】记住改manifest.josn 源码视图中的h5配置）
// } else {
// 	// 生产环境
// 	var baseURL = '101.201.111.162'; //域名(网站启动时的域名)，目前用这个 js
// }

const http = new Request()


// setConfig 这里只会执行一次。
http.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = baseURL
	config.header = {
		...config.header,
	}
	return config
})

// 请求拦截
http.interceptors.request.use((config) => { // 可使用async await 做异步操作

	//是否显示等待框
	let show = config.custom.show ? config.custom.show : false;
	if (show) {
		let title_name = show != true ? show : "";
		uni.showLoading({
			title: title_name,
			mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false
		});
	}

	config.header = {
		...config.header,
		'wechat_token': uni.getStorageSync('token'),
	}
	return config
}, (err) => {
	return Promise.reject(err)
})

// 防止重复刷新标志位
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// 响应拦截 
http.interceptors.response.use((response) => {
	const token = uni.getStorageSync('token')
	const refresh_token = uni.getStorageSync('refresh_token')
	if (response) {
		console.log('封装后 结果（1）：', response)
		
		//是否取消显示等待框
		let show = response.config.custom.show ? response.config.custom.show : false;
		if (show) {
			uni.hideLoading();
		}
		
		switch (response.data.code) {
			case 200:
				return Promise.resolve(response.data.data)
			case 401:
				const pages = getCurrentPages()
				const currentPage = pages[pages.length - 1]
				const currentPagePath = currentPage.$page.fullPath
				console.log('currentPagePathxxx', Object.prototype.toString.call(currentPagePath).split(' ')[1].split(']')[0], '===', currentPagePath);
				uni.navigateTo({
					url: `/pages/user-login/index?returnUrl=${encodeURIComponent(currentPagePath)}`
				})
				return Promise.reject(response)
			default:
				uni.showToast({ title: response.data.msg, icon: 'none' })
				return Promise.reject(response)
		}
	}

	//完全成功，返回数据
	return response['data']
}, err => {
	return Promise.reject(err)
})

export {
	http,
	baseURL
}