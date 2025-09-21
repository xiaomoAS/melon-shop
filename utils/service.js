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
		'Token': uni.getStorageSync('token'),
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
		
		switch (response.data.error_code) {
			case 200:
				break
			case 401:
				const config = response.config
				let newToken;
				if (!isRefreshing) {
					isRefreshing = true
					return uni.request({
						url: baseURL + '/api/v1/Jwtapi/refreshToken',
						method: 'POST',
						header: {
							'token': token,
							'refresh-token': refresh_token
						}
					}).then(res => {
						console.log('重新获取token');
						if (res.data && res.data.code == 41000) {
							//有值，并且状态码是 41000，表示重新生成了token，否者就删除token
							newToken = uni.setStorageSync('token', res.data.token);

							//这里可以把 refresh_token 一起重新存（也可以不存，到期后重新登录）
							newToken = uni.setStorageSync('refresh_token', res.data.refresh_token);
							console.log('token重新生成，成功');
						} else {
							console.log('token过期，重新登录');
							uni.showToast({
								title: '令牌过期，请重新登录！',
								icon: 'error',
								success() {
									setTimeout(function() {
										//这里是要执行的方法或者代码
										uni.removeStorageSync('token');
										uni.removeStorageSync('refresh_token');
										uni.navigateTo({
											url: '/pages/user_login/login/login'
										})
									}, 2000) //延迟时间，1000是1秒
								}
							});
						}


						return http.request(config)
						requests.forEach(cb => cb(newToken))
						requests = []

					}).finally(() => {
						isRefreshing = false
					})
				} else {
					return new Promise((resolve) => {
						requests.push((newToken) => {
							// config.header.Authorization = newToken
							config.header.token = newToken
							resolve(http.request(config))
						})
					})
				}

				return Promise.reject(response)

			case 431:
				uni.showModal({
					title: '提示',
					content: response.data.msg ? response.data.msg : '账号已在其他地方登录！',
					showCancel: false, //是否显示取消按钮，默认为 true
					success: function(res) {
						console.log(res)
						if (res.confirm) {
							// console.log('用户点击确定');
							//账号在别的地方登录，清空token
							uni.removeStorageSync('token');
							uni.removeStorageSync('refresh_token');

							uni.navigateTo({
								url: '/pages/user_login/login/login'
							})

						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
				return Promise.reject(response)
			default:
				break
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