<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
    import echarts from 'echarts'
    import resize from './mixins/resize'

    require('echarts/theme/macarons'); // echarts theme

    const animationDuration = 3000;

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
                }
            }
        },
        data() {
            return {
                chart: null,
                option: {}
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
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            },
                            formatter: '{a} <br/>{b} : {c}%'
                        },
                        grid: {
                            left: '2%',
                            right: '2%',
                            bottom: '1%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'category',
                            data: newVal.axis,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                interval:0,
                                rotate:40
                            }
                        }],
                        yAxis: [{
                            type: 'value',
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                formatter: '{value} %'
                            },
                            show: true,
                            axisTick: {
                                show: false
                            }
                        }],
                        series: [{
                            name: newVal.data[0].name,
                            type: 'bar',
                            barWidth: '60%',
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        const colorList = [
                                            '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            },
                            data: newVal.data[0].value,
                            animationDuration
                        }],
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
