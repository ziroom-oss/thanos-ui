export function isJSON (str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      return !!(typeof obj === 'object' && obj)
    } catch (e) {
      return false
    }
  }
}

/**
 * 节流函数
 * @param {Function} fn 要节流的函数
 * @param {string} wait 多少毫秒触发一次,默认50毫秒
 * @return void
 */
export function throttle (fn, wait = 50) {
  let lastTime = 0
  return function (...args) {
    const nowTime = +new Date()
    if (nowTime - lastTime >= wait) {
      lastTime = nowTime
      fn.apply(this, args)
    }
  }
}
