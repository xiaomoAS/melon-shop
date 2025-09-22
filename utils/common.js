/**
 * 格式化时间函数
 * @param {Date|string|number} date - 要格式化的时间，可以是Date对象、时间戳或时间字符串
 * @param {string} format - 格式模板，默认为 'YYYY-MM-DD HH:mm:ss'
 * 支持的格式符号：
 * YYYY - 四位年份
 * YY - 两位年份
 * MM - 月份（补零）
 * M - 月份（不补零）
 * DD - 日期（补零）
 * D - 日期（不补零）
 * HH - 小时（补零）
 * H - 小时（不补零）
 * mm - 分钟（补零）
 * m - 分钟（不补零）
 * ss - 秒钟（补零）
 * s - 秒钟（不补零）
 * @returns {string} 格式化后的时间字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  // 处理输入参数
  let targetDate;
  
  if (!date) {
    targetDate = new Date();
  } else if (date instanceof Date) {
    targetDate = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    targetDate = new Date(date);
  } else {
    targetDate = new Date();
  }
  
  // 检查日期是否有效
  if (isNaN(targetDate.getTime())) {
    console.warn('formatDate: 无效的日期参数，使用当前时间');
    targetDate = new Date();
  }
  
  // 获取各个时间组件
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const hour = targetDate.getHours();
  const minute = targetDate.getMinutes();
  const second = targetDate.getSeconds();
  
  // 格式化映射
  const formatMap = {
    'YYYY': year,
    'YY': String(year).slice(-2),
    'MM': String(month).padStart(2, '0'),
    'M': month,
    'DD': String(day).padStart(2, '0'),
    'D': day,
    'HH': String(hour).padStart(2, '0'),
    'H': hour,
    'mm': String(minute).padStart(2, '0'),
    'm': minute,
    'ss': String(second).padStart(2, '0'),
    's': second
  };
  
  // 替换格式字符串
  let result = format;
  Object.keys(formatMap).forEach(key => {
    const regex = new RegExp(key, 'g');
    result = result.replace(regex, formatMap[key]);
  });
  
  return result;
}

/**
 * 获取相对时间描述（如：刚刚、5分钟前、1小时前等）
 * @param {Date|string|number} date - 要计算的时间
 * @returns {string} 相对时间描述
 */
export const getRelativeTime = (date) => {
  const targetDate = new Date(date);
  const now = new Date();
  const diff = now - targetDate; // 毫秒差
  
  if (isNaN(targetDate.getTime())) {
    return '时间无效';
  }
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < month) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
}

/**
 * 常用的时间格式化快捷方法
 */
export const dateFormats = {
  // 日期格式
  date: (date) => formatDate(date, 'YYYY-MM-DD'),
  dateTime: (date) => formatDate(date, 'YYYY-MM-DD HH:mm:ss'),
  time: (date) => formatDate(date, 'HH:mm:ss'),
  dateTimeShort: (date) => formatDate(date, 'YYYY-MM-DD HH:mm'),
  
  // 中文格式
  dateCN: (date) => formatDate(date, 'YYYY年MM月DD日'),
  dateTimeCN: (date) => formatDate(date, 'YYYY年MM月DD日 HH:mm:ss'),
  
  // 其他格式
  iso: (date) => new Date(date).toISOString(),
  timestamp: (date) => new Date(date).getTime()
}