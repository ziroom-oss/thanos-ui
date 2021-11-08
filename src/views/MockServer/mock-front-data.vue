<template>
    <div class="app-container">
        <div style="height: 150px">
            <div class="search-wrap">
                <el-row :gutter="32">
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">URL：</span>
                            <el-input class="search-item"
                                      placeholder="请输入请求的URL(支持模糊搜索)"
                                      v-model="searchObj.reqUrl"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">Mock状态：</span>
                            <el-select class="search-item" v-model="searchObj.mockStatus" placeholder="请选择Mock状态"
                                       value="" @change="getListByPage">
                                <el-option label="全部" value="2"></el-option>
                                <el-option label="未启用" :value="0"></el-option>
                                <el-option label="已启用" :value="1"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-button type="primary" @click="getListByPage">查询</el-button>
                <el-button class="bot-btn" @click="resetSearchEv">重置</el-button>
            </div>
        </div>

        <el-row style="margin-bottom: 20px">
            <el-button type="primary" size="small" @click="handleCreateMockData">新增Mock数据</el-button>
        </el-row>

        <el-table
                :data="dataList"
                stripe
                fit
                highlight-current-row
                height="550"
                v-loading="loading"
        >
            <el-table-column align="center" label="ID" prop="id" width="120"/>
            <el-table-column align="center" label="请求类型" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.reqMethodMatcher ? scope.row.reqMethodMatcher:"匹配所有"}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="URL">
                <template slot-scope="scope">
                    <span>{{scope.row.reqUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="启用状态" width="100">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.mockStatus === 1 ? '已启用' : '未启用'" placement="left">
                        <el-switch v-model="scope.row.mockStatus" active-color="#13ce66" :active-value="1"
                                   :inactive-value="0"
                                   @change="changeEnableStatus(scope.row.id, scope.row.mockStatus)"></el-switch>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最后修改人" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.updateUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最后修改时间" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.updateTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="300" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-document"
                               @click="handleViewMockData(scope.row)">详情
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-document"
                               @click="handleEditMockData(scope.row)">编辑
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-document"
                               @click="deleteFrontData(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                    @pagination="getListByPage">
        </pagination>
        <el-drawer :title="drawerTitle" size="60%" :visible.sync="drawerVisible" :before-close="handleClose">
            <div style="height:88vh; overflow-y:auto">
                <div>
                    <div style="margin: 0 30px" class="clearfix">
                        <!--                        <h4 style="font-size: 16px">Mock接口信息</h4>-->
                        <div style="width: 23%;float: left">
                            <el-select class="search-item" v-model="form.reqMethodMatcher" placeholder="请求类型"
                                       value="">
                                <el-option label="匹配所有" value="" default></el-option>
                                <el-option label="GET" value="GET"></el-option>
                                <el-option label="POST" value="POST"></el-option>
                                <el-option label="PUT" value="PUT"></el-option>
                                <el-option label="DELETE" value="DELETE"></el-option>
                                <el-option label="OPTION" value="OPTION"></el-option>
                                <el-option label="HEAD" value="HEAD"></el-option>
                            </el-select>
                        </div>
                        <div style="width: 76%;float: right">
                            <el-input placeholder="输入请求URL" v-model="form.reqUrl" :disabled="viewFlag"
                                      class="input-with-select">
                                <el-select v-model="protocol" slot="prepend" class="pre-select">
                                    <el-option value="http://"></el-option>
                                    <el-option value="https://"></el-option>
                                </el-select>
                            </el-input>

                        </div>
                    </div>
                    <div style="margin: 45px 30px" class="clearfix">
                        <h4 style="font-size: 16px">请求信息</h4>
                        <div style="width: 48%;float: left">
                            <div style="margin-bottom: 15px">请求头<span
                                    style="color: gray;font-size: 13px">（支持正则表达式）</span>
                            </div>
                            <el-input type="textarea" :rows="8" v-model="form.reqHeaderMatcher"
                                      :disabled="viewFlag" placeholder="（*必填）User-Agent:xxxxxx"></el-input>
                        </div>

                        <div style="width: 48%;float: right">
                            <div style="margin-bottom: 15px">请求Cookie<span
                                    style="color: gray;font-size: 13px">（支持正则表达式）</span>
                            </div>
                            <el-input type="textarea" :rows="8" v-model="form.reqCookieMatcher"
                                      :disabled="viewFlag"></el-input>
                        </div>

                        <div style="width: 48%;float: left;margin-top: 30px">
                            <div style="margin-bottom: 15px">请求参数<span style="color: gray;font-size: 13px">（QueryString：请求URL里面拼接的参数）</span>
                            </div>
                            <el-input type="textarea" :rows="8" v-model="form.reqQueryStrMatcher"
                                      :disabled="viewFlag"></el-input>
                        </div>

                        <div style="width: 48%;float: right;margin-top: 30px">
                            <div style="margin-bottom: 15px">请求体
                                <el-checkbox style="font-size: 13px;margin-left: 10px" v-model="form.encrypted" border
                                             size="mini" :true-label="1" :disabled="viewFlag">网关加密
                                </el-checkbox>
                                <span style="color: gray;font-size: 13px;float: right;margin-top: -12px">
                                <el-select v-model="form.reqBodyMatcher.type" placeholder="请选择请求体匹配类型" value=""
                                           :disabled="viewFlag">
                                    <el-option label="匹配任意" value=""></el-option>
                                    <el-option label="全匹配" value="0"></el-option>
                                    <el-option label="包含" value="1"></el-option>
                                    <el-option label="XPath" value="2"></el-option>
                                    <el-option label="JSONPath" value="3"></el-option>
                                </el-select>
                            </span>
                            </div>
                            <el-input type="textarea" :rows="8" v-model="form.reqBodyMatcher.body"
                                      placeholder="支持正则表达式、XPath、JSONPath等"
                                      :disabled="viewFlag"></el-input>
                        </div>
                    </div>
                    <div style="margin: 45px 30px" class="clearfix">
                        <h4 style="font-size: 16px">响应信息</h4>
                        <div>
                            <span style="float: left;width: 15%;margin-top: 5px">响应码：</span>
                            <el-input style="float: left;width: 85%" v-model="form.respStatusCodeMock"
                                      :disabled="viewFlag"></el-input>
                        </div>
                        <div style="width: 48%;float: left;margin-top: 20px">
                            <div style="margin-bottom: 15px">响应头</div>
                            <el-input type="textarea" :rows="8" v-model="form.respHeaderMock"
                                      :disabled="viewFlag"></el-input>
                        </div>

                        <div style="width: 48%;float: right;margin-top: 20px">
                            <div style="margin-bottom: 15px">响应体</div>
                            <el-input type="textarea" :rows="8" v-model="form.respBodyMock"
                                      :disabled="viewFlag"></el-input>
                        </div>
                    </div>
                </div>
                <div v-if="!viewFlag" style="text-align: center">
                    <el-button @click="drawerVisible = false">取 消</el-button>
                    <el-button v-if="submitFlag" type="primary" @click="saveNew">保 存</el-button>
                    <el-button v-else type="primary" @click="saveEdit(form.id)">保 存</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination/index'
    import {
        getMockFrontDataList,
        saveMockFrontData,
        updateMockFrontData,
        deleteMockFrontData,
        changeMockFrontDataStatus
    } from "../../api/mockserver/mock-front-data";

    export default {
        name: "mock-front-data",
        components: {Pagination},
        data() {
            return {
                searchObj: {
                    reqUrl: "",
                    mockStatus: "2",
                },
                total: 0,
                pageNum: 1,
                pageSize: 10,
                dataList: [],
                form: {
                    reqMethodMatcher: "",
                    reqBodyMatcher: {
                        type: '',
                        body: ''
                    },
                    respStatusCodeMock: "200"
                },
                drawerVisible: false,
                viewFlag: false,
                dialogVisibleVal: false,
                modelFormVal: {},
                submitFlag: true,
                classWidth: '',
                activeCollapse: "1",
                drawerTitle: '',
                loading: false,
                protocol: 'http://',
            }
        },
        created() {
            this.getListByPage();
            this.resetForm();
        },
        methods: {
            getListByPage() {
                this.loading = true;
                getMockFrontDataList({
                    'pageNum': this.pageNum,
                    'pageSize': this.pageSize
                }, this.searchObj).then(response => {
                    this.dataList = response.data.records;
                    this.total = response.data.total;
                    this.loading = false;
                })
            },
            handleCreateMockData() {
                this.viewFlag = false;
                this.submitFlag = true;
                this.drawerTitle = '新增Mock信息';
                // this.classWidth = 'width48';
                this.resetForm();
                this.drawerVisible = true
            },
            handleEditMockData(row) {
                this.viewFlag = false;
                this.submitFlag = false;
                this.drawerTitle = '编辑Mock信息';
                row['protocol'] = row["reqUrl"].indexOf("http://") == 0 ? 'http://' : 'https://'
                row['reqUrl'] = row['reqUrl'].replace(row['protocol'], "");
                this.form = row;
                if (this.form.reqBodyMatcher === null) {
                    this.form.reqBodyMatcher = {
                        type: '',
                        body: ''
                    }
                }
                if (typeof this.form.reqBodyMatcher === 'string') {
                    this.form.reqBodyMatcher = JSON.parse(this.form.reqBodyMatcher)
                }
                this.classWidth = 'width48';
                this.drawerVisible = true
            },
            handleViewMockData(row) {
                this.viewFlag = true;
                this.drawerTitle = '查看Mock信息';
                this.form = row;
                if (this.form.reqBodyMatcher === null) {
                    this.form.reqBodyMatcher = {
                        type: '',
                        body: ''
                    }
                }
                if (typeof this.form.reqBodyMatcher === 'string') {
                    this.form.reqBodyMatcher = JSON.parse(this.form.reqBodyMatcher)
                }
                this.classWidth = 'width48';
                this.drawerVisible = true
            },
            resetSearchEv() {
                this.searchObj = {
                    reqUrl: "",
                    mockStatus: "2",
                };
                this.getListByPage()
            },
            saveNew() {
                this.submitFlag = true;

                let data = JSON.parse(JSON.stringify(this.form))
                data["reqUrl"] = this.protocol + data["reqUrl"];
                data["reqBodyMatcher"] = JSON.stringify(data["reqBodyMatcher"]);
                if (JSON.parse(data['reqBodyMatcher'])['type'] === "") {
                    delete (data['reqBodyMatcher']);
                }
                saveMockFrontData(data).then(response => {
                    this.handleCommonMessage(response, this.getListByPage)
                    this.drawerVisible = false;
                })
            },
            saveEdit(id) {
                this.submitFlag = true;
                let data = JSON.parse(JSON.stringify(this.form))
                data["reqUrl"] = this.protocol + data["reqUrl"];
                data["reqBodyMatcher"] = JSON.stringify(data["reqBodyMatcher"]);
                if (JSON.parse(data['reqBodyMatcher'])['type'] === "") {
                    delete (data['reqBodyMatcher']);
                }
                updateMockFrontData(data).then(response => {
                    this.handleCommonMessage(response, this.getListByPage)
                    this.drawerVisible = false;
                })
            },
            deleteFrontData(id) {
                this.$confirm('是否确认删除Mock数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMockFrontData({id: id}).then(response => {
                        this.handleCommonMessage(response, this.getListByPage);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleCommonMessage(response, func) {
                if (response.success) {
                    this.$message({
                        message: response.data,
                        type: 'success'
                    });
                    func();
                } else {
                    this.$message({
                        message: response.errorMessage,
                        type: 'error'
                    });
                }
            },
            handleClose(done) {
                if (!this.viewFlag) {
                    this.$confirm('确认关闭操作？')
                        .then(_ => {
                            done();
                        })
                        .catch(_ => {
                        });
                } else {
                    done();
                }
            },
            changeEnableStatus(id, mockStatus) {
                changeMockFrontDataStatus({id: id, status: mockStatus}).then(response => {
                    this.handleCommonMessage(response)
                })
            },
            resetForm() {
                this.form = {
                    reqMethodMatcher: "",
                    reqBodyMatcher: {
                        type: '',
                        body: ''
                    },
                    respStatusCodeMock: "200"
                }
            }
        }
    }
</script>

<style scoped>
    .pre-select {
        width: 100px;
    }
</style>