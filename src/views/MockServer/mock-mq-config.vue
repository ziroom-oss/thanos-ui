<template>
    <div class="app-container">
        <div style="height: 150px">
            <div class="search-wrap">
                <el-row :gutter="32">
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">配置名：</span>
                            <el-input class="search-item"
                                      placeholder="请输入配置名称(支持模糊搜索)"
                                      v-model="searchObj.name"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">MQ服务器：</span>
                            <el-input class="search-item"
                                      placeholder="请输入服务器链接信息(支持模糊搜索)"
                                      v-model="searchObj.brokerHost"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">MQ消息类型：</span>
                            <el-select v-model="searchObj.type" filterable placeholder="可选择或输入搜索">
                                <el-option
                                        v-for="item in typeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
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
            <el-button type="primary" size="small" @click="createConfig">新增配置</el-button>
        </el-row>

        <el-table
                :data="configList"
                stripe
                fit
                highlight-current-row
                height="550"
                v-loading="loading"
        >
            <el-table-column align="center" label="配置ID" prop="id" width="80" />
            <el-table-column align="center" label="配置名">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="MQ服务器">
                <template slot-scope="scope">
                    <span>{{scope.row.brokerHost}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="MQ消息类型">
                <template slot-scope="scope">
                    <span>{{scope.row.typeName}}</span>
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
            <el-table-column align="center" width="200" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit"
                               @click="editMqConfig(scope.row.id)">编辑
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete"
                               @click="deleteMqConfig(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                    @pagination="getListByPage">
        </pagination>
        <mqConfigForm ref="configRef" :dialog-visible-prop="dialogVisibleVal" :config-form-prop="configFormVal" :dialog-title-prop="dialogTitleVal"
                          @saveMqConfigAndRefresh="getListByPage" @closeEv="closeDialog"></mqConfigForm>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination/index'
    import mqConfigForm from './component/mq-config-form'
    import {
        getMqConfigList,
        getMockMqConfigInfo,
        deleteMockMqConfig,
        getMockMqTypes
    } from "../../api/mockserver/mock-mq-config";

    export default {
        name: "mock-mq-msg",
        components: {Pagination,mqConfigForm},
        data() {
            return {
                searchObj: {
                    name: "",
                    brokerHost: "",
                    type: ""
                },
                typeList:[],
                total: 0,
                pageNum: 1,
                pageSize: 10,
                configList: [],
                loading: false,
                dialogVisibleVal: false,
                configFormVal: {},
                dialogTitleVal: "",
            }
        },
        created() {
            this.getListByPage();
            this.getTypeList();
        },
        methods: {
            getListByPage() {
                this.loading = true;
                getMqConfigList({'pageNum': this.pageNum, 'pageSize': this.pageSize}, this.searchObj).then(response => {
                    debugger;
                    this.configList = response.data.records.map(item => {
                        if(item["externalKey"]){
                            let arr = item["externalKey"].split("/");
                            if(arr.length == 3){
                                item["virtualHost"] = arr[0];
                                item["exchangeName"] = arr[1];
                                item["exchangeType"] = arr[2];
                            }else {
                                item["tag"] = item["externalKey"];
                            }
                        }
                        return item;
                    })
                    this.total = response.data.total;
                    this.loading = false;
                })
            },
            resetSearchEv() {
                this.searchObj = {
                    name: "",
                    brokerHost: "",
                    type: ""
                };
                this.getListByPage()
            },
            getTypeList(){
                getMockMqTypes().then(response =>{
                    if(response.success){
                        this.typeList = response.data;
                    }else {
                        this.$message({
                            message: "获取MQ消息类型失败！",
                            type: 'error'
                        });
                    }
                })
            },
            createConfig(){
                this.configFormVal = {};
                this.dialogTitleVal = "新增MQ配置";
                this.dialogVisibleVal = true;
            },
            editMqConfig(id){
                this.dialogTitleVal = "编辑MQ配置"
                this.dialogVisibleVal = true;
                getMockMqConfigInfo({id: id}).then(response =>{
                    if(response.success){
                        let temp = response.data;
                        if(temp["externalKey"]){
                            let arr = temp["externalKey"].split("/");
                            if(arr.length == 3){
                                temp["virtualHost"] = arr[0];
                                temp["exchangeName"] = arr[1];
                                temp["exchangeType"] = arr[2];
                            }else {
                                temp["tag"] = temp["externalKey"];
                            }

                        }
                        this.configFormVal = temp;
                    }else {
                        this.$message({
                            message: "获取MQ消息配置信息失败！",
                            type: 'error'
                        });
                    }
                })
            },
            closeDialog(){
                this.dialogVisibleVal = false;
            },
            deleteMqConfig(id){
                this.$confirm('是否确认删除MQ服务配置?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMockMqConfig({id:id}).then(response=>{
                        this.handleCommonMessage(response, this.getListByPage());
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