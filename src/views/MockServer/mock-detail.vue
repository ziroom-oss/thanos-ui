<template>
  <div class="app-container">
    <div style="height: 150px">
      <div class="search-wrap">
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">请求类型：</span>
              <el-select
                class="search-item"
                v-model="searchObj.requestType"
                placeholder="请选择请求类型"
                value
                @change="searchEv"
              >
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
                <el-option label="OPTION" value="OPTION"></el-option>
                <el-option label="HEAD" value="HEAD"></el-option>
                <el-option label="RPC" value="RPC"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">接口URI：</span>
              <el-input
                class="search-item"
                placeholder="请输入接口URI(支持模糊搜索)"
                v-model="searchObj.requestUri"
                clearable
                @keyup.enter.native="searchEv"
              ></el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">Mock状态：</span>
              <el-select
                class="search-item"
                v-model="searchObj.mockStatus"
                placeholder="请选择Mock启用状态"
                value
                @change="searchEv"
              >
                <el-option label="未激活" value="0"></el-option>
                <el-option label="已启用" value="1"></el-option>
                <el-option label="已禁用" value="2"></el-option>
                <el-option label="部分启用" value="3"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btn">
        <el-button type="primary" @click="searchEv">查询</el-button>
        <el-button class="bot-btn" @click="resetSearchEv">重置</el-button>
      </div>
    </div>

    <el-row style="margin-bottom: 20px">
      <el-button type="primary" size="small" @click="addNewInterface">新增接口</el-button>
      <el-button type="primary" size="small" @click="importInterface" hidden>批量导入</el-button>
    </el-row>

    <el-collapse accordion v-model="activeCollapse">
      <el-collapse-item name="1" :disabled="true">
        <template slot="title">
          <span style="font-size: 18px">{{mockInfo.appName}}</span>
          <el-divider direction="vertical"></el-divider>
          <span style="color: gray;font-size: 18px">{{mockInfo.appDesc}}</span>
        </template>
        <el-table
          :data="mockApiList"
          highlight-current-row
          row-key="id"
          :expand-row-keys="expandRowKeys"
          style="width: 100%;height:450px;overflow-y: scroll"
        >
          <el-table-column type="expand" width="50">
            <template slot-scope="scope">
              <el-table :data="scope.row.mockDataDetailEntityList" :show-header="false">
                <el-table-column align="center">
                  <template slot-scope="sub">
                    <el-link
                      type="primary"
                      :underline="false"
                      @click="mockInfoView(scope.row.reqUriMatcher, sub.row)"
                    >{{sub.row.detailName}}</el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="160">
                  <template slot-scope="sub">
                    <span v-if="sub.row.detailStatus === 0" style="color: #ff4949">未启用</span>
                    <span v-else style="color: #00bb00">已启用</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="200">
                  <template slot-scope="sub">
                    <el-popover placement="top-start" title width="300" trigger="hover">
                      <p>最后更新人：{{sub.row.userName}}</p>
                      <p>最后更新时间：{{sub.row.updateTime}}</p>
                      <el-button
                        slot="reference"
                        plain
                        round
                        size="mini"
                        type="warning"
                      >{{sub.row.userName}}</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="300">
                  <template slot-scope="sub">
                    <el-button
                      v-if="sub.row.detailStatus === 1"
                      type="info"
                      size="mini"
                      @click="changeMockRuleStatus(sub.row.id, false)"
                    >禁用</el-button>
                    <el-button
                      v-else
                      type="success"
                      size="mini"
                      @click="changeMockRuleStatus(sub.row.id, true)"
                    >启用</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-edit"
                      @click="mockInfoEdit(scope.row.reqUriMatcher, sub.row)"
                    >编辑</el-button>
                    <!-- <el-button type="primary" size="mini" icon="el-icon-document"
                                                   @click="mockInfoView(scope.row.reqUriMatcher, sub.row)">详情
                    </el-button>-->
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-document"
                      @click="mockInfoDelete(sub.row.id, scope.row.mockDataDetailEntityList.length)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
          <el-table-column label="请求类型" align="center" width="100">
            <template slot-scope="scope">{{scope.row.reqMethodMatcher}}</template>
          </el-table-column>
          <el-table-column label="请求URI" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.reqUriMatcher}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Mock状态" align="center" width="160">
            <template slot-scope="scope">
              <el-tag :type="scope.row.mockStatus | mockStatusFilter">
                {{scope.row.mockStatus |
                appStatusFilter}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="最后更新人" align="center" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="最后更新时间" align="center" width="160">
            <template slot-scope="scope">
              <span>{{scope.row.updateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.mockStatus === 1"
                type="info"
                size="mini"
                @click="changeMockStatus(scope.row.id, false)"
              >禁用</el-button>
              <el-button
                v-else
                type="success"
                size="mini"
                @click="changeMockStatus(scope.row.id, true)"
              >启用</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="addNewMockInfo(scope.row.id, scope.row.reqUriMatcher, scope.row.reqMethodMatcher)"
              >新增匹配</el-button>
              <el-button type="primary" size="mini" @click="deleteMockInfo(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="pageNum"
          :limit.sync="pageSize"
          @pagination="getMockApiList"
        ></pagination>
      </el-collapse-item>
    </el-collapse>

    <el-drawer
      :title="drawerTitle"
      size="50%"
      :visible.sync="drawerVisible"
      :before-close="handleClose"
    >
      <div style="height:90vh; overflow-y:auto">
        <div>
          <div style="margin: 0 30px" class="clearfix">
            <h4 style="font-size: 16px">
              接口Mock匹配信息
              <span style="color: orange;font-size: 14px">（请求URI：{{tempRequestUri}}）</span>
            </h4>
            <span style="float: left;width: 20%;margin-top: 25px">
              <i style="color: red">*</i>匹配描述
              <el-tooltip class="tooltip" effect="light" content="mock匹配名或者描述" placement="top">
                <i class="el-icon-question" style="color: darkgrey;"></i>
              </el-tooltip>
            </span>
            <el-input
              style="float: left;width: 80%;margin-top: 20px"
              v-model="form.detailName"
              :disabled="viewFlag"
            ></el-input>
          </div>
          <div style="margin: 45px 30px" class="clearfix">
            <h4 style="font-size: 16px">请求信息</h4>
            <div v-show="form.reqMethodMatcher !== 'RPC'" style="width: 48%;float: left">
              <div style="margin-bottom: 15px">
                请求头
                <el-tooltip class="tooltip" effect="light" placement="top">
                  <div slot="content">
                    请求信息header，格式如下，没有双引号：
                    <br />User-Agent:Apache-HttpClient*
                    <br />X-Forwarded-For:10.216.4.190
                    <br />X-Real-IP:10.216.4.190(新增时必填，进入应用IP)
                    <br />注意：头部有content-length最好删除
                  </div>
                  <i class="el-icon-question" style="color: darkgrey;"></i>
                </el-tooltip>
                <span style="color: gray;font-size: 13px">（支持正则表达式）</span>
              </div>
              <el-input
                type="textarea"
                :rows="8"
                v-model="form.reqHeaderMatcher"
                :disabled="viewFlag"
              ></el-input>
            </div>

            <div v-show="form.reqMethodMatcher !== 'RPC'" style="width: 48%;float: right ">
              <div style="margin-bottom: 15px">
                请求Cookie
                <el-tooltip
                  class="tooltip"
                  effect="light"
                  content="与头部格式，单独cookie在此处写，一般不填"
                  placement="top"
                >
                  <i class="el-icon-question" style="color: darkgrey;"></i>
                </el-tooltip>
                <span style="color: gray;font-size: 13px">（支持正则表达式）</span>
              </div>
              <el-input
                type="textarea"
                :rows="8"
                v-model="form.reqCookieMatcher"
                :disabled="viewFlag"
              ></el-input>
            </div>

            <div
              v-show="form.reqMethodMatcher !== 'RPC'"
              :class="classWidth"
              style="float: left;margin-top: 30px"
            >
              <div style="margin-bottom: 15px">
                请求参数
                <el-tooltip
                  class="tooltip"
                  effect="light"
                  content="url中查询参数，例如：id=1460&type=file&xxx=xx"
                  placement="top"
                >
                  <i class="el-icon-question" style="color: darkgrey;"></i>
                </el-tooltip>
                <span style="color: gray;font-size: 13px">（请求URL里面拼接的参数）</span>
              </div>
              <el-input
                type="textarea"
                :rows="8"
                v-model="form.reqQueryStrMatcher"
                :disabled="viewFlag"
              ></el-input>
            </div>

            <div
              v-show="form.reqMethodMatcher === 'POST' || form.reqMethodMatcher === 'RPC'"
              style="width: 48%;float: right;margin-top: 30px"
            >
              <div style="margin-bottom: 15px">
                请求体
                <el-tooltip class="tooltip" effect="light" placement="top">
                  <div slot="content">
                    请求信息匹配，post请求专用，可以为json格式，可以其他格式。
                    <br />全匹配：请求体重输入框内所有字符都必须匹配。
                    <br />包含：请求体重包含输入框内的内容。
                    <br />XPath: 使用Xpath来匹配请求体信息，一般请求体内容为html时使用
                  </div>
                  <br />JSONPath: json格式的请求体，使用jsonpath语法匹配。
                  <i
                    class="el-icon-question"
                    style="color: darkgrey;"
                  ></i>
                </el-tooltip>
                <span style="color: gray;font-size: 13px;float: right;margin-top: -12px">
                  <el-select
                    v-model="currentReqBodyMatcher.type"
                    placeholder="请选择请求体匹配类型"
                    value
                    :disabled="viewFlag"
                  >
                    <el-option label="匹配所有" value="2"></el-option>
                    <el-option label="全匹配" value="0"></el-option>
                    <el-option label="包含" value="1"></el-option>
                    <el-option label="Json匹配" value="5"></el-option>
                    <el-option label="XPath" value="4"></el-option>
                    <el-option label="JSONPath" value="3"></el-option>
                    <el-option label="正则" value="6"></el-option>
                  </el-select>
                </span>
              </div>
              <el-input
                type="textarea"
                :rows="8"
                v-model="currentReqBodyMatcher.body"
                placeholder="支持正则表达式、XPath、JSONPath等"
                :disabled="viewFlag"
              ></el-input>
            </div>
          </div>
          <div style="margin: 45px 30px" class="clearfix">
            <h4 style="font-size: 16px">响应信息</h4>
            <div v-show="form.reqMethodMatcher !== 'RPC'">
              <span style="float: left;width: 15%;margin-top: 5px">
                <i style="color: red">*</i>响应码
                <el-tooltip class="tooltip" effect="light" content="默认200，表示响应正常" placement="top">
                  <i class="el-icon-question" style="color: darkgrey;"></i>
                </el-tooltip>
              </span>

              <el-input
                style="float: left;width: 80%"
                v-model="form.respStatusCodeMock"
                :disabled="viewFlag"
              ></el-input>
            </div>
            <div
              v-show="form.reqMethodMatcher !== 'RPC'"
              style="width: 48%;float: left;margin-top: 20px"
            >
              <div style="margin-bottom: 15px">
                响应头
                <el-tooltip
                  class="tooltip"
                  effect="light"
                  content="与请求头格式一致，参上，注意：头部有content-length最好删除"
                  placement="top"
                >
                  <i class="el-icon-question" style="color: darkgrey;"></i>
                </el-tooltip>
              </div>

              <el-input
                type="textarea"
                :rows="8"
                v-model="form.respHeaderMock"
                :disabled="viewFlag"
              ></el-input>
            </div>

            <div style="width: 48%;float: right;margin-top: 20px">
              <div style="margin-bottom: 15px">
                <i style="color: red">*</i>响应体
                <el-tooltip class="tooltip" effect="light" content="任意字符串，输入预期响应内容" placement="top">
                  <i class="el-icon-question" style="color: darkgrey;"></i>
                </el-tooltip>
              </div>
              <el-input type="textarea" :rows="8" v-model="form.respBodyMock" :disabled="viewFlag"></el-input>
            </div>
          </div>
        </div>
        <div v-if="!viewFlag" style="text-align: center">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button v-if="submitFlag" type="primary" @click="saveNewMockDataInfo">确 定</el-button>
          <el-button v-else type="primary" @click="saveEditMockDataInfo(form.id)">确 定</el-button>
        </div>
      </div>
    </el-drawer>
    <newMockInterface
      ref="addRef"
      :dialog-visible-prop="dialogVisibleVal"
      :model-form-prop="modelFormVal"
      @saveInterfaceToRefreshEv="saveInterfaceToRefreshEv"
      @closeEv="closeEv"
    ></newMockInterface>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import newMockInterface from "./component/new-mock-interface";
import { getMockAppInfo } from "../../api/mockserver/moceApp";
import {
  addMockDataDetail,
  changeMockStatus,
  editMockDataDetail,
  getMockInterfaceByPage,
  deleteMockDataDetail,
  changeMockRuleStatus,
  deleteMockInfo
} from "../../api/mockserver/mock-data";

export default {
  name: "mock-detail",
  components: { newMockInterface, Pagination },
  filters: {
    mockStatusFilter(status) {
      const statusMap = {
        "0": "info",
        "1": "success",
        "2": "danger",
        "3": "warning"
      };
      return statusMap[status];
    },
    appStatusFilter(status) {
      const statusMap = {
        "0": "未激活",
        "1": "已启用",
        "2": "已禁用",
        "3": "部分启用"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      searchObj: {
        requestUri: "",
        requestType: "",
        mockStatus: ""
      },
      mockInfo: {
        appName: "",
        appDesc: ""
      },
      systemId: "",
      activeCollapse: "1",
      drawerTitle: "",
      total: 0,
      pageNum: 1,
      pageSize: 10,
      mockApiList: [],
      expandRowKeys: [],
      form: {
        respStatusCodeMock: "200"
      },
      drawerVisible: false,
      viewFlag: false,
      dialogVisibleVal: false,
      modelFormVal: {},
      tempDataId: "",
      tempRequestUri: "",
      submitFlag: true,
      classWidth: "",
      currentReqBodyMatcher: {
        type: "2",
        body: ""
      }
    };
  },
  created() {
    this.getRouterParam();
  },
  methods: {
    searchEv() {
      this.getMockApiList();
    },
    resetSearchEv() {
      this.searchObj = {
        requestUri: "",
        requestType: "",
        mockStatus: ""
      };
      this.getMockApiList();
    },
    handleClose(done) {
      if (!this.viewFlag) {
        this.$confirm("确认关闭操作？")
          .then(_ => {
            done();
          })
          .catch(_ => {});
      } else {
        done();
      }
    },
    getMockApiList() {
      let searchEntity = {
        appId: this.systemId,
        reqUriMatcher: this.searchObj.requestUri,
        reqMethodMatcher: this.searchObj.requestType,
        mockStatus: this.searchObj.mockStatus
      };
      getMockInterfaceByPage(
        {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        searchEntity
      ).then(response => {
        if (response.success) {
          this.mockApiList = response.data.records;

          this.total = response.data.total;
        }
      });
    },
    getRouterParam() {
      this.systemId = this.$route.query.id;
      this.getMockAppInfo(this.systemId);
      if (this.systemId !== "" && this.systemId !== undefined) {
        this.getMockApiList();
      }
    },
    getMockAppInfo(id) {
      getMockAppInfo({ id: id }).then(response => {
        if (response.success) {
          this.mockInfo.appName = response.data.appName;
          this.mockInfo.appDesc = response.data.appDesc;
          this.$refs["addRef"].appId = response.data.id;
        }
      });
    },
    addNewMockInfo(dataId, uri, reqMethodMatcher) {
      this.viewFlag = false;
      this.submitFlag = true;
      this.tempDataId = dataId;
      this.tempRequestUri = uri;
      this.drawerTitle = "接口Mock信息新增";
      this.form = {};
      this.form.reqMethodMatcher = reqMethodMatcher;
      this.classWidth = reqMethodMatcher === "POST" ? "width48" : "width100";
      this.drawerVisible = true;
      this.currentReqBodyMatcher = {
        type: "2",
        body: ""
      };
    },
    deleteMockInfo(id) {
      this.$confirm(
        "删除接口，接口下关联的规则也会全部删除，确认继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deleteMockInfo({ id: id }).then(response => {
            if (response.success) {
              this.$message({
                type: "success",
                message: response.data
              });
              this.getMockApiList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    saveNewMockDataInfo() {
      addMockDataDetail({
        dataId: this.tempDataId,
        reqUriMatcher: this.tempRequestUri,
        detailName: this.form.detailName,
        reqMethodMatcher: this.form.reqMethodMatcher,
        reqHeaderMatcher: this.form.reqHeaderMatcher,
        reqCookieMatcher: this.form.reqCookieMatcher,
        reqQueryStrMatcher: this.form.reqQueryStrMatcher,
        reqBodyMatcher: JSON.stringify(this.currentReqBodyMatcher),
        respStatusCodeMock: this.form.respStatusCodeMock,
        respBodyMock: this.form.respBodyMock,
        respHeaderMock: this.form.respHeaderMock
      }).then(response => {
        if (response.success) {
          this.drawerVisible = false;
          this.form = {};
          this.getMockApiList();
          this.expandRowKeys = [];
          this.expandRowKeys.push(this.tempDataId);
          this.$message({
            type: "success",
            message: "新增Mock信息操作成功"
          });
        }
      });
    },
    saveEditMockDataInfo(id) {
      editMockDataDetail({
        id: id,
        dataId: this.tempDataId,
        detailName: this.form.detailName,
        reqHeaderMatcher: this.form.reqHeaderMatcher,
        reqCookieMatcher: this.form.reqCookieMatcher,
        reqQueryStrMatcher: this.form.reqQueryStrMatcher,
        reqBodyMatcher: JSON.stringify(this.currentReqBodyMatcher),
        respStatusCodeMock: this.form.respStatusCodeMock,
        respBodyMock: this.form.respBodyMock,
        respHeaderMock: this.form.respHeaderMock,
        reqUriMatcher: this.form.reqUriMatcher
      }).then(response => {
        if (response.success) {
          this.drawerVisible = false;
          this.form = {};
          this.getMockApiList();
          this.expandRowKeys.push(this.tempDataId);
          this.$message({
            type: "success",
            message: "编辑Mock信息操作成功"
          });
        }
      });
    },
    mockInfoEdit(uri, row) {
      this.viewFlag = false;
      this.submitFlag = false;
      this.tempDataId = row.dataId;
      this.tempRequestUri = uri;
      this.drawerTitle = "接口Mock信息编辑";
      this.form = row;
      if (row.reqBodyMatcher != null) {
        this.currentReqBodyMatcher = JSON.parse(row.reqBodyMatcher);
      } else {
        this.currentReqBodyMatcher = {
          type: "2",
          body: ""
        };
      }
      this.classWidth =
        row.reqMethodMatcher === "POST" ? "width48" : "width100";
      this.drawerVisible = true;
    },
    changeMockRuleStatus(id, flag) {
      let postData = new URLSearchParams();
      postData.append("id", id);
      postData.append("flag", flag);
      changeMockRuleStatus(postData).then(response => {
        if (response.success) {
          this.$message({
            type: "success",
            message: flag ? "Mock 规则已启用" : "Mock 规则已禁用"
          });
        }
        this.getMockApiList();
      });
    },
    mockInfoView(uri, row) {
      this.viewFlag = true;
      this.tempRequestUri = uri;
      this.drawerTitle = "接口Mock信息查看";
      this.form = row;
      if (row.reqBodyMatcher != null) {
        this.currentReqBodyMatcher = JSON.parse(row.reqBodyMatcher);
      } else {
        this.currentReqBodyMatcher = {
          type: "2",
          body: ""
        };
      }
      this.classWidth =
        row.reqMethodMatcher === "POST" ? "width48" : "width100";
      this.drawerVisible = true;
    },
    addNewInterface() {
      this.dialogVisibleVal = true;
    },
    importInterface() {},
    saveInterfaceToRefreshEv() {
      this.getMockApiList();
    },
    closeEv() {
      this.dialogVisibleVal = false;
    },
    changeMockStatus(id, flag) {
      let postData = new URLSearchParams();
      postData.append("id", id);
      postData.append("flag", flag);
      changeMockStatus(postData).then(response => {
        if (response.success) {
          this.$message({
            type: "success",
            message: flag ? "应用服务器Mock已启用" : "应用服务器Mock已禁用"
          });
        }
        this.getMockApiList();
      });
    },
    mockInfoDelete(id, size) {
      if (size === 1) {
        this.$confirm("最后一条Mock规则，删除后接口也删除，确认继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteMockDataDetail({ id: id, isLast: true }).then(response => {
              if (response.success) {
                this.$message({
                  type: "success",
                  message: response.data
                });
                this.getMockApiList();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        deleteMockDataDetail({ id: id, isLast: false }).then(response => {
          if (response.success) {
            this.$message({
              type: "success",
              message: response.data
            });
            this.getMockApiList();
          }
        });
      }
    }
  },
  watch: {
    $route(to, from) {
      // 增加判断指定情况下刷新页面列表
      if (
        to.name === "mockDetail" &&
        from.name === "mockServerList" &&
        this.systemId !== this.$route.query.systemId
      ) {
        this.getRouterParam();
      }
    }
  }
};
</script>

<style scoped>
/* /deep/ .el-divider--vertical {
        margin: 15px;
        height: 1.5em;
    }

    /deep/ .el-collapse-item.is-disabled .el-collapse-item__header {
        margin: 15px 0;
        color: #303133;
        cursor: default;
    }

    /deep/ .el-collapse-item__arrow.is-active {
        color: white;
    } */

.width48 {
  width: 48%;
}

.width100 {
  width: 100%;
}
</style>