<template>
    <div class="app-container">
        <div style="height: 150px">
            <div class="search-wrap">
                <el-row :gutter="32">
                    <!-- <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">应用环境：</span>
                            <el-select class="search-item" v-model="searchObj.envFlag" placeholder="请选择应用环境"
                                       value="" @change="getListByPage">
                                <el-option label="研发环境" value="d"></el-option>
                                <el-option label="测试环境" value="t"></el-option>
                                <el-option label="准生产环境" value="q"></el-option>
                                <el-option label="临时环境-研发" value="tmp"></el-option>
                                <el-option label="日常环境-测试" value="kt"></el-option>
                                <el-option label="日常环境-准生产" value="kq"></el-option>
                                <el-option label="Mock日常-测试" value="mkt"></el-option>
                                <el-option label="Mock日常-准生产" value="mkq"></el-option>
                            </el-select>
                        </div>
                    </el-col> -->
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">namespace：</span>
                            <el-input class="search-item"
                                      placeholder="请输入namespace(支持模糊搜索)"
                                      v-model="searchObj.appDesc"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col>
                    <!-- <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">应用类型：</span>
                            <el-select class="search-item" v-model="searchObj.appType" placeholder="请选择应用类型" value=""
                                       @change="getListByPage">
                                <el-option label="OS应用" value="0"></el-option>
                                <el-option label="Omega应用" value="1"></el-option>
                                <el-option label="Mock应用" value="2"></el-option>
                            </el-select>
                        </div>
                    </el-col> -->
                    <!-- <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">应用ID：</span>
                            <el-input class="search-item"
                                      placeholder="请输入应用IP或者ID(支持模糊搜索)"
                                      v-model="searchObj.appIp"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col> -->
                    
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">启用状态：</span>
                            <el-select class="search-item" v-model="searchObj.appStatus" placeholder="请选择启用状态"
                                       value="" @change="getListByPage">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="未启用" value="0"></el-option>
                                <el-option label="已启用" value="1"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="32">
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">应用名：</span>
                            <el-input class="search-item"
                                      placeholder="请输入应用名(支持模糊搜索)"
                                      v-model="searchObj.appName"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
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
                :data="systemList"
                stripe
                fit
                highlight-current-row
                height="550"
                v-loading="loading"
        >
            <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
            <!-- <el-table-column align="center" label="应用环境" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.envFlag | envFilter}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="应用名">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="mockDetailPage(scope.row.id)">
                        {{scope.row.appName}}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column align="center" label="namespace">
                <template slot-scope="scope">
                    <span>{{scope.row.appDesc}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="应用ID">
                <template slot-scope="scope">
                    <span>{{scope.row.appIp}}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column align="center" label="应用类型" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.appType | typeFilter}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="启用状态" width="100">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.appStatus ? '已启用' : '未启用'" placement="left">
                        <el-switch v-model="scope.row.appStatus" active-color="#13ce66"
                                   @change="changeEnableStatus(scope.row.id, scope.row.appStatus)"></el-switch>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最后更新人">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.updateUserCode !== null" placement="top-start" title="" width="300" trigger="hover">
                        <p>最后更新人：{{scope.row.updateUserName}}</p>
                        <p>最后更新时间：{{scope.row.updateTime}}</p>
                        <el-button slot="reference" plain round size="mini" type="warning">
                            {{scope.row.updateUserName}}
                        </el-button>
                    </el-popover>
                    <span v-else> - </span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-document"
                               @click="mockDetailPage(scope.row.id)">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                    @pagination="getListByPage">
        </pagination>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination/index'
    import {changeEnableStatus, getMockAppList} from "../../api/mockserver/moceApp";

    export default {
        name: "app-server-configuration",
        components: {Pagination},
        filters: {
            envFilter(env) {
                const statusMap = {
                    'd': '研发环境',
                    't': '测试环境',
                    'q': '准生产环境',
                    'tmp': '临时环境-研发',
                    'kt': '日常环境-测试',
                    'kq': '日常环境-准生产',
                    'mkt': 'Mock日常-测试',
                    'mkq': 'Mock日常-准生产',
                };
                return statusMap[env]
            },
            typeFilter(type){
                const typeMap={
                    0:"OS应用",
                    1:"Omega应用",
                    2:"Mock应用",
                };
                return typeMap[type]
            }
        },
        data() {
            return {
                searchObj: {
                    envFlag: '',
                    appDesc: '',
                    appType: '2',
                    appIp: '',
                    appName: 'gamma-gateway',
                    appStatus: ''
                },

                total: 0,
                pageNum: 1,
                pageSize: 10,

                systemList: [],
                loading: false
            }
        },
        created() {
            this.getListByPage();
        },
        methods: {
            getListByPage() {
                this.loading = true;
                getMockAppList({'pageNum': this.pageNum, 'pageSize': this.pageSize}, this.searchObj).then(response => {
                    this.systemList = response.data.records;
                    this.systemList.forEach(item => {
                        item.appStatus = item.appStatus === 1;
                    });
                    this.total = response.data.total;
                    this.loading = false;
                })
            },
            resetSearchEv() {
                this.searchObj = {
                    envFlag: '',
                    appDesc: '',
                    appType: '',
                    appIp: '',
                    appName: '',
                    appStatus: ''
                };
                this.getListByPage()
            },
            changeEnableStatus(id, flag) {
                let postData = new URLSearchParams();
                postData.append('id', id);
                postData.append('flag', flag);

                changeEnableStatus(postData).then(response => {
                    if (response.success) {
                        this.$message({
                            type: 'success',
                            message: flag ? '应用服务器Mock已启用' : '应用服务器Mock已禁用'
                        });
                    }
                    // this.getListByPage();
                })
            },
            mockDetailPage(id) {
                this.$router.push({
                    path: '/mock-server/mock-detail-app',
                    query: {'id': id}
                })
            }
        }
    }
</script>

<style scoped>
    .search-label {
        float: left;
        width: 22%;
        margin-top: 1.5%;
        font-size: 14px;
    }
</style>