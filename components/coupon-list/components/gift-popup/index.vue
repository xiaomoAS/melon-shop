<template>
  <view class="gift-box">
		<uni-popup ref="popup" class="gift-popup">
			<view class="popup-box">
        <image class="logo-image" src="https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/da449df52fc542dc9750403211634c3a/yuguo_logo%20%281%29.png?Expires=2076054860&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=MD4eu2NbpcKOFbv7%2BtjyfdHlctI%3D"></image>

				<view class="popup-box__title">优惠券赠送</view>
        <view class="popup-box__content">
          <image class="head-image" :src="userInfo.headImgUrl || 'https://melonbamboo.oss-cn-beijing.aliyuncs.com/melonbamboo/1f25a32b4b97447bac8d02f20f0a47b6/user_ava.png?Expires=2073952610&OSSAccessKeyId=LTAI5tHrbcXwiX27kw8s1cSb&Signature=IQflZdBMbA4jh2W7oui1vmaxPuU%3D'" mode=""></image>
          <view class="content-title">{{ couponInfo.name }}</view>

          <view class="product-info">
            <image class="product-info__image" :src="productInfo.mainImgUrl" mode="widthFix"></image>
            <view class="product-info__content">
              <view class="product-title">{{ productInfo.title }}</view>
              <view>销量：{{ productInfo.saleCount }}{{ productInfo.specName }}</view>
              <view>原价：<text class="line-through">{{ productInfo.price }} 元/{{ productInfo.specName }}</text></view>
            </view>
          </view>

          <view class="real-price">券后价：<text class="red-text">{{ realPrice }}</text> 元/{{ productInfo.specName }}</view>
          <view>券截止时间：{{ formatDate(couponInfo.endTime, 'YYYY-MM-DD') }}</view>

          <view class="send-button" @click="submitHandler">确认赠送</view>

          <view class="send-desc">点击赠送后生成链接，发给心意的他，<text class="strong">点击链接</text>立即获取折扣券！</view>
        </view>
			</view>
		</uni-popup>
  </view>
</template>

<script>
import { formatDate } from '@/utils/common';

  export default {
    name: 'GiftPopup',
    data() {
      return {
        couponInfo: {},
        productInfo: {},
        userInfo: {}
      }
    },
    computed: {
      realPrice() {
        const price = Math.round((this.productInfo.price - this.couponInfo.newPersonPrice) * 100) / 100
        if (price < 0.01) return 0.01
        return price
      },
    },
    methods: {
      async getUserInfo() {
				try {
					this.userInfo = await this.$http.post('/wechat/user/getUserInfo', {})
				} catch (error) {
					this.userInfo = {}
				}
			},
      async getProductDetail(id) {
        try {
          if (!id) return
          this.productInfo = await this.$http.post('/items/getProduct', { productId: Number(id) })
        } catch (error) {
          console.error('获取商品详情失败:', error)
          this.productInfo = {}
        }
      },
      submitHandler() {
        
      },
      open(couponItem) {
        if (!couponItem) return
        this.getUserInfo()
        this.couponInfo = couponItem
        this.getProductDetail(couponItem.productIdList[0])
        this.$refs.popup.open('center')
      },
      formatDate
    },
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>