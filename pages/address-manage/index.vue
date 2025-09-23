<template>
	<view class="contain">
		<!---->
		<view class="adres_list">
			<view class="tis_detail">
				<view class="tle">
					<view class="name">铁板鱿鱼</view>12200033322
				</view>
				<view class="txt">北京  朝阳区  团结湖路17号楼南门502</view>
			</view>
			<view class="bit_cont">
				<view class="adres_default">
					<label class="adres_rad">
						<view class="ring"><radio value="" /></view>
						<text>设为默认地址</text>
					</label>
				</view>
				<view class="seet_dl">
					<view class="dl">
						<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/2e31f865a3b4470fb45b6701129d9e02/adres_i_1.png?Expires=2073954053&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=zqDbeCgIFEXJIswJdLeenlxl2Cc%3D" mode="widthFix"></image>
						删除
					</view>
					<view class="dl">
						<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4206b0c2b38247e6866ab2042e1440fd/adres_i_2.png?Expires=2073954067&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=8uIJD5LjkxvLtEjuqQbfaUREjMY%3D" mode="widthFix"></image>
						修改
					</view>
				</view>
			</view>
		</view>
		<!-- -->
		<navigator url="/pages/add-address/index" class="bit_add_btn">新增地址</navigator>
	</view>
</template>

<script>
export default {
	data() {
		return {
			addressList: []
		}
	},
	methods: {
		async getAddressList() {
			try {
				this.addressList = await this.$http.post('/address/list', {})
			} catch (error) {
				this.addressList = []
			}
		},
	},
	onShow() {
		this.getAddressList()
	},
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>