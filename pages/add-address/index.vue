<template>
	<view class="contain">
		<view class="adres_detail_cont">
			<view class="dl">
				<view class="dt"><text>*</text>收货人</view>
				<view class="dd"><input v-model="receiver" type="text" placeholder="请填写收货人"> </view>
			</view>
			<view class="dl">
				<view class="dt"><text>*</text>电话</view>
				<view class="dd"><input v-model="mobile" type="text" placeholder="请填写联系电话"> </view>
			</view>
			<view class="dl">
				<picker mode="multiSelector" range-key="name" :range="addressList" @columnchange="columnchangeHandler" @change="pickerChangeHandler">
					<view class="address-select__trigger">{{ addressText }}<uni-icons type="right" size="12"></uni-icons></view>
				</picker>
			</view>
			<textarea v-model="detail" class="deta_inf" name="" id="" placeholder="街道、小区门牌等详细信息"></textarea>
		</view>
		<view class="adres_default_seet">
			<view class="tle">设置为默认地址</view>
			<switch :checked="isDefault" @change="defaultChangeHandler"/>
		</view>

		<button class="bottom-button" @click="saveHandler">保存地址</button>
	</view>
</template>

<script>
import { ADDRESS_LEVEL } from './constants'

export default {
	name: 'AddAddress',
	data() {
		return {
			addressId: null,
			receiver: null,
			mobile: null,
			detail: null,
			isDefault: false,
			selectIndexList: [],
			selectList: [], // 选择地址数据
			addressList: [],
			addressText: '请选择省/市/区县'
		}
	},
	async onLoad(options) {
		try {
			this.addressId = options.id || null
			this.initData()
			// 初始化地址
			await this.setArea(ADDRESS_LEVEL.PROVINCE)
			const provinceId = this.addressList[0][0].id
			await this.setArea(ADDRESS_LEVEL.CITY, provinceId)
			const cityId = this.addressList[1][0].id
			this.setArea(ADDRESS_LEVEL.DISTRICT, cityId)
		} catch (error) {
			console.log(error)
		}
	},
	methods: {
		async setArea(level = ADDRESS_LEVEL.PROVINCE, parentId = null) {
			try {
				const list = await this.$http.post('/address/areas', { level, parentId })
				this.addressList[level - 1] = list
				this.$set(this.addressList, level - 1, list)
			} catch (error) {
				console.log(error)
			}
		},
		async initData() {
			if (!this.addressId) return
			try {
				const data = await this.$http.post('/address/getAddress', { addressId: Number(this.addressId) })
				this.receiver = data.receiver
				this.mobile = data.mobile
				this.detail = data.detail
				this.isDefault = data.isDefault
			} catch (error) {
				console.log(error)
			}
		},
		async getProvinceList() {
			try {
				const list = await this.$http.post('/address/areas', { level: 1 })
				this.addressList[0] = list
				this.$set(this.addressList, 0, list)
			} catch (error) {
				console.log(error)
			}
		},
		async columnchangeHandler(e) {
			// 第一列，选择省份
			if (e.detail.column == 0) {
				const provinceId = this.addressList[0][e.detail.value].id
				await this.setArea(ADDRESS_LEVEL.CITY, provinceId)
				const cityId = this.addressList[1][0].id
				this.setArea(ADDRESS_LEVEL.DISTRICT, cityId)
			}
			// 第二列，选择市
			if (e.detail.column === 1) {
				const cityId = this.addressList[1][e.detail.value].id
				this.setArea(ADDRESS_LEVEL.DISTRICT, cityId)
				// 重置区县选择
			}
		},
		// 处理picker确定事件
		pickerChangeHandler(e) {
			this.selectIndexList = e.detail.value
			const province = this.addressList[0] && this.addressList[0][this.selectIndexList[0]] ? this.addressList[0][this.selectIndexList[0]] : null
			const city = this.addressList[1] && this.addressList[1][this.selectIndexList[1]] ? this.addressList[1][this.selectIndexList[1]] : null
			const district = this.addressList[2] && this.addressList[2][this.selectIndexList[2]] ? this.addressList[2][this.selectIndexList[2]] : null
			// 更新地址信息
			this.selectList = [province, city, district]
			this.addressText = this.getAddressText(province, city, district)
		},
		// 获取地址显示文本
		getAddressText(province, city, district) {
			if (province && city && district) {
				return `${province.name} ${city.name} ${district.name}`
			} else if (province.name && city.name) {
				return `${province.name} ${city.name}`
			} else if (province.name) {
				return province.name
			}
			return '请选择省/市/区县'
		},
		defaultChangeHandler(event) {
			this.isDefault = event.detail.value
		},
		validateData() {
			if (!this.receiver) {
				uni.showToast({ title: '请填写收货人', icon: 'error' })
				return false
			}
			if (!this.mobile) {
				uni.showToast({ title: '请填写联系电话', icon: 'error' })
				return false
			}
			if (!this.selectList || !this.selectList.length) {
				uni.showToast({ title: '请选择收货地址', icon: 'error' })
				return false
			}
			if (!this.detail) {
				uni.showToast({ title: '请填写详细地址', icon: 'error' })
				return false
			}
			return true
		},
		async saveHandler() {
			console.log('isDefault', this.isDefault);
			
			const valid = this.validateData()
			if (!valid) return
			try {
				const apiName = this.addressId ? '/address/update' : '/address/add'
				await this.$http.post(apiName, {
					addressId: this.addressId,
					receiver: this.receiver,
					mobile: this.mobile,
					province: this.selectList[0] ? this.selectList[0].name : null,
					city: this.selectList[1] ? this.selectList[1].name : null,
					district: this.selectList[2] ? this.selectList[2].name : null,
					detail: this.detail,
					isDefault: this.isDefault ? 1 : 0
				})
				uni.showToast({ title: '添加成功', icon: 'success' })
				const timer = setTimeout(() => {
					uni.navigateBack()
					clearTimeout(timer)
				}, 1000);
			} catch (error) {
				console.log(error)
			}
		}
	}
}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>