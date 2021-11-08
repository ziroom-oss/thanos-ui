<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
    import echarts from 'echarts'
    import resize from './mixins/resize'

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
                default: '330px'
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
                    newVal.series.data.forEach(item => {
                        if (item.hasOwnProperty('child')) {
                            this.option.title.subtext = '单击图表下钻查看详情'
                        }
                    });

                    this.option = {
                        title: {
                            text: newVal.title,
                            subtext: '',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            y: 'bottom',
                            data: newVal.legendData,
                        },
                        toolbox: {
                            show: true,
                            feature: {}
                        },
                        calculable: true,
                        series: [{
                            name: newVal.series.name,
                            type: 'pie',
                            radius: '40%',
                            center: ['50%', '42%'],
                            data: newVal.series.data
                        }]
                    };
                    this.initChart();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons');
                this.chart.setOption(this.option);

                let _this = this;
                _this.chart.on('click', function (object) {
                    if (object.data.hasOwnProperty('child')) {
                        _this.chart.dispose(_this.$el);
                        _this.chart = echarts.init(_this.$el, 'macarons');

                        let childOption = JSON.parse(JSON.stringify(_this.option));
                        childOption.series[0].data = object.data.child.seriesData;
                        childOption.series[0].name = object.data.child.seriesName;
                        childOption.legend.data = object.data.child.legendData;
                        childOption.title.text = object.data.child.title;
                        childOption.title.subtext = '';
                        childOption.series[0].center = ['50%', '50%'];

                        let that = _this;
                        // 子图表工具箱样式、返回上层
                        childOption.toolbox.right = 20;
                        childOption.toolbox.feature = {
                            // 注意，自定义的工具名字，只能以 my 开头，例如下例中的 myTool
                            myTool: {
                                show: true,
                                title: '返回上层',
                                icon: 'path://M357.888 861.355c-21.504 0-23.552-17.408-23.552-38.912s2.048-38.912 23.552-38.912H583.68c166.4 0 210.432-136.704 210.432-209.408 0-95.744-36.352-209.92-209.92-209.92H284.16L386.048 466.09c7.168 7.168 11.264 17.408 11.264 27.648 0 10.24-4.096 20.48-11.264 27.648-7.168 7.168-17.408 11.264-27.648 11.264-10.752 0-20.48-4.096-27.648-11.264L162.816 352.939c-15.36-15.36-15.36-39.936 0-55.296l156.16-156.16c7.168-7.168 17.408-11.264 27.648-11.264 10.752 0 20.48 4.096 27.648 11.264 15.36 15.36 15.36 39.936 0 55.296l-88.576 89.088h299.008c105.472 0 183.808 34.816 233.984 102.912 44.544 61.44 54.272 134.656 54.272 185.344 0 115.712-76.8 287.744-288.768 287.744H357.888z',
                                onclick: () => {
                                    that.chart.dispose(that.$el);
                                    that.initChart()
                                }
                            }
                        };
                        _this.chart.setOption(childOption);
                    }
                })
            }
        }
    }
</script>
