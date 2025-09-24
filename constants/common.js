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