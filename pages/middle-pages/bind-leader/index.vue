<template>
  <view class="middle-box">
    <button class="middle-box-button" type="primary" :plain="true" :loading="true">绑定团长中~</button>
  </view>
</template>

<script>
  export default {
    name: 'BindLeader',
    data() {
      return {
        id: null,
      }
    },
    async onLoad(options) {
      try {
        if (options && options.scene) {
          const scene = decodeURIComponent(options.scene)
          const params = scene.split('&')
          const leaderId = params.find((item) => item.includes('leaderId')).split('=')[1]
          this.id = leaderId
          await this.bindLeader()
        }
      } catch (error) {
        uni.switchTab({ url: '/pages/index/index' })
      }
    },
    methods: {
      async bindLeader() {
        try {
          if (!this.id) return
          await this.$http.post('/admin/team/user/add', {
            leaderId: Number(this.id)
          })
          uni.showToast({ title: '绑定成功', icon: 'none' })
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