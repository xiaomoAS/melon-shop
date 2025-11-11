<template>
  <div class="send-coupon-box">
    <button class="send-coupon-button" type="primary" :plain="true" :loading="true">优惠券赠送中~</button>
  </div>
</template>

<script>
  export default {
    name: 'SendCoupon',
    data() {
      return {
      }
    },
    async onLoad(options) {
      if (options.giverUserId && options.couponId) {
        console.log('options', Object.prototype.toString.call(options).split(' ')[1].split(']')[0], '===', options);
        await this.sendCoupon({ giverUserId: options.giverUserId, couponId: options.couponId })
      } else {
        uni.showToast({ title: '赠送失败', icon: 'none' })
        uni.switchTab({ url: '/pages/index/index' })
      }
    },
    methods: {
      async sendCoupon(params) {
        try {
          await this.$http.post('/user/coupon/donate', {
            ...params
          })
          uni.showToast({ title: '赠送成功', icon: 'none' })
          const timer = setTimeout(() => {
            uni.switchTab({ url: '/pages/personal/index' })
            clearTimeout(timer)
          }, 1000);
        } catch (error) {
          // 登陆异常跳过
          if (error.data.code === 401) return
          const timer = setTimeout(() => {
            uni.switchTab({ url: '/pages/index/index' })
            clearTimeout(timer)
          }, 1000);
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>