<template>
  <div>
    <div style="float: left;padding:0 14px;">
      <span style="color: #FF5252;padding:0 5px;" v-show="disable">*</span>
      <span>{{ title }}</span>
      <span style="color: #999999;">{{ titleTwo }}</span>
    </div>
    <el-upload
      :disabled="isDel||['detail','view','adds'].includes($route.query.type)||$route.query.taskStauts==='SUSPEND'"
      v-if="uploadShow"
      action="uploadUrl"
      name="file"
      :show-file-list="false"
      :http-request="uploadSectionFile"
      :file-list="fileList"
      multiple
      :data="uploadParams"
      :headers="headers"
    >
      <div class="tl">
        <el-popover
          :disabled="!content"
          placement="right"
          width="250"
          trigger="hover"
          :content="content">
        <el-button
          slot="reference"
          :disabled="isDel||['detail','view','adds'].includes($route.query.type)||$route.query.taskStauts==='SUSPEND'"
          size="mini" icon="el-icon-upload">
          点击上传
        </el-button>
        </el-popover>
        <span slot="tip" class="el-upload__tip ml10">{{ isRegShow ? '支持扩展名：.pdf .jpg .png 大小不超过50M' : '' }}</span>
        <span slot="tip"
              class="el-upload__tip ml10">{{ isPdfShow ? '支持扩展名：仅支持上传pdf文件或 .jpg .png，请确保扫描件清晰、顺序正确无缺页 大小不超过50M' : '' }}</span>
      </div>
    </el-upload>
    <div class="tl" style="padding-left: 14px;">
      <ul>
        <template v-for="(file,index) of fileList">
        <el-row :gutter="24" type="flex" style="align-items: center;margin-top: 5px;">
            <el-col :span="isApproval?16:8">
              <li class="flex upload-hover" :key="index" style="overflow: hidden">
                  <span class="el-icon-tickets"></span>
                  <span class="ml10 title-more" v-text="file.name" :title="file.name"></span>
              </li>
            </el-col>
            <el-col :span="isApproval?8:12">
              <div class="but-cont-style">
                <a
                  v-if="openShow"
                  href="javascript:;"
                  @click="handleOpen(file)"
                >
                  预览
                </a>
                <a
                  v-if="!isApproval"
                  href="javascript:;"
                  @click="downloadFile(file)"
                >
                  下载
                </a>
                <a
                  v-if="!isDel && !['view','detail'].includes($route.query.type)"
                  href="javascript:;"
                  @click="handleRemove(index)"
                >
                  删除
                </a>
              </div>
            </el-col>
        </el-row>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Cookies from "js-cookie";
import store from "@/store"
import {OpenKgWindow, rand} from "@/utils/tools"
import md5 from "js-md5"
import {uploadUrl, downloadUrl, previewUrl} from '@/service/file'
import axios from 'axios'

