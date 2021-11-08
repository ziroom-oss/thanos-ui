<template>
    <div class="app-container">
        <div style="height: 150px">
            <div class="search-wrap">
                <el-row :gutter="32">
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">证书名称：</span>
                            <el-input class="search-item" placeholder="请输入证书名称"
                                      v-model="searchObj.certName"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">文件名称：</span>
                            <el-input class="search-item"
                                      placeholder="请输入证书文件名称(支持模糊搜索)"
                                      v-model="searchObj.fileName"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">用户姓名：</span>
                            <el-input class="search-item"
                                      placeholder="请输入用户姓名(支持模糊搜索)"
                                      v-model="searchObj.userName"
                                      clearable @keyup.enter.native="getListByPage">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">启用状态：</span>
                            <el-select class="search-item" v-model="searchObj.enableStatus" placeholder="请选择启用状态"
                                       value="" @change="getListByPage">
                                <el-option label="未启用" value="0"></el-option>
                                <el-option label="已启用" value="1"></el-option>
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
            <el-button type="primary" size="small" @click="importSslCert">新增证书</el-button>
        </el-row>

        <el-table
                :data="certList"
                stripe
                fit
                highlight-current-row
                style="width: 100%;height:500px;font-size: 15px"
        >
            <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
            <el-table-column label="证书名称" align="center">
                <template slot-scope="scope">
                    {{scope.row.certName}}
                </template>
            </el-table-column>
            <el-table-column label="文件名称" align="center">
                <template slot-scope="scope">
                    {{scope.row.fileName}}
                </template>
            </el-table-column>
            <el-table-column label="启用状态" align="center" width="180">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.enableStatus"
                               @change="changeEnable(scope.row.id, scope.row.enableStatus)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="用户姓名" align="center" width="180">
                <template slot-scope="scope">
                    {{scope.row.userName}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" width="180">
                <template slot-scope="scope">
                    {{scope.row.createTime}}
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                    @pagination="getListByPage">
        </pagination>
        <el-dialog :title="uploadDialogTitle" :visible="fileUploadVisible" width="45%" @close="closeEv">
            <file-upload
                    ref="fileUploadRef"
                    :acceptFileTypeProp="fileType"
                    :limitFileCountProp="fileCount"
                    :uploadFileListProp="fileList"
                    @fileUploadFuncEv="fileUploadHttp"
            >
            </file-upload>
            <div style="height: 20px;margin: 30px 0 20px 0">
                <span style="float: left;margin-top: 10px;color: black">证书名称：</span>
                <el-input style="width: 50%;float: left" v-model="certSavedName" placeholder="请输入用户证书名称"></el-input>
                <div style="float: right">
                    <el-button @click="closeEv">取 消</el-button>
                    <el-button type="primary" @click="saveSslCert">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import fileUpload from '@/components/FileUpload'
    import Pagination from '@/components/Pagination/index'
    import {changeSslEnable, getSslCertByPage, saveMockSslCert, sslUpload} from "../../api/mockserver/moceApp";

    export default {
        name: "ssl-configuration",
        components: {Pagination, fileUpload},
        data() {
            return {
                searchObj: {
                    certName: '',
                    fileName: '',
                    userName: '',
                    enableStatus: ''
                },
                certSavedName: '',
                uploadDialogTitle: 'SSL自定义安全证书导入',
                fileUploadVisible: false,
                fileType: 'jks，jmx',
                fileCount: 1,
                fileList: [],
                certList: [],
                total: 0,
                pageNum: 1,
                pageSize: 10,
                sslFileName: '',
                sslFilePath: ''
            }
        },
        created() {
            this.getListByPage()
        },
        methods: {
            getListByPage() {
                getSslCertByPage({'pageNum': this.pageNum, 'pageSize': this.pageSize}, {
                    certName: this.searchObj.certName,
                    fileName: this.searchObj.fileName,
                    userName: this.searchObj.userName,
                    enableStatus: this.searchObj.enableStatus
                }).then(response => {
                    if (response.success) {
                        this.total = response.data.total;
                        this.certList = response.data.records;
                        this.certList.forEach(item => {
                            item.enableStatus = item.enableStatus === 1;
                        });
                    }
                })
            },
            resetSearchEv() {
                this.searchObj = {};
                this.getListByPage();
            },
            importSslCert() {
                this.fileUploadVisible = true
            },
            fileUploadHttp(param) {
                sslUpload(param).then(response => {
                    if (response.success) {
                        this.sslFilePath = response.data;
                        this.sslFileName = this.sslFilePath.substr(this.sslFilePath.lastIndexOf('/') + 1);
                    }
                })
            },
            saveSslCert() {
                if (this.$refs['fileUploadRef'].uploadFileList.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '请先完成文件上传操作'
                    });
                    return false;
                }
                if (this.certSavedName === '') {
                    this.$message({
                        type: 'warning',
                        message: '证书名称不能为空'
                    });
                    return false;
                }
                saveMockSslCert({
                    certName: this.certSavedName,
                    fileName: this.sslFileName,
                    filePath: this.sslFilePath
                }).then(response => {
                    if (response.success) {
                        this.getListByPage();
                        this.fileUploadVisible = false;
                        this.fileList = [];
                        this.certSavedName = '';
                        this.sslFileName = ''
                    }
                })
            },
            changeEnable(id, status) {
                changeSslEnable({'id': id, 'status': status ? 1 : 0}).then(response => {
                    if (response.success) {
                        this.$message({
                            type: 'success',
                            message: status ? 'Mock接口证书启用成功~' : 'Mock接口证书禁用成功~'
                        });
                    }
                    this.getListByPage();
                })
            },
            closeEv() {
                this.fileUploadVisible = false
            }
        }
    }
</script>

<style scoped>

</style>