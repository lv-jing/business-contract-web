<template>
  <div>
    <div v-if="show" v-loading="loading" class="custom-class"
         :element-loading-text="content" style="height: 100vh;width: 100%;"></div>
    <div class="iwebOfficeVue" style="width: 100%;">
      <div style="height:10px;"></div>
      <div>
        <div id="office" style="float:left;"></div>
        <div style="float:right;width:23%">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-button
                class="buttonT"
                size="small"
                type="primary"
                :disabled="isSave"
                v-show="$route.query.isSave === 'true'"
                @click="uploadSerice(false)"
              >暂存
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                class="buttonT"
                size="small"
                type="primary"
                :disabled="isSave"
                v-show="$route.query.isSave === 'true'"
                @click="uploadSerice(true)"
              >完成编辑
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button class="buttonT" type="primary" @click="closeWindow('close')">关闭</el-button>
            </el-col>
            <el-col v-show="$route.query.batchFlag === '1' && isTemplateAdmin" :span="12">
              <el-button
                class="buttonT"
                type="primary"
                v-show="!$route.query.readType"
                @click="addLabel"
              >自定义书签
              </el-button>
            </el-col>
            <!-- <el-col :span="12">
              <div>
                <el-button
                  class="button"
                  type="primary"
                  v-show="!$route.query.readType"
                  @click="copyTemplate"
                >添加条款到范本</el-button>
              </div>
            </el-col>-->
            <el-col v-show="false" :span="12">
              <div>
                <el-button
                  class="buttonT"
                  type="primary"
                  v-show="!$route.query.readType"
                  @click="getLabel"
                >获取书签内容
                </el-button>
              </div>
            </el-col>
            <el-col v-show="$route.query.isShowAllBookMarks === 'true' || isTemplateAdmin" :span="12">
              <el-button
                class="buttonT"
                type="primary"
                v-show="!$route.query.readType"
                @click="alertAllBookMarks"
              >获取所有的书签名
              </el-button>
            </el-col>
            <!--只隐藏修订不隐藏批注-->
            <el-col v-show="false" :span="12">
              <el-button class="buttonT" type="primary" @click="ShowRevision(false)">隐藏痕迹</el-button>
            </el-col>
          </el-row>
          <common-title title="书签内容" v-if="bookMarks.length>0"/>
          <div class="bookmarksDiv" v-if="bookMarks.length>0" v-show="!$route.query.readType">
            <el-row :gutter="24">
              <el-col :span="12" v-for="(bookMark,index) in bookMarks" v-bind:key="index">
                <el-button class="button" @click="addLabel1(bookMark)">{{ bookMark.bookmarkName }}</el-button>
              </el-col>
            </el-row>
          </div>
          <common-title title="条款内容" v-if="termsData.length>0"/>
          <div class="bookmarksDiv" v-if="termsData.length>0" v-show="!$route.query.readType">
            <el-row :gutter="24">
              <el-col :span="24" v-for="(termsInfo,index) in termsData" v-bind:key="index">
                <el-button
                  class="termsButton"
                  @click="copyTemplate(termsInfo)"
                >{{ termsInfo.termsName }}
                </el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 合同审批的时候提示-->
          <div v-if="$route.query.txtShow==='true'" style="font-size: 12px;color: #00a2d4;margin-top: 15px;">如您对与审批页面左侧表单字段对应内容填写内容有异议，请退回发起人进行修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue/dist/vue.esm.js";
import webOfficeTpl from "../../assets/iweboffice/iWebOffice2015";
import WebOffice2015 from "../../assets/iweboffice/WebOffice";
import {
  getTermInfoFromIweboffice,
  saveTermInfo,
  getBookMark,
  getAllTerms,
  getBussAttamentId,
} from "@/service/terms/index";
import {
  getTemplateFromIweboffice,
  saveTemplateInfo,
  saveTemplateWithTerm,
} from "@/service/template/index";
import {userInfo} from "@/service/4A";
import {editFile, updateFile, addAttachment} from "@/service/approval";
import Cookies from "js-cookie";

const mSessionID = "8E0B3D768D2D0FC083A222446C439BE5";
const object = null;

