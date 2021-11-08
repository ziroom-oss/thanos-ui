/*
 * @Author: your name
 * @Date: 2021-05-31 16:59:59
 * @LastEditTime: 2021-06-02 11:13:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/config/pieChart.config.js
 */
const pieOption = (dataSource = [], title) => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 40
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: '80%',
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: dataSource
      }
    ]
  }
}
export { pieOption }
