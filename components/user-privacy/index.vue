<template>
  <view class="privacy-box">
		<uni-popup ref="popup" class="privacy-popup" :is-mask-click="false">
			<view class="popup-box">
				<view class="popup-box__title">
					隐私指引弹窗
				</view>
				<view >
					在您使用钰果日记小程序前，请仔细阅读<text class="popup-box__protocal" @click="downloadFile(serviceFileUrl)">《钰果日记服务协议》</text>、<text class="popup-box__protocal" @click="downloadFile(privacyUrl)">{{ privacyName }}</text>。
					如您同意上述协议，请点击“同意”开始使用。
				</view>
				<view class="btn-group">
					<button class="btn-group__btn" size="mini" @click="refuse">拒绝</button>
					<button id="agree-btn" class="btn-group__btn" size="mini" open-type="agreePrivacyAuthorization"
						@agreeprivacyauthorization="handleAgreePrivacyAuthorization" type="primary">同意</button>
				</view>
			</view>
		</uni-popup>
  </view>
</template>

<script>
export default {
	data() {
		return {
      resolvePrivacyAuthorization: null,
      serviceFileUrl: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/f2b83a28e1a444db82d0a68221f2e8ef/%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf?Expires=2077154603&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=olm2%2BanhrA7BX55W9WR87Yr7Stc%3D',
      privacyUrl: 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/a4160852ae7b433dac9bdec8c2150c11/%E9%92%B0%E6%9E%9C%E6%97%A5%E8%AE%B0%E7%94%9F%E9%B2%9C%20%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4%E6%8C%87%E5%BC%95.pdf?Expires=2077164837&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=EyHvwzRfQcslXpGQk02RtMYOSEI%3D',
      privacyPromise: null,
      privacyPromiseResolve: null,
      privacyPromiseReject: null,
		}
	},
  props: {
    privacyName: {
      type: String,
      default: '《钰果日记生鲜小程序隐私保护指引》'
    }
  },
	onLoad() {
		wx.onNeedPrivacyAuthorization(resolve => {
			console.log("done123");
			this.resolvePrivacyAuthorization = resolve
		})
	},
	methods: {
    downloadFile(fileUrl) {
      // 使用uni.downloadFile下载文件
      uni.downloadFile({
        url: fileUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            // 处理PDF文件
            uni.openDocument({
							filePath: res.tempFilePath,
							showMenu: true, // 右上角菜单，可以进行分享保存pdf
							success: function(file) {
								console.log("文件打开成功", file)
							}
						})
          } else {
            uni.showToast({
              title: '下载失败',
              icon: 'none'
            })
          }
        },
        fail: () => {
          uni.showToast({
            title: '下载失败',
            icon: 'none'
          })
        },
        complete: () => {
        }
      })
    },
		openPrivacyPolicy() {
			wx.openPrivacyContract()
		},
		handleAgreePrivacyAuthorization() {
			console.log("用户点击同意授权", this.resolvePrivacyAuthorization);
      if (this.resolvePrivacyAuthorization) {
        this.resolvePrivacyAuthorization({
          buttonId: 'agree-btn',
          event: 'agree'
        })
      }
			this.$refs.popup.close()
      if (this.privacyPromiseResolve) {
        this.privacyPromiseResolve(true)
      }
		},
		refuse() {
			console.log("不同意")
      if (this.resolvePrivacyAuthorization) {
        this.resolvePrivacyAuthorization({
          event: 'disagree'
        })
      }
      this.$refs.popup.close()
      if (this.privacyPromiseResolve) {
        this.privacyPromiseResolve(false)
      }
		},
    open() {
      this.$refs.popup.open('center')
      const promise = new Promise((resolve, reject) => {
        this.privacyPromiseResolve = resolve
        this.privacyPromiseReject = reject
      })
      this.privacyPromise = promise
      return promise
    }
	}
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>