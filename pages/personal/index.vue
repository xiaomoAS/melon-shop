<template>
	<view class="contain">
		<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/7c852fc463c344348df49a3e3a006d71/index_head_bg%20%282%29%20%281%29.png?Expires=2074056139&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=5zEIf4pNQpbjKLSFv9Ns3kzcWMc%3D" class="index_head_bg" mode="widthFix"></image>
		<view class="user_head_bg">
			我的
		</view>
		<view class="user_inf_content">
			<UploadProfile @updateUserInfo="handleUpdateUserInfo">
				<view class="ava_inf">
					<view class="tips_txt">点击头像上传个人信息</view>
					<view class="ava"><image :src="userInfo.headImgUrl || 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1f25a32b4b97447bac8d02f20f0a47b6/user_ava.png?Expires=2073952610&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=IQflZdBMbA4jh2W7oui1vmaxPuU%3D'" mode=""></image> </view>
				</view>
			</UploadProfile>
			<view class="deta_inf">
				<view class="name">{{ userInfo.nickName || '微信用户' }}</view>
			</view>
		</view>
		<!-- 会员信息 -->
		<view v-if="memberConfig" class="user_member_cont" :class="memberConfig.mainClass">
			<image class="lv0_tips_ico" :src="memberConfig.mainIcon" mode="widthFix"></image>
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
					<view class="exp"><text>{{ memberInfo.currentValue || 0 }}</text>经验值</view>
					<view class="up_btn" v-show="memberInfo.level === MEMBER_LEVEL.NORMAL">
						<view v-if="memberInfo.level === MEMBER_LEVEL.NORMAL">开通会员</view>
						<view v-else>充值</view>
						<uni-icons class="btn-icon" type="right" size="12" :color="memberConfig.mainColor"></uni-icons>
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
			<CouponList></CouponList>
		</view>
		<!-- TODO: 文案 -->
		<view class="user_bits_txt">
			<view class="txt">如果您有问题，可以电话联系XXX,我们将高效解决！</view>
			<view class="bit_dl">
				<view class="dt">工作日：09:00-18:00</view>
				<view class="dd">客栈热线 xxxxxx</view>
			</view>
		</view>

		<view class="pulic_dc_bg" v-show="dczt"></view>
		<!-- <re-charge ref="Recharge" v-show="dczt"></re-charge> -->
	</view>
</template>

<script>
	// import Recharge from '@/components/Recharge/Recharge.vue'
	import UploadProfile from '@/components/upload-profile/index.vue'
	import CouponList from '@/components/coupon-list/index.vue'
	import { MEMBER_LEVEL } from '@/constants/common.js'
	import { memberConfigs } from './constants'

	export default {
		components: {
			// Recharge,
			UploadProfile,
			CouponList
		},
		data() {
			return {
				dczt:false,
				userInfo: {},
				defaultAddress: null,
				MEMBER_LEVEL,
				memberInfo: {
					level: 0,
					currentValue: 0,
					currentLevelMaxValue: 0,
					discount: 0
				},
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
		methods: {
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
			async handleUpdateUserInfo(userInfo) {
				try {
					await this.$http.post('/wechat/user/patchUserInfo', {
						nickName: userInfo.nickname,
						headImgUrl: userInfo.avatar
					})
					uni.showToast({ title: '更新成功', icon: 'none' })
					// 更新本地用户信息
					if (userInfo.avatar) {
						this.userInfo.headImgUrl = userInfo.avatar;
					}
					if (userInfo.nickname) {
						this.userInfo.nickName = userInfo.nickname;
					}
				} catch (error) {
					uni.showToast({ title: '更新失败', icon: 'none' })
				}
			},
			
		},
		onShow() {
			this.getUserInfo()
			this.getAddressInfo()
			this.getMemberInfo()
		}
	}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>