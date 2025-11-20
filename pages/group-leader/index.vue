<template>
  <view class="leader-box">
    <UserProfile :scene="PROFILE_SCENE.LEADER" />

    <view class="date-picker">
      <uni-datetime-picker
        v-model="datetimerange"
        type="daterange"
        rangeSeparator="至"
        return-type="timestamp"
      />
    </view>
  </view>
</template>

<script>
  import UserProfile from '@/components/user-profile/index.vue'
	import { PROFILE_SCENE } from '@/components/user-profile/constants.ts'

  export default {
    name: 'GroupLeader',
      options: {
      styleIsolation: 'shared'
    },
    components: {
			UserProfile
		},
    data() {
      return {
        datetimerange: [Date.now(), (new Date()).setHours(23, 59, 59)],
        PROFILE_SCENE,
      }
    },
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>