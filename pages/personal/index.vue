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
		<view class="user_member_cont" :class="{ lv_1: lvdj === 'pj',lv_2: lvdj === 'pt',lv_3: lvdj === 'zs'}">
			<image v-if="lvdj === 'pj'" class="lv1_tips_ico" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/e41aaf68f7c84c039fba71ea560c54ea/user_vip_1.png?Expires=2073952366&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=KtkIuOIiMTQSK%2FWFn5Eye37WGX4%3D" mode="widthFix"></image>
			<image v-else-if="lvdj === 'pt'" class="lv2_tips_ico" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/01f642a1e7d042669128a0d51964c396/user_vip_2.png?Expires=2073952344&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=nlvbrbuVDNPXWBVsfmXLoNDMyeI%3D" mode="widthFix"></image>
			<image v-else-if="lvdj === 'zs'" class="lv3_tips_ico" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/b3d42b5b8e984c7fa814e3e827f33473/user_vip_3.png?Expires=2073952312&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=F19W05Zctzo5cD8E2TCcCauPS2c%3D" mode="widthFix"></image>
			<view class="lv_tips">当前等级</view>
			<view class="lv_inf" v-show="lvdj === 'pj'">
				<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/b7692b80a0bd439d95c81869aafaccc8/user_i_2.png?Expires=2073952394&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=1GOnV5zscqLKJnsk44cZ6sYvUls%3D" mode="widthFix"></image>
				<image class="txt" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/0d54446bb6274d7cb2a0d64d4aab701e/user_vip1_txt.png?Expires=2073952420&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=1FVHm%2FWDGOT7gJgRoA5aDfADXmw%3D" mode="widthFix"></image>
				<image class="plus" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/9ea3e2f4aca042b2b55c1b6fc921a0ac/user_vip1_plus.png?Expires=2073952444&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=yIHh0Mms7h1ok2V3U0oHa1Mkq1w%3D" mode="widthFix"></image>
			</view>
			<view class="lv_inf"  v-show="lvdj === 'pt'">
				<image class="txt" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/b373f6ef121c4af9a75511abe15d007a/user_vip2_txt.png?Expires=2073952462&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=cu4rmrxmSlN3OYxNEZGjnpThEgs%3D" mode="widthFix"></image>
			</view>
			<view class="lv_inf"  v-show="lvdj === 'zs'">
				<image class="txt" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/e50cf597ba6c4c4baa2566d605730572/user_vip3_txt.png?Expires=2073952482&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=%2BPuAUUnBKuX7gRQRccD90BfocSs%3D" mode="widthFix"></image>
				<image class="plus" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/af909cd502104009b49a75eff385c580/user_vip3_plus.png?Expires=2073952498&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=szjzI1EM4VNIgtPA2fdz9fvGOLU%3D" mode="widthFix"></image>
			</view>
			<view class="lv_txt">会员享整单9.5折优惠，免运费</view>
			<view class="lv_exp_cont">
				<view class="exp_head">
					<view class="exp"><text>1860</text>经验值</view>
					<view class="up_btn" v-show="lvdj === 'pj'">
						去升级
						<image class="arr" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/29d20c7283db4146807f52a8a929ee8c/user_vip1_arr.png?Expires=2073952518&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=X0TLBxv%2F0BbfPTC8C2ZYhgvAbUY%3D" mode="widthFix"></image> 					
					</view>
					<view class="up_btn" v-show="lvdj === 'pt'">
						开通会员
						<image class="arr" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/cd861d2229ac4117a5527693076f1cea/user_vip2_arr.png?Expires=2073952539&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=vBa9RtsvSVSH6kUypIqTpN45szQ%3D" mode="widthFix"></image> 	
					</view>
				</view>
				<view class="exp_line">
					<view class="ing"></view>
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

	export default {
		components: {
			// Recharge,
			UploadProfile,
			CouponList
		},
		data() {
			return {
				lvdj: 'zs',
				dczt:false,
				userInfo: {},
				defaultAddress: null,
				MEMBER_LEVEL,
				memberInfo: {},
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