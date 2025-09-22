<template>
	<view class="contain">
		<image src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/916cae2f99af4241acf65617a6a07bd9/index_head_bg.png?Expires=2073875593&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=6l%2B1kM%2BmbcTT4vmhVbD6zlktjVo%3D" class="index_head_bg" mode="widthFix"></image>
		<view class="user_head_bg">
			我的
		</view>
		<view class="user_inf_content">
			<view class="ava_inf">
				<view class="tips_txt">点击头像上传个人信息</view>
				<view class="ava"><image src="@/static/image/user_ava.png" mode=""></image> </view>
			</view>
			<view class="deta_inf">
				<view class="name">陌上云霄
					<view class="id">ID:156345</view>
				</view>
				<view class="tel">
					<image class="tel_i" src="@/static/image/user_i_1.png" mode="widthFix"></image> 
					：15506332222
				</view>
			</view>
		</view>
		<view class="user_member_cont" :class="{ lv_1: lvdj === 'pj',lv_2: lvdj === 'pt',lv_3: lvdj === 'zs'}">
			<image v-if="lvdj === 'pj'" class="lv1_tips_ico" src="@/static/image/user_vip_1.png" mode="widthFix"></image>
			<image v-else-if="lvdj === 'pt'" class="lv2_tips_ico" src="@/static/image/user_vip_2.png" mode="widthFix"></image>
			<image v-else-if="lvdj === 'zs'" class="lv3_tips_ico" src="@/static/image/user_vip_3.png" mode="widthFix"></image>
			<view class="lv_tips">当前等级</view>
			<view class="lv_inf" v-show="lvdj === 'pj'">
				<image class="i" src="@/static/image/user_i_2.png" mode="widthFix"></image>
				<image class="txt" src="@/static/image/user_vip1_txt.png" mode="widthFix"></image>
				<image class="plus" src="@/static/image/user_vip1_plus.png" mode="widthFix"></image>
			</view>
			<view class="lv_inf"  v-show="lvdj === 'pt'">
				<image class="txt" src="@/static/image/user_vip2_txt.png" mode="widthFix"></image>
			</view>
			<view class="lv_inf"  v-show="lvdj === 'zs'">
				<image class="txt" src="@/static/image/user_vip3_txt.png" mode="widthFix"></image>
				<image class="plus" src="@/static/image/user_vip3_plus.png" mode="widthFix"></image>
			</view>
			<view class="lv_txt">会员享整单9.5折优惠，免运费</view>
			<view class="lv_exp_cont">
				<view class="exp_head">
					<view class="exp"><text>1860</text>经验值</view>
					<view class="up_btn" v-show="lvdj === 'pj'">
						去升级
						<image class="arr" src="@/static/image/user_vip1_arr.png" mode="widthFix"></image> 					
					</view>
					<view class="up_btn" v-show="lvdj === 'pt'">
						开通会员
						<image class="arr" src="@/static/image/user_vip2_arr.png" mode="widthFix"></image> 	
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
				<navigator url="/pages/order/order" class="adres_seet">
					<image class="i" src="@/static/image/user_i_3.png" mode="widthFix"></image>
					地址管理
				</navigator>
			</view>
			<view class="adres_deta_list">
				<view class="title">
					<view class="tip defa">默认</view>
					<view class="tip home">家</view>
					铁板鱿鱼  12200033322
				</view>
				<view class="txt">北京  朝阳区  团结湖路17号楼南门502</view>
			</view>
		</view>
		<view class="user_coupon_cont">
			<view class="user_pulic_title">
				<view class="tle">我的优惠券</view>
			</view>
			<coupon-list ref="Couponlast"></coupon-list>
		</view>
		<view class="user_bits_txt">
			<view class="txt">如果您有问题，可以电话联系XXX,我们将高效解决！您还可以在我们未覆盖区域当团长，挣佣金！</view>
			<view class="bit_dl">
				<view class="dt">工作日：09:00-18:00</view>
				<view class="dd">客栈热线 4008866232</view>
			</view>
		</view>
		<view class="user_dump_btn">我要当团长</view>
		<!---->
		<view class="pulic_dc_bg" v-show="dczt"></view>
		<re-charge ref="Recharge" v-show="dczt"></re-charge>
	</view>
</template>

<script>
	import Recharge from '@/components/Recharge/Recharge.vue'
	export default {
		components: {
			 're-charge': Recharge,
		},
		data() {
			return {
				lvdj: 'zs',
				dczt:false
			}
		}
	}
</script>

<style lang="less">
	@import url(/pages/my/my.css);
	
</style>