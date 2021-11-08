<template>
    <div>
        <template>
            <el-radio v-model="caseType" label="1">数据工具</el-radio>
            <el-radio v-model="caseType" label="2">多接口</el-radio>
        </template>

        <div v-show="caseType=='2'">
            <div>
                <el-button size="mini" type="primary" class="el-icon-circle-plus-outline" @click="insertEvent(-1)"
                           style="margin-bottom:10px" plain>新增
                </el-button>
                <elx-editable ref="editable" :data.sync="pubParamData" border style="width: 50%"
                              empty-text="请点击【新增】添加公共参数呦">
                    <elx-editable-column prop="key" align="center" label="参数名称"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column prop="value" align="center" label="参数值"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click.native.prevent="deleteRow(scope.$index, pubParamData)"
                                    type="text"
                                    size="small">
                                删除
                            </el-button>
                        </template>
                    </elx-editable-column>
                </elx-editable>
            </div>

        </div>
        <div v-show="caseType=='1'" style="padding-top: 20px">
            <el-row>
                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    <el-select v-model="widgetId" multiple placeholder="请选择控件名称"
                               style="width:260px">
                        <el-option
                                v-for="item in widgetList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                    <el-button type="primary" size="small" @click="createWidget" plain>控件一键生成</el-button>
                </el-col>
            </el-row>
            <el-row   v-show="createForm == true" style="padding-top: 10px"
                    v-for="widget in widgetDetailList" :key="widget.id">

                <el-col :xs="20" :sm="8" :md="8" :lg="8" :xl="8">
                    对应接口参数 :
                    <div style="display:inline-block">
                        <el-input v-model="widget.key "
                                  placeholder="请输入参数值">
                        </el-input>
                    </div>
                </el-col>
                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    {{widget.name}} :
                    <el-input v-if="widget.type == '1'" v-model="widget.value " style="width: 130px;"
                              placeholder="请输入参数值">
                    </el-input>
                    <el-select v-else v-model="widget.wigetParam" filterable placeholder="请选择"
                               clearable>
                        <el-option
                                v-for="item in widget.wigetParamList"
                                :key="item.paramVal"
                                :value="item.paramVal"
                                :label="item.paramLable">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
                    <el-button @click.prevent="removeWigetList(widget)" icon="el-icon-minus" type="primary"
                               size="mini"
                               circle plain></el-button>
                </el-col>

            </el-row>

        </div>
    </div>

</template>

<script>
import {
  getComponmentList, getCommonParamList
} from '@/api/model/multiApiSave'

export default {
  name: 'pubParam',
  data () {
    return {
      createForm: false,
      widgetId: '',
      widgetList: [],
      caseType: '1',
      labelPosition: 'left',
      // 业务线列表信息
      businessList: [
        {
          businessName: '',
          businessCode: ''
        }
      ],
      pubJson: {},
      widgetDetailList: [],
      multiApiList: [],
      pubParamData: []
    }
  },
  created () {
    this.getComponmentList()
  },
  methods: {
    async createWidget () {
      this.createForm = true

      for (var i = 0; i < this.widgetId.length; i++) {
        for (var j = 0; j < this.widgetList.length; j++) {
          if (this.widgetId[i] === this.widgetList[j].id) {
            var wigetDetail = this.widgetList[j]
            await getCommonParamList({ componmentId: this.widgetId[i] }).then(response => {
              wigetDetail.wigetParamList = response
            })

            this.widgetDetailList.push(wigetDetail)
          }
        }
      }
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    insertEvent (row) {
      this.$refs.editable.insertAt({}, row).then(({ row }) => this.$refs.editable.setActiveCell(row))
    },
    getComponmentList () {
      getComponmentList().then(response => {
        this.widgetList = response.data
      })
    },
    removeWigetList (item) {
      var index = this.widgetDetailList.indexOf(item)
      if (index !== -1) {
        this.widgetDetailList.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>

</style>
