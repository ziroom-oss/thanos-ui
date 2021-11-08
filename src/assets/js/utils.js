/*
 * @Author: liuxr3
 * @Date: 2021-03-09 11:34:05
 * @LastEditTime: 2021-06-17 17:12:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/assets/js/utils.js
 */
export function debounce (fn, wait = 50, immediate = true) {
  let timer
  let result
  return function () {
    const context = this
    const args = arguments
    if (timer) clearTimeout(timer)
    if (immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (callNow) {
        result = fn.apply(context, args)
      }
    } else {
      timer = setTimeout(() => {
        result = fn.apply(context, args)
      }, wait)
    }
    return result
  }
}

/**
 * 乘法函数，用来得到精确的乘法结果
 * 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 * 调用：accMul(arg1,arg2)
 * 返回值：arg1乘以 arg2的精确结果
*/
export function accMul (arg1, arg2 = 100) {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
 * 日期格式化
 * @param {*} timestamp
 */
export function dateFormat (timestamp, format = 'yyyy-MM-dd') {
  if (typeof timestamp !== 'number') {
    return timestamp
  }
  const t = new Date(timestamp)
  const tf = function (i) {
    return (i < 10 ? '0' : '') + i
  }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'dd':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'mm':
        return tf(t.getMinutes())
      case 'ss':
        return tf(t.getSeconds())
    }
  })
}
