<template>
    <el-container>
        <el-header>
            <div style="color: white; font-size:15px" align="left"><i class="el-icon-s-promotion"></i>
                多接口用例报告详情
            </div>
        </el-header>
        <el-main>
            <el-row :xs="24" :sm="24" :lg="24">
                <el-card>
                    <el-col :xs="24" :sm="24" :lg="24">
                        <span class="card-title">【{{caseData.caseName}}】用例的执行结果</span>
                        <span class="card-title" style="float: right">{{this.exeTime}}</span>
                    </el-col>
                    <div style="text-align: center;margin-top: 50px;">
                        <el-col :xs="24" :sm="24" :lg="8">
                            <el-progress type="dashboard" :percentage="caseRunStatusRate.passRate" color="#5cb87a" :stroke-width="8"></el-progress>
                                <!--<el-progress type="circle" :percentage="caseRunStatusRate.passRate" status="success"/>-->
                            <br/>
                                <el-tag type="success" size="medium" style="margin-bottom: 20px">success数: {{caseData.passNum}}</el-tag>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="8">
                              <el-progress type="dashboard" :percentage="caseRunStatusRate.failRate" color="#f56c6c" :stroke-width="8"></el-progress>
                            <br/>
                                <!--<el-progress type="circle" :percentage="caseRunStatusRate.failRate" status="exception"/>-->
                                <el-tag type="danger" size="medium">failure数: {{caseData.failedNum}}</el-tag>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="8">
                            <el-progress type="dashboard" :percentage="caseRunStatusRate.skippedRate" color="#e6a23c" :stroke-width="8"></el-progress>
                            <br/>
                                <el-tag type="warning" size="medium">skipped数: {{caseData.skippedNum}}</el-tag>
                        </el-col>
                    </div>
                    <!--<div class="card-panel-description" style="margin-top: 25px">-->
                        <!--<span class="card-panel-text">执行的步骤数为</span>-->
                        <!--<count-to :start-val="0" :end-val="caseData.allNum" :duration="3000"-->
                                  <!--class="card-panel-num"></count-to>-->
                        <!--<span> 条 </span>-->
                    <!--</div>-->
                </el-card>
            </el-row>
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    stripe
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item v-show='props.row.stepType == 1 && props.row.stepStatus != "SKIPPED"'
                                          label="【接口地址】:">
                                <span v-if="props.row.apiUrl === null">无</span>
                                <span>{{ props.row.apiUrl }}</span>
                            </el-form-item>
                            <el-form-item v-show='props.row.stepType == 1 && props.row.stepStatus != "SKIPPED"'
                                          label="【接口实际结果】:">
                                <span v-if="props.row.apiOutput === null">无</span>
                                <span>{{ props.row.apiOutput }}</span>
                            </el-form-item>
                            <el-form-item v-show='props.row.stepType == 1 && props.row.stepStatus != "SKIPPED"'
                                          label="【接口真实入参】:">
                                <span v-if="props.row.apiInParam === null">无</span>
                                <span>{{ props.row.apiInParam }}</span>
                            </el-form-item>
                            <el-form-item v-show='props.row.stepType == 1 && props.row.stepStatus != "SKIPPED"'
                                          label="【接口预期结果】:">
                                <div v-if="props.row.assertRecordList !== undefined">
                                    <el-table size="small" :data="JSON.parse(props.row.assertRecordList)" >
                                        <el-table-column type="index" width="50" label="序号">
                                        </el-table-column>
                                        <el-table-column width="100" prop="assertResult" label="运行状态">
                                            <template slot-scope="scope">
                                                <label style="color: yellowgreen"  v-if="scope.row.assertResult == 'SUCCESS'">SUCCESS</label>
                                                <label style="color: #ff6670" v-if="scope.row.assertResult == 'FAILURE'">FAILURE</label>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="700" prop="assertContent" label="断言内容">
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div v-else><span>暂无</span></div>
                            </el-form-item>


                            <el-form-item v-show='props.row.stepType == 0 && props.row.stepStatus != "SKIPPED"'
                                          label="【数据库名称】:">
                                <span v-if="props.row.dbName === null">无</span>
                                <span>{{ props.row.dbName }}</span>
                            </el-form-item>
                            <el-form-item v-show='props.row.stepType == 0 && props.row.stepStatus != "SKIPPED"'
                                          label="【SQL执行结果】:">
                                <span v-if="props.row.actualResult === null">无</span>
                                <span>{{ props.row.actualResult }}</span>
                            </el-form-item>
                            <el-form-item v-show='props.row.stepType == 0 && props.row.stepStatus != "SKIPPED"'
                                          label="【SQL名称】:">
                                <span v-if="props.row.sqlName === null">无</span>
                                <span>{{ props.row.sqlName }}</span>
                            </el-form-item>
                            <el-form-item v-show='props.row.stepType == 0 && props.row.stepStatus != "SKIPPED"'
                                          label="【SQL语句】:">
                                <span v-if="props.row.actualInparam === null">无</span>
                                <span>{{ props.row.actualInparam }}</span>
                            </el-form-item>

                            <el-form-item v-show='props.row.stepStatus == "SKIPPED"' label="【步骤期望结果】:">
                                <span v-if="props.row.stepCheckPoint === null || props.row.stepCheckPoint === ''">无</span>
                                <span>{{ props.row.stepCheckPoint }}</span>
                            </el-form-item>

                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                        label="步骤名称"
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.stepName}}</span>

                    </template>
                </el-table-column>
                <el-table-column
                        label="接口/sql/用例Id"
                        align="center"

                >
                    <template slot-scope="scope">
                        <span>{{scope.row.apiId}}</span>

                    </template>
                </el-table-column>

                <el-table-column
                        label="类型"
                        width="70">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stepType === 0">SQL</span>
                        <span v-else-if="scope.row.stepType === 1">接口</span>
                        <span v-else>用例</span>

                    </template>
                </el-table-column>
                <el-table-column
                        label="步骤入参"
                >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.inParam" placement="top-start">
                            <span>{{scope.row.inParam | ellipsis}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                        label="步骤出参"
                        :formatter="formatterOutParam"
                        align="center"
                >
                    <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.outParam}}</span>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column label="响应时长" width="150" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.responseTime == null">-</span>
                        <span v-else>{{scope.row.responseTime}}s</span>
                    </template>
                </el-table-column>

                <el-table-column label="步骤状态" width="150" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stepStatus =='SUCCESS'"><el-tag
                                type="success" effect="dark">{{scope.row.stepStatus}}</el-tag></span>
                        <span v-else-if="scope.row.stepStatus =='FAILURE'" ><el-tag type="danger" effect="dark">{{scope.row.stepStatus}}</el-tag></span>
                        <span v-else><el-tag type="info" effect="dark">SKIPPED</el-tag></span>
                    </template>
                </el-table-column>
            </el-table>

        </el-main>


    </el-container>

