<template>
  <div class="get-coupon-box">
    <button class="get-coupon-button" type="primary" :plain="true" :loading="true">优惠券领取中~</button>
  </div>
</template>

<script>
  export default {
    name: 'GetCoupon',
    data() {
      return {
        counponId: null,
      }
    },
    async onLoad(options) {
      if (options && options.scene) {
        const scene = decodeURIComponent(options.scene)
        const id = scene.split('=')[1]
        this.counponId = id
        await this.claimCoupon()
      }
    },
    methods: {
      async claimCoupon() {
        try {
          if (!this.counponId) return
          await this.$http.post('/user/coupon/claim', {
            couponId: Number(this.counponId)
          })
          uni.showToast({ title: '领取成功', icon: 'none' })
          const timer = setTimeout(() => {
            uni.switchTab({ url: '/pages/personal/index' })
            clearTimeout(timer)
          }, 1000);
        } catch (error) {
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