<template>
    <el-card>
        <div style="position:relative;">
            <span class="card-title">单接口用例执行结果</span>
            <div style="padding-top:35px;" class="progress-item">
                <el-tag type="success" size="medium">通过数: {{passNum}}</el-tag>
                <el-progress :percentage="caseRunStatusRate.passRate"/>
            </div>
            <div class="progress-item" style="margin-top: 20px">
                <el-tag type="danger" size="medium">失败数: {{failNum}}</el-tag>
                <el-progress :percentage="caseRunStatusRate.failRate"/>
            </div>
            <div class="progress-item" style="margin-top: 20px">
                <el-tag type="info" size="medium">未执行数: {{notRunNum}}</el-tag>
                <el-progress :percentage="caseRunStatusRate.notRunRate"/>
            </div>
            <div class="card-panel-description" style="margin-top: 25px">
                <span class="card-panel-text">运行接口用例总数</span>
                <count-to :start-val="0" :end-val="totalNum" :duration="3000" class="card-panel-num"></count-to>
                <span> 条 </span>
            </div>
        </div>
    </el-card>
</template>

<script>
    import CountTo from 'vue-count-to'

    export default {
        props: {
            cardData: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        components: {CountTo},
        data() {
            return {
                totalNum: 0,
                passNum: 0,
                failNum: 0,
                notRunNum: 0,
                caseRunStatusRate: {
                    passRate: 0.00,
                    failRate: 0.00,
                    notRunRate: 0.00
                }
            }
        },
        methods: {
        },
        watch: {
            cardData: {
                handler(newVal) {
                    this.totalNum = newVal['totalCount'];
                    this.passNum = newVal['passCount'];
                    this.failNum = newVal['failCount'];
                    this.notRunNum = newVal['notRunCount'];

                    this.caseRunStatusRate = {
                        passRate: this.totalNum !== 0 ? parseFloat((this.passNum / this.totalNum * 100).toFixed(2)) : 0.00,
                        failRate: this.totalNum !== 0 ? parseFloat((this.failNum / this.totalNum * 100).toFixed(2)) : 0.00,
                        notRunRate: this.totalNum !== 0 ? parseFloat((this.notRunNum / this.totalNum * 100).toFixed(2)) : 0.00,
                    }
                },
                deep: true
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .card-title {
        font-weight normal
        color #008acd
    }

    .card-panel-num {
        font-size: 25px;
        color: orange;
    }

    /deep/ .el-progress-bar {
        width: 95%;
    }
</style>
