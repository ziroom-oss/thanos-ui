/*
 * @Date: 2021-08-11 09:22:28
 * @LastEditTime: 2021-08-11 09:24:24
 * @LastEditors: Please set LastEditors
 * @Description: 格式化JSON
 * @param (json)
 */
export function formatJSON (jsonData) {
  const json = JSON.parse(jsonData)
  return JSON.stringify(json, null, '\t')
}
