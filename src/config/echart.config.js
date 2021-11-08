/*
 * @Author: liuxr3
 * @Date: 2021-05-27 21:03:11
 * @LastEditTime: 2021-06-16 15:47:22
 * @LastEditors: Please set LastEditors
 * @Description: echarts按需配置
 * @FilePath: /quality-defense-initiative/src/config/echart.config.js
 */
import Vue from 'vue'
import * as echarts from 'echarts/core'

// 引入柱状图图表，图表后缀都为 Chart
import {
  PieChart
} from 'echarts/charts'

// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
  CanvasRenderer
} from 'echarts/renderers'

// 注册必须的组件
echarts.use(
  [
    PieChart,
    CanvasRenderer,
    TitleComponent,
    TooltipComponent,
    LegendComponent
  ]
)

Vue.prototype.$echarts = echarts

Vue.use(echarts)
