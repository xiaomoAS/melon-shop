export const SORT_KEY = {
  PRICE: 'price', // 金额排序 金额最多在上
  ORDER: 'order', // 订单排序 订单数量最多在上
  TIME: 'time' // 时间排序 时间最近在上
}

// 排序数组
export const SORT_LIST = [
  { label: '金额最多在上', value: SORT_KEY.PRICE },
  { label: '订单数最多在上', value: SORT_KEY.ORDER },
  { label: '时间最近在上', value: SORT_KEY.TIME },
]