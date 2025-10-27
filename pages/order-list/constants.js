// 支付方式
export const ORDER_STATUS = {
  ALL: -1, // 全部
  WAIT_PAY: 1, // 待付款
  WAIT_SEND: 2, // 待发货
  WAIT_RECEIVE: 3, // 待收货
  COMPLETED: 4, // 已完成
  OUT_PROCESS: 6, // 拣货中
  CANCELED: 9, // 已取消
}

export const ORDER_TABS = [
  { label: '全部', value: ORDER_STATUS.ALL },
  { label: '待付款', value: ORDER_STATUS.WAIT_PAY, iconClass: 'wait' },
  { label: '待出库', value: ORDER_STATUS.WAIT_SEND, iconClass: 'wait' },
  { label: '待收货', value: ORDER_STATUS.WAIT_RECEIVE, iconClass: 'process' },
  { label: '已完成', value: ORDER_STATUS.COMPLETED, iconClass: 'completed' },
  { label: '已取消', value: ORDER_STATUS.CANCELED, iconClass: 'canceled' },
]

export const ALL_ORDER_CONFIGS = [
  { label: '全部', value: ORDER_STATUS.ALL },
  { label: '待付款', value: ORDER_STATUS.WAIT_PAY, iconClass: 'wait' },
  { label: '待出库', value: ORDER_STATUS.WAIT_SEND, iconClass: 'wait' },
  { label: '拣货中', value: ORDER_STATUS.OUT_PROCESS, iconClass: 'wait' },
  { label: '待收货', value: ORDER_STATUS.WAIT_RECEIVE, iconClass: 'process' },
  { label: '已完成', value: ORDER_STATUS.COMPLETED, iconClass: 'completed' },
  { label: '已取消', value: ORDER_STATUS.CANCELED, iconClass: 'canceled' },
]