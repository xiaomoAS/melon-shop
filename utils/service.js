import Request from '@/utils/luch-request/index.js'

const HOSTS = {
	develop: 'https://www.melon-bamboo.com',   // 本地开发环境
	// https://www.melon-bamboo.fun
	trial: 'https://www.melon-bamboo.fun', // 体验版环境
	prod: 'https://www.melon-bamboo.com', // 线上环境
};

// 获取环境版本，添加兼容性处理
let envVersion = 'prod';
try {
  if (wx && wx.getAccountInfoSync && wx.getAccountInfoSync().miniProgram) {
    envVersion = wx.getAccountInfoSync().miniProgram.envVersion || 'prod';
  }
} catch (error) {
  console.warn('获取小程序环境信息失败:', error);
  // 默认使用线上环境
  envVersion = 'prod';
}

let baseUrl = "";
switch (envVersion) {
    case 'develop':
			// 本地开发
      baseUrl = `${HOSTS.develop}`;
      break;
    case 'trial':
			// 体验版
      baseUrl = `${HOSTS.trial}`;
      break;
    case 'release':
			// 线上
      baseUrl = `${HOSTS.prod}`;
      break;
    default:
      baseUrl = `${HOSTS.prod}`;
      break;
}

const http = new Request()


// setConfig 这里只会执行一次。
http.setConfig((config) => {
	/* 设置全局配置 */
	config.baseUrl = baseUrl
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
				// 使用 route + options 重新构建URL，避免双重编码
				const currentRoute = currentPage.route
				const currentOptions = currentPage.options
				let currentPagePath = `/${currentRoute}`
				
				// 如果有查询参数，手动拼接
				if (currentOptions && Object.keys(currentOptions).length > 0) {
					const queryString = Object.keys(currentOptions)
						.map(key => `${key}=${currentOptions[key]}`)
						.join('&')
					currentPagePath += `?${queryString}`
				}
				
				console.log('currentPagePathxxx', Object.prototype.toString.call(currentPagePath).split(' ')[1].split(']')[0], '===', currentPagePath);
				uni.reLaunch({
					url: `/pages/user-login/index?returnUrl=${encodeURIComponent(currentPagePath)}`
				})
				return Promise.reject(response)
			default:
				// 根据config配置决定使用modal还是toast
				const showModalMsg = response.config.custom.showModalMsg || false;
				
				if (showModalMsg) {
					uni.showModal({
						title: '提示',
						content: response.data.msg,
						showCancel: false
					})
				} else {
					uni.showToast({ title: response.data.msg, icon: 'none', duration: 3000 })
				}
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
	baseUrl
}