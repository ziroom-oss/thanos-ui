<template>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeEv"
               width="40%">
        <el-form :model="configForm" label-width="120px" :rules="rules" ref="ruleForm">
            <el-form-item label="配置名称" prop="name">
                <el-input v-model="configForm.name" placeholder="请输入配置名称"></el-input>
            </el-form-item>
            <el-form-item label="MQ类型" prop="type">
                <el-select style="width: 100%" v-model="configForm.type" placeholder="请选择MQ类型" value="">
                    <el-option label="Mqtt" :value="1"></el-option>
                    <el-option label="Kafka" :value="2"></el-option>
                    <el-option label="RabbitMq" :value="3"></el-option>
                    <el-option label="RocketMq" :value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="MQ服务器" prop="brokerHost">
                <el-input v-model="configForm.brokerHost" placeholder="请输入MQ服务器连接信息,域名/ip加端口"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="configForm.userName" placeholder="如需输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="configForm.password" placeholder="如需输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item v-if="configForm.type == '3'"
                          :rules="configForm.type == '3' ? rules.virtualHost :  [{ required: false}]"
                          label="VirtualHost" prop="virtualHost">
                <el-input v-model="configForm.virtualHost" placeholder="请输入vhost"></el-input>
            </el-form-item>
            <el-form-item v-if="configForm.type == '3'"
                          :rules="configForm.type == '3' ? rules.exchangeName :  [{ required: false}]"
                          label="Exchange名" prop="exchangeName">
                <el-input v-model="configForm.exchangeName" placeholder="如需输入交换机名"></el-input>
            </el-form-item>
            <el-form-item v-if="configForm.type == '3'"
                          :rules="configForm.type == '3' ? rules.exchangeType :  [{ required: false}]"
                          label="Exchange类型" prop="exchangeType">
                <el-select style="width: 100%" v-model="configForm.exchangeType" placeholder="请选择MQ类型" value="">
                    <el-option label="Direct" value="0"></el-option>
                    <el-option label="Topic" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="configForm.type == '4'"
                          label="Tag" prop="tag">
                <el-input v-model="configForm.tag" placeholder="如需输入tag"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeEv">取 消</el-button>
            <el-button type="primary" @click="saveMqConfig">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {saveMockMqConfig, updateMockMqConfig} from "../../../api/mockserver/mock-mq-config";

    export default {
        name: "mq-config-form",
        props: {
            dialogTitleProp: {
                type: String,
                default: ''
            },
            dialogVisibleProp: {
                type: Boolean,
                default: false
            },
            configFormProp: {
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
                configForm: this.configFormProp,
                rules: {
                    type: [
                        {required: true, message: '请选择MQ类型', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入MQ配置名称', trigger: 'blur'}
                    ],
                    brokerHost: [
                        {required: true, message: '请输入MQ服务器信息', trigger: 'blur'}
                    ],
                    virtualHost: [
                        {required: true, message: '请输入Rabbitmq vhost信息', trigger: 'blur'}
                    ],
                    exchangeName: [
                        {required: true, message: '请输入Rabbitmq交换机名', trigger: 'blur'}
                    ],
                    exchangeType: [
                        {required: true, message: '请输入Rabbitmq交换机类型', trigger: 'change'}
                    ],
                }
            }
        },
        methods: {
            saveMqConfig() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        debugger;
                        var extKey = "";
                        if(this.configForm.type == '3'){
                            extKey = this.configForm.virtualHost + '/' + this.configForm.exchangeName
                                + '/' + this.configForm.exchangeType;
                        }
                        if(this.configForm.type == '4'){
                            extKey = this.configForm.tag;
                        }
                        let postData = {
                            type: this.configForm.type,
                            name: this.configForm.name,
                            brokerHost: this.configForm.brokerHost,
                            userName: this.configForm.userName,
                            password: this.configForm.password,
                            externalKey: extKey
                        };
                        if (this.configForm.id) {
                            postData["id"] = this.configForm.id;
                            this.doEdit(postData);
                        } else {
                            this.doSave(postData);
                        }
                    }
                });
            },
            doSave(postData) {
                saveMockMqConfig(postData).then(response => {
                    if (response.success) {
                        this.dialogVisible = false;
                        this.$refs['ruleForm'].resetFields();
                        this.$message({
                            type: 'success',
                            message: '新增MQ配置操作成功！'
                        });
                        this.$emit('saveMqConfigAndRefresh')
                    }
                });
            },
            doEdit(postData) {
                updateMockMqConfig(postData).then(response => {
                    if (response.success) {
                        this.dialogVisible = false;
                        this.$refs['ruleForm'].resetFields();
                        this.$message({
                            type: 'success',
                            message: '编辑MQ配置操作成功！'
                        });
                        this.$emit('saveMqConfigAndRefresh')
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
            configFormProp: {
                handler(val) {
                    this.configForm = val
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>