</template>

<script>

    import {
        getMultiCaseReport, getMultiApiCaseDetail
    } from '@/api/multi-api/multi-api-report'

    export default {
        name: "dailyReport",
        filters: {
            ellipsis(value) {
                if (!value) return "";
                if (value.length > 100) {
                    return value.slice(0, 100) + "...";
                }
                return value;
            }
        },

        data() {
            return {
                tableData: [],
                exeTime: "",
                caseData: {},
                caseRunStatusRate: {
                    passRate: 0.00,
                    failRate: 0.00,
                    erroeRate: 0.00,
                    notRunRate: 0.00
                }

            }
        },
        created() {
            this.getMultiApiCaseDetail();
            this.getTableData();
        },
        methods: {
            getTableData() {
                var caseId = this.$route.query.id;
                getMultiCaseReport({"multiCaseId": caseId}
                ).then(response => {
                    this.tableData = response.data;
                })

            },
            getMultiApiCaseDetail() {
                var caseId = this.$route.query.id;
                getMultiApiCaseDetail({"multiCaseId": caseId}
                ).then(response => {
                    this.caseData = response.data;
                    this.exeTime = this.timeTransfer(parseInt(this.caseData.version));
                    this.caseRunStatusRate = {
                        passRate: this.caseData.allNum !== 0 ? parseFloat((this.caseData.passNum / this.caseData.allNum * 100).toFixed(2)) : 0.00,
                        failRate: this.caseData.allNum !== 0 ? parseFloat((this.caseData.failedNum / this.caseData.allNum * 100).toFixed(2)) : 0.00,
                        skippedRate: this.caseData.allNum !== 0 ? parseFloat((this.caseData.skippedNum / this.caseData.allNum * 100).toFixed(2)) : 0.00,
                    }
                })

            },
            timeTransfer(date) {
                var date = new Date(date);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
                return Y+M+D+h+m+s;
            },
            formatterOutParam(row, column) {
                if (row.outParam == null || row.outParam == '') {
                    return ''
                }
                var arr = eval(row.outParam);
                if (arr.length == 0) {
                    return '';
                }
                var result = '';
                for (var i = 0; i < arr.length; i++) {
                    result = result + arr[i].key + '(' + arr[i].keyAs + '),'
                }
                return result.substring(0, result.length - 1);
            }
        }
    }
</script>
<style lang="stylus" scoped>

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }

    .el-header {
        background-color: rgb(48, 65, 86);
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .dashboard-editor-container {
        padding: 32px;
        background-color: rgb(240, 242, 245);
        position: relative;
    }

    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 30px;
        height: 320px;
    }

    @media (max-width: 1024px) {
        .chart-wrapper {
            padding: 8px;
        }
    }

    .el-container {
        margin-bottom: 40px;
        background-color: rgb(240, 242, 245);
    }

    .table-expand {
        font-size: 0;
    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .position-middle {
        vertical-align middle
        color: #7c7c7c;

    }

    .drawer-padding {
        padding: 10px 0px 20px 20px
        height: 600px;
        overflow: auto;
    }

    .position-title {
        vertical-align middle
        color: #7c7c7c;

    }
</style>