export default {
  data() {
    return {
      content: '',
      loading: false,
      show: false,
      webOffice: null,
      webOfficeObj: null,
      token: "",
      fileId: "",
      termsInfo: null,
      bookMarks: [],
      contractData: [],
      termsData: [],
      templateContainTerm: [], // 范本中包含的条款
      isTemplateAdmin: false, // 是否为范本管理员
      isTermCreate: false, // 是否为条款的创建人
      isCloseWindow: false, // 如果暂存不关闭，点击【完成编辑要关闭】
      isSave: false,
      userInfo: {}
    };
  },
  created() {
    this.token = Cookies.get('token');
    this.fileId = this.$route.query.fileId;
    document
      .querySelector("body")
      .setAttribute(
        "KGBrowser",
        "内蒙古伊利实业集团股份有限公司[专用];V5.0S0xGAAEAAAAAAAAAEAAAANMBAADgAQAALAAAANqJYLQGzakRKxirwiYqZlY5aj9nZXMzyUeJxp4TcvNL467JPfSh+TCuS30l9RGcG81HeielSUPTLgxOM+CjYz+yfhAjh6p2iPsBXXIxziB9rMoEVm9fk1W0Gq5pC3p0pc7EX2USyBTIXYdLKQqoXa7unSqz2+1i7sZG//ZigWcDC+Xs6x7BW8Sn7Yu6i6KF8A5f8LbfXnSK1h1dTNOR++MIpoYJ1jU8Oe5RqcY2Ah6lV8C4DGgbgDogAlBw+EABetgXLfHs7EmLCH4Kd+T04YkjVzLWuuYDTOBaWKpJzwywx9JKMoYG84weg66Mcec6jd+eYD+MXRw+ZFECYRgXshprZbmJ7qyecG9yAqXDnzZJOyHFCmrG2sMv4w814SLzk6sRcBbj3IbL4okdIlKkyNdrtf6WF4Sz09aGo3VfBkkI/q10CMpIl8ECpPB1CB7mD+p0eZDDzOdFDLwMDYZIaG/+GW9MZOHMye0ucv4924ZMg1JCKB3OVCnrYpLZqs9YLlAAqotNjPAh1FQYBLGh+uO81SFzFP0KHlkjHSMVpwBYvic7ASCOvOwHJmIzdgpNhHJ3Rckrf3yJZ6TD2mAi4SO3P9lhrMgRkA7hz/Wcg8BkQZ2Axi6DlVoQeM1GXHB+7VH2M/K5gqPi3EuXLg/aAGc="
      );

    // window.OnCommand = (ID, Caption, bCancel)=> this.OnCommand(ID, Caption, bCancel);
    // this.initIE();
  },
  methods: {
    // 挂载到id为office的div下面
    renderWebOfficePage() {
      this.webOffice = new Vue({
        template: webOfficeTpl,
      }).$mount("#office");
    },
    async getUserInfo() {
      const {code, data} = await userInfo(err => {
        this.$router.push({path: 'error'})
      });
      if (code === '000000') {
        this.userInfo = data
        this.initWebOfficeObject(); //设置延时调用，以免出现控件还没初始化完就开始调用。
        this.adjustBookMarks(); //重新调整下书签
      } else {
        this.$router.push({path: 'error'})
      }
    },
    initWebOfficeObject() {
      this.webOfficeObj = new WebOffice2015();
      this.webOfficeObj.setObj(document.getElementById("WebOffice"));
      try {
        if (this.$route.query.readType != "readyOnly") {
          this.webOfficeObj.ShowWindow = false; //显示/隐藏进度条
          this.webOfficeObj.ShowMenu = 0;
          this.webOfficeObj.ShowToolBar = true;
        }
        // this.webOfficeObj.UserName = "静静";
        this.webOfficeObj.FileName = "sample.doc";
        this.webOfficeObj.FileType = ".doc";

        if (this.$route.query.openType === "open") {
          if (!this.fileId) {
            this.$notify({
              title: "提示",
              message: "暂未获取到文本！",
            });
            return;
          }
          let downloadUrl =
            process.env.VUE_APP_FILE_URL +
            "/fileOperator/downloadFile/" +
            this.fileId +
            "?token=" +
            this.token;
          this.webOfficeObj.WebOpen3(downloadUrl);
          if (this.$route.query.readType === "readyOnly") {
            this.webOfficeObj.setEditType("0"); // 只读模式下，不能修改任何内容，或者获取书签等
          }
          // 默认显示痕迹
          this.webOfficeObj.WebShow(true);
          let type = this.$route.query.operateType; // 从上一个页面传过来的操作类型
          let {atrr, isUser} = this.$route.query;
          if (type === "contract") {
            this.show = false;
            this.loading = false;
            if (isUser === "one" && atrr === "CTA003") {
              // 合同发起非标准的时候不显示痕迹
              this.webOfficeObj.WebShow(false);
              this.webOfficeObj.ClearRevisions();
            }
          }
        } else if (this.$route.query.openType === "add") {
          this.webOfficeObj.CreateFile();
          this.webOfficeObj.ShowToolBars(true);
          this.webOfficeObj.UserName = "";
          this.webOfficeObj.FileName = "sample.doc";
          this.webOfficeObj.FileType = ".doc";
        }
        this.webOfficeObj.VBASetUserName(this.userInfo.userName)
      } catch (e) {
        this.show = false;
        this.loading = false;
      }
    },
    // 添加标签
    addLabel() {
      this.$prompt("请输入书签名称，例如：book1", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({value}) => {
        let boo = this.webOfficeObj.WebAddBookMarks_1(value);
        if (boo) {
          this.$notify({
            title: "提示",
            message: "添加书签成功！",
          });
        } else {
          this.$notify({
            title: "提示",
            message: "添加书签失败！",
          });
        }
      })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 给客户看的弹出来的所有的书签名
    alertAllBookMarks() {
      let allBooksName = this.webOfficeObj.WebGetAllBookMarks();
      this.$notify({
        title: "提示",
        message: "" + allBooksName,
      });
    },
    //从文档上读取所有的书签名
    getAllBookMarks() {
      let allBooksName = this.webOfficeObj.WebGetAllBookMarks();
      // alert(allBooksName)
      return allBooksName;
    },
    // 从数据库读取当前条款的书签名
    async getBookMarks() {
      let objectId = this.$route.query.ObjectId; // 从上一个页面传送过来的
      let params = {
        pageSize: 10000,
      };
      const {code, data} = await getBookMark(params);
      if (code === "000000") {
        this.bookMarks = data.records;
      }
    },
    // 调整书签，只涉及到通用书签
    adjustBookMarks() {
      if (this.$route.query.batchFlag === "1") {
        //批量范本，需要去掉通用标签
        if (this.bookMarks.length > 0) {
          this.bookMarks.splice(
            this.bookMarks.findIndex(
              (item) => item.bookmarkName.indexOf("通用") >= 0
            ),
            1
          );
        }
      }
      // 首先读取所有的书签
      // 然后去取出通用书签
      let allBooksName = this.webOfficeObj.WebGetAllBookMarks();
      let tongyongArr = [];
      let re1 = /(\d{1,3})+(?:\.\d+)?/g; // 数字
      let re2 = /[\u4e00-\u9fa5]{2,}/g; // 汉字
      // 如果有通用书签就找出最大的那个
      if (this.bookMarks.length > 0) {
        this.bookMarks.forEach((ele) => {
          for (let i = 0; i < allBooksName.length; i++) {
            if (ele.bookmarkType === "1") {
              if (ele.bookmarkName.split("_")[0] === allBooksName[i].split("_")[0]) {
                let arr1 = ele.bookmarkName.match(re1);
                let arr2 = ele.bookmarkName.match(re2);
                let bookMarksNum = parseInt(ele.bookmarkName.split("_")[1]) || 0//当前书签中的数字
                let docNum = parseInt(allBooksName[i].split("_")[1]) //当前文档中的数字
                if (docNum) {
                  if (docNum >= bookMarksNum) {
                    ele.bookmarkName =
                      ele.bookmarkName.split("_")[0] +
                      "_" +
                      (docNum + 1);
                  }
                } else {
                  ele.bookmarkName = ele.bookmarkName + "_" + 1;
                }
              }
            } else {
              let arr1 = ele.bookmarkName.match(re1);
              let arr2 = ele.bookmarkName.match(re2);
              if (!allBooksName[i].match(re2)) {
                return
              }
              if (ele.bookmarkName.match(re2)[0] === allBooksName[i].match(re2)[0]) {
                let tongyongNum = parseInt(ele.bookmarkName.match(re1)[0]) // 如果已经赋值到后端接口返回的通用
                let maxNum = parseInt(allBooksName[i].match(re1)[0]) // 当前文档中通用书签的数字
                // console.log(maxNum+'---'+tongyongNum)
                if (maxNum >= tongyongNum) {
                  ele.bookmarkName = arr2[0] + (maxNum + 1);
                }
              }
            }
          }
        });
      }
    },
    // 选中的内容添加标签
    addLabel1(bookMark) {
      let boo = this.webOfficeObj.WebAddBookMarks_1(bookMark.bookmarkName);
      if (boo) {
        this.$notify({
          title: "提示",
          message: "添加书签成功",
        });
      } else {
        this.$notify({
          title: "提示",
          message: "添加书签失败",
        });
      }
      // if (bookMark.bookmarkType === "0") {
      let re1 = /(\d{1,3})+(?:\.\d+)?/g; // 数字
      let re2 = /[\u4e00-\u9fa5]{2,}/g; // 汉字
      let arr1 = bookMark.bookmarkName.match(re1);
      let arr2 = bookMark.bookmarkName.match(re2);
      if (bookMark.bookmarkType === "1") {
        if (bookMark.bookmarkName.split("_")[1]) {
          bookMark.bookmarkName =
            bookMark.bookmarkName.split("_")[0] +
            "_" +
            (parseInt(bookMark.bookmarkName.split("_")[1]) + 1);
        } else {
          bookMark.bookmarkName = bookMark.bookmarkName + "_" + 1;
        }
      } else {
        bookMark.bookmarkName = arr2[0] + (parseInt(arr1[0]) + 1);
      }
      // }
    },
    // 查询标签
    queryLabel() {
      this.webOfficeObj.WebOpenBookMarks();
    },
    // arr 传人书签名 装书签内容
    getLabel(arr) {
      let bookArr = [];
      if (arr.length > 0) {
        arr.forEach((item) => {
          bookArr.push({
            bookmark: item,
            fieldValue: this.webOfficeObj.WebGetBookMarks(item),
          });
        });
      }
      return bookArr;
    },
    // 文档防护
    docProtect() {
      let mText = window.prompt(
        "文档里需要先设置保护的书签，示例文档默认添加了KingGrid的书签，请输入书签名称",
        "KingGrid",
        ""
      );
      if (mText != null) {
        this.webOfficeObj.WebAreaProtect("year");
        this.webOfficeObj.WebAreaProtect("month");
      }
    },
    // 模板套红
    async copyTemplate(termsInfo) {
      // 现在范本套红前后加上书签

      let bookNames = "FTK" + termsInfo.termsId;
      this.webOfficeObj.WebAddBookMarks_1(bookNames);

      this.AddBookMark("条款前", "条款后", bookNames);
      // return
      // 先通过条款ID去拿到条款的文档ID
      let params = {
        businessType: "term",
        businessId: termsInfo.termsId,
      };
      //将数据存到templateContainTerm中
      let templateTermsForm = {
        termsId: termsInfo.termsId,
      };
      this.templateContainTerm.push(templateTermsForm);
      const {code, data} = await getBussAttamentId(params);
      if (code === "000000") {
        this.copyTermsToTemplate(data[0].fileId, bookNames, termsInfo);
      }
      // this.uploadSerice()
      // this.webOfficeObj.WebClose()%appdata%/WebOffice/DOWN
    },
    // 拷贝条款到范本
    copyTermsToTemplate(fileId, bookMarkName, termsInfo) {
      let savePath = this.webOfficeObj.DownFilePath();
      let currentTime = new Date().getTime();
      let realPath = "" + savePath + "\\" + currentTime + ".doc";
      this.webOfficeObj.WebSaveLocalFile(realPath);

      let downloadUrl =
        process.env.VUE_APP_FILE_URL +
        "/fileOperator/downloadFile/" +
        fileId +
        "?token=" +
        this.token;
      this.webOfficeObj.WebOpen3(downloadUrl);
      setTimeout(() => {
        this.webOfficeObj.FileType = ".doc";
        this.webOfficeObj.WebUrl = realPath;
        this.webOfficeObj.WebUseTemplate(bookMarkName);
        this.OnlyContent("条款前", "条款后");
        this.webOfficeObj.WebAddBookMarks_1("TK" + termsInfo.termsId);
        this.webOfficeObj.WebDelBookMarks("条款前");
        this.webOfficeObj.WebDelBookMarks("条款后");
        this.webOfficeObj.WebDelBookMarks("FTK" + termsInfo.termsId);
      }, 1000);
    },
    // 上传文档至服务器 boo false 暂存
    uploadSerice(boo) {
      let {atrr, operateType} = this.$route.query;
      if (operateType === "contract") {
        if (atrr === "CTA001") {
          this.show = true;
          this.loading = true;
          this.content = JSON.parse(JSON.stringify('数据保存中，请稍等....'))
        }
      }
      setTimeout(() => {
        this.isSave = true
        let {isUser, attr} = this.$route.query;
        this.isCloseWindow = boo;
        if (this.isTemplateAdmin || (isUser === "one" && attr === "CTA003")) {
          //  当为范本管理员时，才会出现条款选择
          this.webOfficeObj.WebShow(false);
          this.webOfficeObj.ClearRevisions();
        } else {
          this.webOfficeObj.WebShow(true);
        }
        let docFileName = this.$route.query.docFileName;
        if (!docFileName) {
          docFileName = "标准文档.doc";
          docFileName = encodeURIComponent(docFileName);
        } else {
          try {
            docFileName = decodeURIComponent(docFileName);
          } catch (error) {
            this.$notify({
              title: "提示",
              message: "请注意文件名含有特殊字符",
            });
          }
          docFileName = escape(encodeURIComponent(docFileName + ".doc"));
        }
        this.webOfficeObj.WebUrl =
          process.env.VUE_APP_FILE_URL +
          "/fileOperator/uploadGoldgridFile?&docFileName=" +
          docFileName +
          "&token=" +
          this.token;
        this.webOfficeObj.FileName = new Date().getTime() + ".doc";
        this.webOfficeObj.FileType = ".doc";
        let res = this.webOfficeObj.WebSave();
        if (res.code === "000000") {
          let type = this.$route.query.operateType;
          if (type === "term") {
            this.addTermWithFile(res.data);
          } else if (type === "template") {
            this.addTemplateFile(res.data);
          } else if (type === "contract") {
            const { atrr,txtShow } = this.$route.query;
            // 审批的是审批人的时候直接保存
            if(txtShow&&txtShow==='true'){
              this.editContract(res.data);
            }else if (atrr === "CTA001") { // 发起和退回到经办人的时候 同步标准书签
              this.updateFile(res.data);
            } else { // 除标准书签以外的直接保存 不同步标准书签
              this.editContract(res.data);
            }
          }
        } else {
          this.$message({type: "error", message: res.mesg});
        }
      }, 100)

    },
    // 修改单个合同发起 保存附件
    async editContract(fileData) {
      const {contractId, businessAttamentId, fileName} = this.$route.query;
      const {code, mesg} = await addAttachment({
        ...fileData,
        fileId: fileData.id,
        contractId,
        businessAttamentId,
        fileName,
      });
      if (code === "000000") {
        this.loading = false;
        this.show = false
        this.closeWindow();
      } else {
        this.$notify({
          title: "提示",
          message: mesg,
        });
        this.loading = false;
        this.show = false;
        this.isSave = false;
      }
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },
    // 修改条款并且将文档关联的方法
    addTermWithFile(fileData) {
      let ObjectId = this.$route.query.ObjectId;
      this.getTermInfo(ObjectId, fileData);
    },
    // 条款的获取方法
    async getTermInfo(id, fileData) {
      const {code, data} = await getTermInfoFromIweboffice(id);
      if (code === "000000") {
        this.termsInfo = data;
        this.termsInfo.fileInfoVo = fileData;
        this.addToTerm(this.termsInfo);
      } else {
        this.$message({type: "error", message: "获取用户信息失败，无法保存"});
      }
    },
    // 条款和文档关联的方法
    async addToTerm(params) {
      // 首先读取所有的书签名，跟条款关联的书签
      let allBooksName = this.getAllBookMarks();
      let businessParameterFormList = [];
      if (this.bookMarks.length > 0) {
        if (allBooksName.length > 0) {
          for (let i = 0; i < allBooksName.length; i++) {
            let obj = this.bookMarks.find(
              (item) =>
                item.bookmarkName.split("_")[0] ===
                allBooksName[i].split("_")[0]
            );
            let xx = {};
            if (obj) {
              xx = {
                businessId: params.termsId,
                bookmark: allBooksName[i],
                fieldName: obj.bookmarkFieldname,
                businessType: "term",
                attribute1: obj.bookmarkType,
              };
            } else {
              xx = {
                businessId: params.termsId,
                bookmark: allBooksName[i],
                businessType: "term",
                attribute1: "3",
              };
            }
            businessParameterFormList.push(xx);
          }
        }
      }
      params.businessParameterFormList = businessParameterFormList;
      const {code, data} = await saveTermInfo(params);
      if (code && code == "000000") {
        //此处表示提交成功
        this.$notify({
          title: "提示",
          message: "上传成功",
        });
        // this.$message({ type: "success", message: "上传成功" });
        setTimeout(() => {
          this.closeWindow();
        }, 1000);
      } else {
        this.$message("新增条款失败");
      }
    },

    // 修改范本并且将范本与文档关联的方法
    addTemplateFile(fileData) {
      let ObjectId = this.$route.query.ObjectId;
      // 根据Id获取范本的内容
      this.getTemplateInfo(ObjectId, fileData);
    },
    // 获取单个范本
    async getTemplateInfo(id, fileData) {
      const {code, data} = await getTemplateFromIweboffice(id);
      if (code === "000000") {
        let templateInfo = data;
        templateInfo.fileInfoVo = fileData;
        this.addToTemolate(templateInfo);
      }
    },
    // 范本与文档关联
    async addToTemolate(params) {
      // 首先将范本中所有的条款都与范本关联上
      if (this.templateContainTerm.length > 0) {
        this.templateContainTerm.forEach((ele) => {
          ele.templateId = params.templateId;
        });
      }
      let params1 = {};
      params1.templateTermsFormList = this.templateContainTerm;
      params1.statue = params.statue;
      const {code, data} = await saveTemplateWithTerm(params1);
      if (code === "000000") {
        this.saveTemplateInfoEnd(params);
      }
    },
    async saveTemplateInfoEnd(params) {
      // 首先读取所有的书签名，跟范本关联的书签
      let allBooksName = this.getAllBookMarks();
      let businessParameterFormList = [];
      if (this.bookMarks.length > 0) {
        if (allBooksName.length > 0) {
          for (let i = 0; i < allBooksName.length; i++) {
            let obj = this.bookMarks.find(
              (item) =>
                item.bookmarkName.split("_")[0] ===
                allBooksName[i].split("_")[0]
            );
            let xx = {};
            if (obj) {
              xx = {
                businessId: params.templateId,
                bookmark: allBooksName[i],
                fieldName: obj.bookmarkFieldname,
                businessType: "template",
                attribute1: obj.bookmarkType,
              };
            } else {
              if (allBooksName[i].substring(0, 2) === "TK") {
                xx = {
                  businessId: params.templateId,
                  bookmark: allBooksName[i],
                  businessType: "template",
                  attribute1: "2",
                };
              } else {
                xx = {
                  businessId: params.templateId,
                  bookmark: allBooksName[i],
                  businessType: "template",
                  attribute1: "3",
                };
              }
            }
            businessParameterFormList.push(xx);
          }
        }
      }
      params.businessParameterFormList = businessParameterFormList;
      const {code, data} = await saveTemplateInfo(params);
      if (code && code === "000000") {
        //此处表示提交成功
        this.$message({type: "success", message: "上传成功"});
        this.closeWindow();
      } else {
        this.$message({type: "error", message: "新增范本失败"});
      }
    },
    // 获取所有的条款
    async getAllTerms() {
      let params = {};
      const {code, data} = await getAllTerms(params);
      if (code === "000000") {
        this.termsData = data;
      }
    },
    // 关闭金格插件
    closeWindow(text) {
      this.isSave = false
      if (text === "close" || this.isCloseWindow) {
        this.webOfficeObj.WebClose();
          window.close();
      } else {
        // 合同类型type atrr 合同属性  isUser 是否是经办人
        const {operateType,atrr,isUser} = this.$route.query;
        if (operateType === "contract") {
          if(isUser === "one" && atrr === "CTA003"){
            this.webOfficeObj.WebShow(false);
          }
        }
        //为true,要关闭
        this.$notify({
          title: "提示",
          message: "暂存成功",
          offset: 100,
        });
      }
    },
    //只隐藏修订，不隐藏批注
    ShowRevision() {
      this.webOfficeObj.ClearRevisions();
    },
    // 保存到本地
    WebSaveLocal() {
      this.webOfficeObj.WebSaveLocal();
    },
    /**
     * 单个合同保存书签
     * @returns {Promise<void>}
     */
    async updateFile(data) {
      const {contractId} = this.$route.query;
      let bookArr = this.getLabel(this.getAllBookMarks());
      bookArr[0].contractId = contractId
      const {code, mesg} = await updateFile(JSON.stringify(bookArr));
      if (code === "000000") {
        this.editContract(data);
      } else {
        this.$notify({
          title: "提示",
          message: mesg,
          offset: 100,
        });
        this.isSave = false;
        this.show = false;
        this.loading = false;
      }
    },
    /*
     * // 在某一个bookName书签前加上两个书签
     **/
    AddBookMark(StartBookMarkName, EndBookMarkName, bookName) {
      var Selection = this.webOfficeObj.WebObject.Application.Selection;
      Selection.GoTo(-1, 0, 0, bookName); //跳转到标签

      Selection.HomeKey(5); //移动到行头

      Selection.MoveUp(5, 1); //向上移动一行

      Selection.TypeParagraph(); //回车换行

      this.webOfficeObj.WebObject.ActiveDocument.Bookmarks.Add(
        StartBookMarkName
      ); //增加一个名称为"Start"的书签

      Selection.GoTo(-1, 0, 0, bookName); //跳转到"Content"标签

      Selection.EndOf(5); //移动到行尾

      Selection.TypeParagraph(); //回车换行

      this.webOfficeObj.WebObject.ActiveDocument.Bookmarks.Add(EndBookMarkName); //增加一个名称为"End"的书签
    },

    // 选中某两个书签之间的内容，便于后面添加书签
    OnlyContent(StartBookMarkName, EndBookMarkName) {
      var BookmarkStart = this.webOfficeObj.WebObject.ActiveDocument.Bookmarks.Item(
        StartBookMarkName
      ).Start;
      var BookmarkEnd = this.webOfficeObj.WebObject.ActiveDocument.Bookmarks.Item(
        EndBookMarkName
      ).End;
      var Selection = this.webOfficeObj.WebObject.Application.Selection;

      Selection.SetRange(BookmarkStart, BookmarkEnd); //选择正文信息
    },
  },
  mounted() {
    // let {atrr, operateType} = this.$route.query;
    // if (operateType === "contract") {
    //   if (atrr === "CTA001") {
    //     this.show = true;
    //     this.loading = true;
    //     this.content = '正在打开文档,请稍等...'
    //   }
    // }
    if (this.$route.query.templateAdmin === "true") {
      // 是否为范本管理员
      this.isTemplateAdmin = true;
    }
    if (this.$route.query.isTermCreate === "true") {
      this.isTermCreate = true;
    }
    if (this.isTemplateAdmin) {
      //  当为范本管理员时，才会出现条款选择
      this.getAllTerms();
    }

    if (this.isTemplateAdmin || this.isTermCreate) {
      //为范本管理员和条款第一个创建人的时候才需要展示书签
      this.getBookMarks();
    }

    this.$nextTick(() => {
      // 挂载插件
      this.renderWebOfficePage();
      setTimeout(() => {
        this.getUserInfo()
      }, 800);
    });
  },
  beforeDestroy() {
    this.webOfficeObj.WebClose();
  },
};
</script>
<style lang="less">
.custom-class {
  .el-loading-spinner .el-loading-text {
    font-size: 18px !important;
  }
}

.iwebOfficeVue {
  .buttonT {
    width: 9vw;
    font-size: 0.8vw;
    text-align: center;
    word-wrap: break-word;
    margin-top: 10px;
  }

  .button {
    width: 9.8vw;
    font-size: 0.8vw;
    word-wrap: break-word;
    margin-top: 10px;
  }

  .bookmarksDiv {
    margin-top: 10px;
    max-height: 300px;
    overflow-y: auto;
  }

  .termsButton {
    width: 100%;
    font-size: 14px;
    margin-top: 10px;
  }
}

.el-message-box {
  position: fixed;
  right: 0px;
  top: 10px;
  width: 20vw;
}
</style>





