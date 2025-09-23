<template>
	<view class="contain">
		<view v-for="item in addressList" :key="item.id" class="adres_list">
			<view class="tis_detail">
				<view class="tle">
					<view class="name">{{ item.receiver }}</view>{{ item.mobile }}
				</view>
				<view class="txt">{{ item.province }} {{ item.city }} {{ item.district }} {{ item.detail }}</view>
			</view>
			<view class="bit_cont">
				<view class="adres_default">
					<label class="adres_rad" @click="setDefault(item)">
						<radio class="default-radio" :checked="item.isDefault" ></radio>
						<text>设为默认收货地址</text>
					</label>
				</view>
				<view class="seet_dl">
					<view class="dl" @click="deleteAddress(item)">
						<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/2e31f865a3b4470fb45b6701129d9e02/adres_i_1.png?Expires=2073954053&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=zqDbeCgIFEXJIswJdLeenlxl2Cc%3D" mode="widthFix"></image>
						删除
					</view>
					<view class="dl" @click="modifyAddress(item)">
						<image class="i" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/4206b0c2b38247e6866ab2042e1440fd/adres_i_2.png?Expires=2073954067&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=8uIJD5LjkxvLtEjuqQbfaUREjMY%3D" mode="widthFix"></image>
						修改
					</view>
				</view>
			</view>
		</view>

		<navigator url="/pages/add-address/index" class="bit_add_btn">新增地址</navigator>
	</view>
</template>

<script>
export default {
	data() {
		return {
			addressList: [],
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
		async setDefault(item) {
			// 如果已经是默认地址，则不处理
			if (item.isDefault) {
				return
			}
			
			try {
				await this.$http.post('/address/setDefalut', { addressId: item.id })
				// 更新本地状态：取消其他地址的默认状态，设置当前地址为默认
				this.addressList.forEach(addr => {
					addr.isDefault = addr.id === item.id
				})
			} catch (error) {
				console.error('设置默认地址失败:', error)
				// 重新获取数据以还原状态
				this.getAddressList()
			}
		},
		async deleteAddress(item) {
			try {
				await this.$http.post('/address/delete', { addressId: item.id })
				uni.showToast({ title:'删除成功', icon: 'none' })
				this.getAddressList()
			} catch (error) {
				console.log(error)
			}
		},
		modifyAddress(item) {
			uni.navigateTo({ url: `/pages/add-address/index?id=${item.id}` })
		}
	},
	onShow() {
		this.getAddressList()
	},
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>