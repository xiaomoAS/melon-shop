export const COUPON_TYPE = {
  NEW_DISCOUNT: 1, // 普通优惠券
  FREIGHT: 2, // 包邮券
}

// 发放方式
export const PUBLISH_TYPE = {
  NEW: 1, // 新用户进入小程序领取
  DISCOUNT_DAILY: 3, // 每日折扣券
  LINK: 4, // 分享二维码领取
}

// 过期类型
export const EXPIRED_TYPE = {
  VALID: 2, // 有效
  EXPIRED: 1, // 过期
}

// 是否可赠送
export const DONATE_TYPE = {
  SEND: 1, // 可赠送
  NO: 2, // 不可赠送
}