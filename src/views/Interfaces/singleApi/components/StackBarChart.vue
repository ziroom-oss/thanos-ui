<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
    import echarts from 'echarts'
    import resize from '@/views/dashboard/admin/components/mixins/resize'

    require('echarts/theme/macarons'); // echarts theme

    const animationDuration = 2000;

    export default {
        mixins: [resize],
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '300px'
            },
            chartData: {
                type: Object,
                default: () => {
                    return {}
                },
            }
        },
        data() {
            return {
                chart: null,
                option: {},
                resultType: ['成功','失败','未执行'],
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initChart()
            })
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            this.chart.dispose();
            this.chart = null
        },
        watch: {
            chartData: {
                handler(newVal) {
                    this.option = {
                        title: {
                            text: newVal.title,
                            x: 'left'
                        },
                        legend: {
                            data: this.resultType
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            left: '2%',
                            right: '2%',
                            bottom: '1%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'category',
                            data: newVal.systemList,
                            // axisTick: {
                            //     alignWithLabel: true
                            // },
                            axisLabel: {
                                interval:0,
                                rotate:20,
                                textStyle: {
                                    fontSize: 10
                                }
                            }
                        }],
                        yAxis: [{
                            type: 'value',
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                formatter: '{value}'
                            },
                            show: true,
                            axisTick: {
                                show: false
                            }
                        }],
                        series: [
                            {
                                name: this.resultType[0],
                                type: 'bar',
                                stack: "case",
                                data: newVal.successNumList,
                                itemStyle:{
                                    normal:{
                                        color: "#9bca63"
                                    }
                                }
                            },
                            {
                                name: this.resultType[1],
                                type: 'bar',
                                stack: "case",
                                data:  newVal.failureNumList,
                                itemStyle:{
                                    normal:{
                                        color: "#e87c25"
                                    }
                                }
                            },
                            {
                                name: this.resultType[2],
                                type: 'bar',
                                stack: "case",
                                data:  newVal.notRunNumList,
                                itemStyle:{
                                    normal:{
                                        color: "#fcce10"
                                    }
                                }
                            },
                        ],
                    };
                    this.initChart();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons');
                this.chart.setOption(this.option)
            }
        }
    }
</script>