export default {
  props: {
    content:String,
    span: {
      type: Number,
      default: () => 24
    },
    // 上传参数
    uploadParams: {
      type: Object,
      default: () => {
      }
    },
    // 回填数据
    showAttachedList: {
      type: Array,
      default: () => []
    },
    // 标题
    title: {
      type: String,
      default: () => "合同"
    },
    // 副标题
    titleTwo: {
      type: String,
      default: () => ''
    },
    /**
     * 显示按钮
     */
    uploadShow: {
      type: Boolean,
      default: () => true
    },
    /**
     * 显示提示 支持文件格式
     */
    isRegShow: {
      type: Boolean,
      default: () => false
    },
    /**
     * 显示提示 支持文件格式
     */
    isPdfShow: {
      type: Boolean,
      default: () => false
    },
    /**
     * 显示按钮
     */
    disable: {
      type: Boolean,
      default: () => false
    },
    // 是否显示删除
    isDel: {
      type: Boolean,
      default: () => false
    },
    // 是否显示预览
    openShow: {
      type: Boolean,
      default: () => true
    },
    // 是否审批
    isApproval: {
      type: Boolean,
      default: () => false
    },
  },

  watch: {
    showAttachedList(lists) {
      this.fileList = []
      // 用于重置上传列表
      if (lists && lists.length > 0) {
        lists.map(item => {
          const list = {
            name: item.fileName,
            status: "success",
            percentage: 100,
            size: item.fileSize,
            response: {
              data: item
            }
          };
          this.fileList.push(list);
        });
        this.list = lists;
      } else {
        this.fileList = [];
      }
    }
  },
  computed: {
    statusFormat() {
      return (val) => {
        let p = parseInt((val + "").split(".")[0]);
        return p === 100 ? '#6f7ad3' : '#0070C1'
      }
    }
  },
  data() {
    return {
      uploadUrl: uploadUrl,
      downloadUrl: downloadUrl,
      target: '',
      fileList: [],
      list: [],
      headers: {},
      status: ''
    };
  },
  mounted() {

  },
  methods: {
    format(percentage) {
      let p = parseInt((percentage + "").split(".")[0]);
      return percentage === 100 ? "完成" : `${p}%`;
    },
    async uploadSectionFile(params) {
      const {type, id} = this.$route.query
      if (this.isRegShow) {
        let reg = /^.*(\.jpg|\.jpeg|\.png|\.pdf)$/;
        const isJPG = reg.test(params.file.name.toLowerCase());
        const isLt50M = params.file.size / 1024 / 1024 < 50;
        if (!isJPG) {
          this.$message.error("上传文件格式只能是 .pdf .jpg .png");
          return false;
        }
        if (!isLt50M) {
          this.$message.error("上传文件大小不能超过 50MB!");
          return false;
        }
      }
      if (this.isPdfShow) {
        let reg = /^.*(\.pdf|\.PDF|\.jpg|\.jpeg|\.png)$/;
        const isJPG = reg.test(params.file.name.toLowerCase());
        const isLt50M = params.file.size / 1024 / 1024 < 50;
        if (!isJPG) {
          this.$message.error("上传文件格式只能是 .pdf .jpg .png格式");
          return false;
        }
        if (!isLt50M) {
          this.$message.error("上传文件大小不能超过 50MB!");
          return false;
        }
      }
      const token = Cookies.get('token');
      const userId = store.state.common.userInfo && store.state.common.userInfo.userId;
      const timestamp = new Date().getTime();
      const nonce = rand(1000, 9999);
      const file = params.file;
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      let url = process.env.VUE_APP_FILE_URL + '/fileOperator/uploadFile'
      const {data} = await axios.post(url, form, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: Cookies.get('Authorization'),
          token: Cookies.get('token'),
          signature: md5(userId + token + nonce + timestamp + ''),
          nonce: nonce,
          timestamp: timestamp
        }
      })
      if (data.code === '000000') {
        this.fileList.push({
          name: data.data.fileName,
          status: "success",
          percentage: 100,
          size: data.data.fileSize,
          response: {
            data: {
              ...(data.data),
              fileId: data.data.id,
            }
          }
        })
        this.list.push({
          ...data.data,
          fileId: data.data.id,
          fileType: data.data.fileType,
          contractId: (type === 'edit' && id) ? id : '',
          businessId: (type === 'edit' && id) ? id : '',
        })
        this.$emit("get-file-list", this.list);
      }
    },
    //预览
    handleOpen(file) {
      const token = Cookies.get('token')
      if (['doc', 'docx'].includes(file.response.data.fileType)) {
        OpenKgWindow('?openType=open&readType=readyOnly&fileId=' + file.response.data.fileId + '&token=' + token)
      } else {
        if (['pdf', 'jpg', 'png'].includes(file.response.data.fileType)) {
          window.open(previewUrl + `/${file.response.data.fileId}/preview?token=${token}`)
        } else {
          window.open(downloadUrl + `/${file.response.data.fileId}?token=${token}`)
        }
      }
    },
    //下载附件
    downloadFile(item) {
      const token = Cookies.get('token')
      const {response} = item;
      const {data} = response || {};
      window.open(downloadUrl + `/${data.fileId}?token=${token}`)
    },
    /**
     * 文件列表移除文件时的钩子
     * @param file
     */
    handleRemove(index) {
      this.fileList.splice(index, 1);
      let uploadList = this.fileList.map(item => {
        if (item.response) {
          return item.response.data;
        }
      });
      this.list = uploadList;
      this.$emit("get-file-list", uploadList);
    },
  }
};
</script>

<style lang="less">
.title-more{

}
.upload-content {
  margin-top: 20px;
}

.upload-hover {
  align-items: center;
  .show-hidden {
    cursor: pointer;
  }

  a {
    color: #2393F7;
  }
  .custom-progress {
    position: absolute;
    bottom: -10px;
    width: 49%;
    height: 25px;
  }

  &:hover {
    .show-hidden {
      color: #2393F7;
    }
  }
}

.but-cont-style {
  display: flex;
  a {
    font-size: 12px;
    margin-right: 4%;
  }
}
</style>
