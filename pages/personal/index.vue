<template>
	<view class="contain">
		<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/7c852fc463c344348df49a3e3a006d71/index_head_bg%20%282%29%20%281%29.png?Expires=2074056139&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=5zEIf4pNQpbjKLSFv9Ns3kzcWMc%3D" class="index_head_bg" mode="widthFix"></image>
		<view class="user_head_bg">
			我的
		</view>
		<!-- 头像 -->
		<UserProfile ref="userProfileRef" @updateUserInfo="updateUserInfo" />

		<!-- 会员信息 -->
		<view v-if="memberConfig" class="user_member_cont" :class="memberConfig.mainClass">
			<image class="icon-image" :src="memberConfig.mainIcon" mode="widthFix"></image>
			<view class="lv_tips">当前等级</view>
			<view class="level-icons">
				<view class="lv_inf">
					<view class="txt level-normal">{{ memberConfig.title }}</view>
					<view v-if="memberInfo.level !== MEMBER_LEVEL.NORMAL" class="plus">PLUS</view>
				</view>
			</view>
			
			<view class="lv_txt">
				<view v-if="memberInfo.level !== MEMBER_LEVEL.NORMAL && memberInfo.discount">会员享整单{{ memberInfo.discount * 10 }}折优惠</view>
			</view>
			<view class="lv_exp_cont">
				<view class="exp_head">
					<view class="exp"><text class="text">{{ memberInfo.currentValue || 0 }}</text>经验值</view>
					<view class="exp_head_left">
						<view class="text">账户余额：{{ memberInfo.remainPrice }}</view>
						<view class="up_btn" @click="chargeHandler">
							<view v-if="memberInfo.level === MEMBER_LEVEL.NORMAL">开通会员</view>
							<view v-else>充值</view>
							<uni-icons class="btn-icon" type="right" size="12" :color="memberConfig.mainColor"></uni-icons>
						</view>
					</view>
				</view>
				<view class="exp_line">
					<view class="ing" :style="{ width: expProgressWidth }"></view>
				</view>
			</view>
		</view>

		<view class="user_adres_cont">
			<view class="user_pulic_title">
				<view class="tle">我的地址</view>
				<navigator url="/pages/address-manage/index" class="adres_seet">
					<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/cbed39577d3e4c0f862232df5de30774/user_i_3.png?Expires=2073952571&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=iXZXfQ0WG%2FYvSILjOZHqLAyWJ%2FM%3D" mode="widthFix"></image>
					地址管理
				</navigator>
			</view>
			<view v-if="defaultAddress" class="adres_deta_list">
				<view class="title">
					<view class="tip defa">默认</view>
					{{ defaultAddress.receiver }}  {{ defaultAddress.mobile }}
				</view>
				<view class="txt">{{ defaultAddress.province }} {{ defaultAddress.city }} {{ defaultAddress.district }} {{ defaultAddress.detail }}</view>
			</view>
			<view v-else class="adres_deta_list">
				<view class="txt">暂无默认收货地址，请先去地址管理页面添加默认收货地址</view>
			</view>
		</view>
		<view class="user_coupon_cont">
			<view class="user_pulic_title">
				<view class="tle">我的优惠券</view>
				<view class="all-button" @click="toMyCoupon">
					<text>全部</text>
					<uni-icons type="right" size="12"></uni-icons>
				</view>
			</view>
			<CouponList ref="couponListRef" :expired-type="EXPIRED_TYPE.VALID"></CouponList>
		</view>

		<view class="user_bits_txt">
			<view class="txt">如果您有问题，可以电话联系<text class="phone-text" @click="phoneHandler">18612655137</text>,我们将高效解决！您还可以在我们未覆盖区域当团长，挣佣金！</view>
			<view class="bit_dl">
				<view class="dt">工作日：09:00-18:00</view>
				<view class="dd">客栈热线&nbsp;<text class="phone-text" @click="phoneHandler">18612655137</text></view>
			</view>
		</view>

		<view v-if="!userInfo.teamLeader && !userInfo.teamUser" class="bottom-button" @click="openArticleHandler">我要当团长!</view>
		<view v-if="userInfo.teamLeader" class="bottom-button" @click="toGroupLeaderPage">切换团长端</view>
		<view v-if="userInfo.teamUser" class="bottom-button" @click="withdrawhandler">我要退团</view>

		<Recharge ref="rechargeRef" @success="getMemberInfo"></Recharge>
	</view>
