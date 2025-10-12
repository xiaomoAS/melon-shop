<template>
	<uni-popup ref="popup" class="charge-popup" type="dialog" :safe-area="false" background-color="#ffffff">
		<uni-popup-dialog 
			mode="input" 
			class="charge-dialog"
			title="充值"
			confirmText="立即充值"
			cancelText="取消"
			placeholder="请输入充值金额"
			:before-close="true"
			@confirm="handleRecharge"
			@close="handleClose"
		>
			<template v-slot:default>
				<view class="recharge_content">
					<!-- 用户信息区域 -->
					<view class="user_inf_cont">
						<view class="user_inf_head">
							<view class="ava">
								<image :src="userInfo.headImgUrl || 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1f25a32b4b97447bac8d02f20f0a47b6/user_ava.png?Expires=2073952610&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=IQflZdBMbA4jh2W7oui1vmaxPuU%3D'" mode="aspectFit"></image>
							</view>
							<view class="inf_cont">
								<view class="name">{{ userInfo.nickName || '微信用户' }}</view>
							</view>
						</view>
						<view v-if="memberConfig" class="member_bit_inf">
							<view class="lv">
								当前身份: 
								<image class="i" :src="memberConfig.mainIcon" mode="widthFix"></image> 
								{{ memberConfig.title }}
							</view>
						</view>
						<view class="balance">当前会员折扣：<text>{{ memberInfo.discount * 10 }}折</text></view>
						<view class="balance">会员余额: <text>{{ memberInfo.remainPrice }}元</text></view>
					</view>
					
					<!-- 会员套餐选择 -->
					<view class="member_last_cont">
						<view 
							v-for="item in showMemberPackages" 
							class="list" 
							:class="{ active: selectedPackage === item.level }"
							:key="item.level"
							@click="selectPackage(item)"
						>
							<view class="tle">{{ item.title }}</view>
							<view class="price">￥ <text>{{ item.price }}</text></view>
							<view class="cumulative-price">（已累计￥ {{ memberInfo.currentValue }}）</view>
							<view class="bits">{{ item.discount }}</view>
						</view>
					</view>
					
					<!-- 自定义充值金额区域 -->
					<view class="custom_amount_section">
						<view class="section_title">充值金额</view>
						<view class="amount_input_container">
							<view class="currency_symbol">￥</view>
							<input
								class="amount_input"
								type="digit"
								v-model="customAmount"
								placeholder="请输入充值金额"
								@input="handleAmountInput"
							/>
						</view>
					</view>
				</view>
			</template>
		</uni-popup-dialog>
	</uni-popup>
</template>

<script>
import { memberConfigs } from '@/pages/personal/constants.js'
import { MEMBER_LEVEL } from '@/constants/common.js'

export default {
	name: 'Recharge',
	options: {
    styleIsolation: 'shared'
  },
	data() {
		return {
			customAmount: '',
			selectedPackage: -1, // -1表示未选择套餐，使用自定义金额
			memberInfo: {},
			userInfo: {},
			memberPackages: [
				{
					level: MEMBER_LEVEL.GOLD,
					title: '黄金会员',
					price: 1000,
					discount: '享9.6折'
				},
				{
					level: MEMBER_LEVEL.PLATINUM,
					title: '铂金会员',
					price: 5000,
					discount: '享9.5折'
				},
				{
					level: MEMBER_LEVEL.DIAMOND,
					title: '钻石会员',
					price: 10000,
					discount: '享9.3折'
				}
			]
		}
	},
	computed: {
		memberConfig() {
			if (!this.memberInfo || !this.memberInfo.level) return null
			return memberConfigs[this.memberInfo.level]
		},
		showMemberPackages() {
			return this.memberPackages.filter(item => item.level > this.memberInfo.level)
		}
	},
	methods: {
		// 打开弹窗
		open() {
			this.customAmount = ''
			this.selectedPackage = -1
			this.getMemberInfo()
			this.getUserInfo()
			this.$refs.popup.open('center')
		},
		// 关闭弹窗
		close() {
			this.$refs.popup.close()
		},
		async getUserInfo() {
			try {
				this.userInfo = await this.$http.post('/wechat/user/getUserInfo', {})
			} catch (error) {
				this.userInfo = {}
			}
		},
		async getMemberInfo() {
			try {
				this.memberInfo = await this.$http.post('/user/member/getUserMember', {})
			} catch (error) {
				this.memberInfo = {}
			}
		},
		// 选择套餐
		selectPackage(item) {
			this.selectedPackage = item.level
			this.customAmount = Math.ceil(((item.price || 0) - (this.memberInfo.currentValue || 0)) * 100) / 100
		},
		
		// 处理自定义金额输入
		handleAmountInput(e) {
			let value = e.detail.value
			// 只允许输入数字
			value = value.replace(/[^\d]/g, '')
			// 防止以0开头（除了单独的0）
			if (value.length > 1 && value.startsWith('0')) {
				value = value.substring(1)
			}
			// 确保是正整数，空值或0都清空
			if (value === '0' || value === '') {
				value = ''
			}
			this.$nextTick(() => {
				this.customAmount = value
				// 匹配套餐
				const packageItem = this.showMemberPackages.findLast((item) => (Number(value) + (this.memberInfo.currentValue || 0)) >= item.price)
				this.selectedPackage = packageItem ? packageItem.level : -1
			})
		},
		// 确认充值
		async handleRecharge(value) {
			try {
				if (!this.customAmount || isNaN(this.customAmount) || Number(this.customAmount) <= 0) {
					uni.showToast({
						title: '请输入有效的充值金额',
						icon: 'none'
					})
					return
				}
				const data = await this.$http.post('/order/createMemberOrder', { totalPrice: String(this.customAmount) })
				let that = this
				wx.requestPayment
				(
				  {
				    "timeStamp": `${Math.floor(Date.now() / 1000)}`,
				    "nonceStr": data.nonceStr,
				    "package": data.packageStr,
				    "signType": data.signType,
				    "paySign": data.paySign,
				    "success":function(res){
						console.log('成功', res)
						let startTime = Date.now()
						const intervalId = setInterval(async () => {
						    try {
						        const res = await that.$http.post('/order/queryWechatPay', { orderId: data.orderId })
						        // 充值成功
						        if (res.orderStatus === PAY_STATUS.SUCCESS) {
									uni.showToast({ title: '充值成功', icon: 'none' })
									that.$emit('success')
									that.close()
						            return
						        }
						        if (Date.now() - startTime >= 10000) {
									uni.showToast({ title: '充值超时' , icon: 'none'})
						            clearInterval(intervalId) // 超过10秒也停止轮询
						        }
						    } catch (error) {
						        uni.showToast({ title: '充值失败' , icon: 'none'})
						        clearInterval(intervalId) // 出错也停止轮询
						    }
						}, 1000); // 例如每1秒轮询一次
					},
				    "fail":function(res){
						console.log('失败', res)
						uni.showToast({ title: '充值失败' , icon: 'none'})
					},
				    "complete":function(res){
						console.log('完成', res)
					}
				  }
				)
			} catch (error) {
				console.log(error)
			}
			
		},
		// 关闭弹窗
		handleClose() {
			this.$emit('close')
			this.close()
		}
	}
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.charge-popup {
	.uni-popup__wrapper {
		background: transparent!important;
		border-radius: 10rpx!important;
	}
	
	.uni-popup-dialog {
		background: linear-gradient(180deg, #60C45D -122.66%, #FFFFFF 55.4%)!important;
	}
}
.charge-dialog .uni-dialog-content {
	padding: 0!important;
}
</style>