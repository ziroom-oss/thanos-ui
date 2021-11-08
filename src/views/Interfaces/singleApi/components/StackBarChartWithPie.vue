<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
    import echarts from 'echarts'
    import resize from '@/views/dashboard/admin/components/mixins/resize'

    require('echarts/theme/macarons'); // echarts theme

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
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        calculable: true,
                        legend: {
                            data: newVal.exceptionTypeList
                        },
                        xAxis: [
                            {
                                type: 'category',
                                splitLine: {show: false},
                                data: newVal.businessLineList,
                                axisLabel: {
                                    interval:0,
                                    // rotate:5,
                                    textStyle: {
                                        fontSize: 10
                                    }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                position: 'right'
                            }
                        ],
                    }
                    this.option["series"] = [];
                    this.option["series"].push({
                        name: '汇总',
                        type: 'pie',
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        center: [80, 80],
                        radius: [0, 40],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    length: 0
                                }
                            }
                        },
                        data: newVal.pieData
                    });
                    let seriesObj = newVal.seriesData;
                    for (let exType in seriesObj) {
                        this.option["series"].push(
                            {
                                name: exType,
                                type: 'bar',
                                stack: 'bar',
                                data: seriesObj[exType],
                            },
                        );
                    }
                    this.initChart();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons');
                this.chart.setOption(this.option);
            },
        }
    }
</script>
