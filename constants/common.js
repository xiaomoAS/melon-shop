// 会员等级
export const MEMBER_LEVEL = {
  NORMAL: 1, // 普通
  GOLD: 2, // 黄金
  PLATINUM: 3, // 铂金
  DIAMOND: 4, // 钻石
}

export const MEMBER_LEVEL_NAME = {
  [MEMBER_LEVEL.NORMAL]: '普通会员',
  [MEMBER_LEVEL.GOLD]: '黄金会员',
  [MEMBER_LEVEL.PLATINUM]: '铂金会员',
  [MEMBER_LEVEL.DIAMOND]: '钻石会员',
}

// 支付方式
export const PAY_METHOD = {
  WE_CHAT: 1, // 微信
  MEMBER_CARD: 2, // 充值卡
}

// 请求来源
export const SOURCE = {
  CART: 1, // 购物车
}

// 支付状态
export const PAY_STATUS = {
	SUCCESS: 4, // 成功
}

export const RESOURCE_LINK_TYPE = {
  MINI: 1, // 小程序
  OFFICIAL: 2, // 公众号
}