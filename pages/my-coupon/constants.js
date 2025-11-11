import { COUPON_TYPE } from '@/components/coupon-list/constants.js'

export const COUPON_TAB_TYPE = {
  ALL: -1, // 全部
  NEW_DISCOUNT: COUPON_TYPE.NEW_DISCOUNT, // 优惠券
  FREIGHT: COUPON_TYPE.FREIGHT, // 包邮券
  EXPIRED: -2, // 已过期
}

// 优惠券tab
export const COUNPON_TABS = [
  { label: '全部', value: COUPON_TAB_TYPE.ALL },
  { label: '优惠券', value: COUPON_TAB_TYPE.NEW_DISCOUNT },
  { label: '包邮券', value: COUPON_TAB_TYPE.FREIGHT },
  { label: '已过期', value: COUPON_TAB_TYPE.EXPIRED },
]