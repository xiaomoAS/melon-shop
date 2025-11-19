export const COUPON_TYPE = {
  NEW_DISCOUNT: 1, // 普通优惠券
  FREIGHT: 2, // 包邮券
}

// 发放方式
export const PUBLISH_TYPE = {
  NEW: 1, // 新用户进入小程序领取
  LINK: 4, // 分享二维码领取
  DISCOUNT_DAILY: 5, // 每日折扣券
}

// 过期类型
export const EXPIRED_TYPE = {
  VALID: 2, // 有效
  EXPIRED: 1, // 过期
}

// 用户券状态
export const USE_COUPON_STATUS = {
  WAIT_USE: 1, // 待使用
  WAIT_SEND: 4, // 待赠送
}

// 优惠券列表场景
export const COUPON_LIST_SCENE = {
  ALL: 1, // 我的优惠券页面
  PERSONAL: 2, // 我的页面
}