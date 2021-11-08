<template>
    <el-upload
            drag
            :multiple="limitFileCount>1"
            action=""
            :accept="acceptFileType"
            :limit="limitFileCount"
            :file-list="uploadFileList"
            :before-upload="beforeFileUpload"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :on-exceed="handleFileLimit"
            :http-request="fileUploadHttp"
    >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">点击上传文件<br/><br/><span v-if="limitFileCount>1">支持多选文件上传</span></div>
        <div style="color: orange" class="el-upload__tip" slot="tip">
            <i class="el-icon-warning" style="margin-right: 5px"></i>
            仅支持上传{{acceptFileType}}格式文件，且单个文件大小不超过30MB
        </div>
        <div class="el-upload__tip overlay-upload-item" slot="tip">同名文件覆盖上传：
            <el-switch v-model="isOverlayUpload" active-color="#13ce66" @change="uploadFileList=[]"></el-switch>
            <el-tooltip content="默认同名文件上传操作，不覆盖上传" placement="right">
                <i class="el-icon-question question-icon"></i>
            </el-tooltip>
        </div>
    </el-upload>
</template>

<script>
    export default {
        name: "index",
        props: {
            acceptFileTypeProp: {
                type: String,
                default: ''
            },
            limitFileCountProp: {
                type: Number,
                default: 1
            },
            uploadFileListProp: {
                type: Array,
                default: () => {
                    return []
                }
            },
            isOverlayUploadProp: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                acceptFileType: this.acceptFileTypeProp,
                limitFileCount: this.limitFileCountProp,
                uploadFileList: this.uploadFileListProp,
                isOverlayUpload: this.isOverlayUploadProp
            }
        },
        methods: {
            beforeFileUpload(file) {
                const fileType = file.name.split('.').pop();
                const isAcceptFileType = this.acceptFileType.indexOf(fileType) > -1;
                const isMtFileSize = file.size / 1024 / 1024 < 30;

                if (!isAcceptFileType) {
                    this.$message.error('上传文件仅支持 ' + this.acceptFileType.replace(',', '/') + ' 格式!');
                    return false;
                }
                if (!isMtFileSize) {
                    this.$message.error('上传文件大小不能超过 30MB!');
                    return false;
                }
                return isAcceptFileType && isMtFileSize;
            },
            handleFileChange(file, fileList) {
                this.uploadFileList = fileList
            },
            handleFileRemove(file, fileList) {
                this.uploadFileList = fileList
            },
            handleFileLimit(files, fileList) {
                if (files.length + fileList.length >= this.limitFileCount) {
                    this.$message({
                        type: 'warning',
                        message: '单次最多支持上传 ' + this.limitFileCount + ' 个文件!'
                    });
                }
            },
            fileUploadHttp(file) {
                let param = new FormData();
                param.append('file', file.file);
                param.append('isOverlayUpload', this.isOverlayUpload);
                this.$emit('fileUploadFuncEv', param);
            }
        },
        watch: {
            acceptFileTypeProp(val) {
                this.acceptFileType = val;
            },
            limitFileCountProp(val) {
                this.limitFileCount = val;
            },
            uploadFileListProp: {
                handler(val) {
                    this.uploadFileList = val
                },
                deep: true
            },
            isOverlayUploadProp(val) {
                this.isOverlayUpload = val
            }
        }
    }
</script>

<style scoped>
    /deep/ .file-upload {
        padding-left: 15px;
        padding-right: 15px
    }

    /deep/ .el-upload {
        width: 100%
    }

    /deep/ .el-upload-dragger {
        width: 100%
    }

    .question-icon {
        margin-left: 15px;
        color: grey;
        vertical-align: middle
    }

    .overlay-upload-item {
        margin-top: 30px;
        font-size: 14px;
        color: #2d2f33
    }
</style>
