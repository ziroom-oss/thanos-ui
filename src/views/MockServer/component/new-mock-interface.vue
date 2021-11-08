<template>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeEv">
        <el-form :model="modelForm" label-width="80px" :rules="rules" ref="ruleForm">
            <el-form-item label="请求类型" prop="requestType">
                <el-select style="width: 100%" v-model="modelForm.requestType" placeholder="请选择请求类型" value="">
                    <el-option label="GET" value="GET"></el-option>
                    <el-option label="POST" value="POST"></el-option>
                    <el-option label="PUT" value="PUT"></el-option>
                    <el-option label="DELETE" value="DELETE"></el-option>
                    <el-option label="OPTION" value="OPTION"></el-option>
                    <el-option label="HEAD" value="HEAD"></el-option>
                    <el-option label="RPC" value="RPC"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请求URI" prop="requestUri">
                <el-input v-model="modelForm.requestUri" placeholder="请输入接口请求URI"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeEv">取 消</el-button>
            <el-button type="primary" @click="saveNewInterface">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {addNewMockInterface} from "../../../api/mockserver/mock-data";

    export default {
        name: "new-mock-interface",
        props: {
            dialogTitleProp: {
                type: String,
                default: '新增Mock接口信息'
            },
            dialogVisibleProp: {
                type: Boolean,
                default: false
            },
            modelFormProp: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                dialogTitle: this.dialogTitleProp,
                dialogVisible: this.dialogVisibleProp,
                modelForm: this.modelFormProp,
                appId: '',
                systemId: '',

                rules: {
                    requestType: [
                        {required: true, message: '请选择请求类型', trigger: 'change'}
                    ],
                    requestUri: [
                        {required: true, message: '请输入接口请求URI', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            saveNewInterface() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let postData = {
                            appId: this.appId,
                            reqUriMatcher: this.modelForm.requestUri,
                            reqMethodMatcher: this.modelForm.requestType,
                        };
                        addNewMockInterface(postData).then(response => {
                            if (response.success) {
                                this.dialogVisible = false;
                                this.$refs['ruleForm'].resetFields();
                                this.$message({
                                    type: 'success',
                                    message: '新增Mock接口信息操作成功'
                                });
                                this.$emit('saveInterfaceToRefreshEv')
                            }
                        });
                    }
                });
            },
            closeEv() {
                this.$refs['ruleForm'].resetFields();
                this.$emit('closeEv')
            }
        },
        watch: {
            dialogTitleProp(val) {
                this.dialogTitle = val
            },
            dialogVisibleProp(val) {
                this.dialogVisible = val
            },
            modelFormProp: {
                handler(val) {
                    this.modelForm = val
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>