</template>

<script>
	import Recharge from '@/components/recharge/index.vue'
	import CouponList from '@/components/coupon-list/index.vue'
	import { MEMBER_LEVEL } from '@/constants/common.js'
	import UserProfile from '@/components/user-profile/index.vue'
	import { memberConfigs } from './constants'
	import { EXPIRED_TYPE } from '../../components/coupon-list/constants'

	export default {
		components: {
			Recharge,
			CouponList,
			UserProfile
		},
		data() {
			return {
				defaultAddress: null,
				MEMBER_LEVEL,
				memberInfo: {
					level: 0,
					currentValue: 0,
					currentLevelMaxValue: 0,
					discount: 0
				},
				EXPIRED_TYPE,
				userInfo: {},
			}
		},
		computed: {
			expProgressWidth() {
				if (!this.memberInfo.currentLevelMaxValue || this.memberInfo.currentLevelMaxValue === 0) {
					return '0%'
				}
				const progress = (this.memberInfo.currentValue / this.memberInfo.currentLevelMaxValue) * 100
				return Math.min(progress, 100) + '%'
			},
			memberConfig() {
				if (!this.memberInfo || !this.memberInfo.level) return null
				return memberConfigs[this.memberInfo.level]
			}
		},
		onShareAppMessage() {
			return {
				path: '/pages/index/index'
			}
		},
		onShareTimeline() {
			return {
				path: '/pages/index/index'
			}
		},
		methods: {
			updateUserInfo(val) {
				this.userInfo = val;
			},
			phoneHandler() {
				wx.makePhoneCall({
					phoneNumber: '18612655137',
					success(res) {
						console.log('拨打电话成功', res);
					},
					fail(err) {
						console.error('拨打电话失败', err);
					}
				});
			},
			openArticleHandler() {
				wx.openOfficialAccountArticle({
				  url: 'https://mp.weixin.qq.com/s/Yf5adowfIkBW5KMBoD4TNw'
				})
			},
			toGroupLeaderPage() {
				// 跳转团长端
				uni.navigateTo({ url: '/pages/group-leader/index' })
			},
			withdrawhandler() {
				// 退团
				try {
					uni.showModal({
					title: '',
					content: '确认退团吗?',
					success: async (res) => {
						if (res.confirm) {
							await this.$http.post('/team/user/delete', {
								userId: this.userInfo.teamUser.userId,
								leaderId: this.userInfo.teamUser.leaderId
							})
							uni.showToast({ title: '退团成功', icon: 'none' })
							const timer = setTimeout(() => {
								uni.reLaunch({ url: '/pages/personal/index' })
								clearTimeout(timer)
							}, 1000);
						} else if (res.cancel) {}
					}
				})
				} catch (error) {
					
				}
			},
			chargeHandler() {
				this.$refs.rechargeRef.open()
			},
			async getMemberInfo() {
				try {
					this.memberInfo = await this.$http.post('/user/member/getUserMember', {})
				} catch (error) {
					this.memberInfo = {}
				}
			},
			async getAddressInfo() {
				try {
					const list = await this.$http.post('/address/list', {})
					this.defaultAddress = list.find((item) => item.isDefault)
				} catch (error) {
					this.defaultAddress = null
				}
			},
			toMyCoupon() {
				uni.navigateTo({ url: '/pages/my-coupon/index' })
			},	
		},
		onShow() {
			this.getAddressInfo()
			this.getMemberInfo()
			this.$nextTick(() => {
				this.$refs.userProfileRef && this.$refs.userProfileRef.getUserInfo()
				this.$refs.couponListRef && this.$refs.couponListRef.getCouponList(true)
			})
		}
	}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>