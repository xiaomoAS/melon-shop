

//定义公用方法
/**
 * H5唤醒APP
 * @param {string} urls_android 安卓跳转链接
 * @param {string} urls_ios IOS跳转链接
 */

const openApp=function(urls_android='',urls_ios=''){
	var u = navigator.userAgent;
	var isWeixin = u.toLowerCase().indexOf('micromessenger') !== -1; // 微信内
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端
	var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				
	// 微信内
	if (isWeixin) {
		uni.showToast({
			title: '请在浏览器上打开',
			icon: 'none'
		})
		return;
	} else {
		//android端
		if (isAndroid) {
			//安卓app的scheme协议
			// window.location.href = 'hlb://url=/pages/product/info&zsid=261&id=1'; 
			window.location.href = 'hlb://';
			setTimeout(function() {
				let hidden =
					window.document.hidden ||
					window.document.mozHidden ||
					window.document.msHidden ||
					window.document.webkitHidden;
				if (typeof hidden == 'undefined' || hidden == false) {
					//应用宝下载地址 (emmm 找不到淘宝应用宝的地址，这里放的是 lucky coffee 地址)
					window.location.href = urls_android;
				}
			}, 3000);
		}
		//ios端
		if (isIOS) {
			//ios的scheme协议
			window.location.href = 'hlb://';
			setTimeout(function() {
				let hidden =
					window.document.hidden ||
					window.document.mozHidden ||
					window.document.msHidden ||
					window.document.webkitHidden;
				if (typeof hidden == 'undefined' || hidden == false) {
					//App store下载地址
					window.location.href = urls_ios; //http://itunes.apple.com/app/id387682726
				}
			}, 3000);
		}
	}
}


//输出
export default{
    openApp
}