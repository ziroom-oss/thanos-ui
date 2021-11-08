<template>
    <div class="app-container">
        <div style="height: 150px">
            <div class="search-wrap">
                <el-row :gutter="32">
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">请求方式：</span>
                            <el-select class="search-item" v-model="searchObj.requestMethod" placeholder="请选择请求方式"
                                       value="" @change="getListByPage">
                                <el-option label="GET" value="GET"></el-option>
                                <el-option label="POST" value="POST"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">是否Mock：</span>
                            <el-select class="search-item" v-model="searchObj.isMatched" placeholder="请选择是否匹配Mock"
                                       value="" @change="getListByPage">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="Unmocked" value="0"></el-option>
                                <el-option label="Mocked" value="1"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">请求URI：</span>
                            <el-input class="search-item"
                                      placeholder="请输入请求URI(支持模糊搜索)"
                                      v-model="searchObj.uri"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">时间范围：</span>
                            <el-date-picker class="search-item"
                                            v-model="searchObj.dateTimeRange"
                                            type="datetimerange"
                                            :picker-options="pickerOptions"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            align="right"
                                            @change="getListByPage"
                            >
                            </el-date-picker>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-button type="primary" @click="getListByPage">查询</el-button>
                <el-button class="bot-btn" @click="resetSearchEv">重置</el-button>
            </div>
        </div>

        <el-table
                :data="recordList"
                stripe
                border
                fit
                highlight-current-row
                height="550"
                v-loading="loading"
                style="width: 100%;font-size: 15px"
        >
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column label="请求方式" align="center" width="100">
                <template slot-scope="scope">
                    {{scope.row.requestMethod}}
                </template>
            </el-table-column>
            <el-table-column label="请求方IP" align="center" width="110">
                <template slot-scope="scope">
                    <span v-if="scope.row.srcHost === null">未知请求方IP</span>
                    <span v-else>{{scope.row.srcHost}}</span>
                </template>
            </el-table-column>
            <el-table-column label="被请求方IP/Host" align="center" width="200">
                <template slot-scope="scope">
                    {{scope.row.dstHost}}
                </template>
            </el-table-column>
            <el-table-column label="请求URI" align="center">
                <template slot-scope="scope">
                    {{scope.row.uri}}
                </template>
            </el-table-column>
            <el-table-column label="是否Mock" align="center" width="90">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isMatched === 0" size="mini" type="info" plain>Unmocked</el-tag>
                    <el-tag v-else size="mini" type="success">Mocked</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="日志时间" align="center" width="180">
                <template slot-scope="scope">
                    {{scope.row.logTime}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-document"
                               @click="mockDetail(scope.row.requestDetail, scope.row.responseDetail)">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-drawer
                title="Mock请求详情信息"
                :visible.sync="drawer"
                direction="rtl"
                size="40%"
        >
            <div style="height:85vh; overflow-y:auto">
                <div style="margin: 0 30px 45px 30px">
                    <h4 style="font-size: 16px">请求信息</h4>
                    <div style="width: 90%;margin-left: 30px">
                        <el-input type="textarea" :rows="15" v-model="drawerBody.requestDetail"></el-input>
                    </div>
                </div>
                <div style="margin: 45px 30px">
                    <h4 style="font-size: 16px">响应信息</h4>
                    <div style="width: 90%;margin-left: 30px">
                        <el-input type="textarea" :rows="15" v-model="drawerBody.responseDetail"></el-input>
                    </div>
                </div>
            </div>
        </el-drawer>
        <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                    @pagination="getListByPage">
        </pagination>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination/index'
    import {getMockLogListByPage} from "../../api/mockserver/mock-data";

    export default {
        name: "mock-log-record",
        components: {Pagination},
        data() {
            return {
                searchObj: {
                    requestMethod: '',
                    isMatched: '',
                    uri: '',
                    // 默认查询最近半小时的数据
                    dateTimeRange: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 0.5), new Date()]
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近三天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                recordList: [],
                drawer: false,
                drawerBody: {},
                total: 0,
                pageNum: 1,
                pageSize: 10,
                loading: false
            }
        },
        created() {
            this.getListByPage();
        },
        methods: {
            getListByPage() {
                this.loading = true;
                debugger
                getMockLogListByPage({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }, {
                    requestMethod: this.searchObj.requestMethod,
                    isMatched: this.searchObj.isMatched,
                    uri: this.searchObj.uri,
                    startTime: this.searchObj.dateTimeRange == null ? "": this.searchObj.dateTimeRange[0],
                    endTime: this.searchObj.dateTimeRange == null ? "": this.searchObj.dateTimeRange[1]
                }).then(response => {
                    if (response.success) {
                        this.recordList = response.data.records;
                        this.total = response.data.total;
                        this.loading = false;
                    }
                })
            },
            mockDetail(requestDetail, responseDetail) {
                this.drawerBody = {};
                this.drawer = true;
                this.drawerBody.requestDetail = requestDetail;
                this.drawerBody.responseDetail = responseDetail;
            },
            resetSearchEv() {
                this.searchObj = {
                    requestMethod: '',
                    isMatched: '',
                    uri: '',
                    dateTimeRange: ''
                };
                this.getListByPage();
            },
        }
    }
</script>

<style scoped>
    .search-label {
        float: left;
        width: 15%;
        margin-top: 1.5%;
        font-size: 14px;
    }

</style>