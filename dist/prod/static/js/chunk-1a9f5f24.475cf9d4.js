(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1a9f5f24"],{"06b0":function(e,a,t){"use strict";t.r(a);var d=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t(e.choose,{ref:"declaration",tag:"component"})},o=[],i=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",[t("div",{staticClass:"bg-white mb24 pd24"},[t("el-form",{ref:"ruleForm",class:e.show?"over-vis":"over-hid",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"100px"}},[t("el-row",{attrs:{gutter:24}},[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"合同名称编号",prop:"contractName"}},[t("el-input",{attrs:{placeholder:"请输入合同名称编号"},model:{value:e.ruleForm.contractName,callback:function(a){e.$set(e.ruleForm,"contractName",a)},expression:"ruleForm.contractName"}})],1)],1),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"我方签约主体",prop:"ourSide"}},[t("el-input",{attrs:{placeholder:"请输入我方签约主体"},model:{value:e.ruleForm.ourSide,callback:function(a){e.$set(e.ruleForm,"ourSide",a)},expression:"ruleForm.ourSide"}})],1)],1),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"对方签约主体",prop:"otherSide"}},[t("el-input",{attrs:{placeholder:"请输入对方签约主体"},model:{value:e.ruleForm.otherSide,callback:function(a){e.$set(e.ruleForm,"otherSide",a)},expression:"ruleForm.otherSide"}})],1)],1),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"审批完成时间"}},[t("datePicker",{ref:"datePicker",model:{value:e.timeData,callback:function(a){e.timeData=a},expression:"timeData"}})],1)],1)],1)],1),t("div",{staticClass:"button-box tr"},[t("el-button",{attrs:{type:"primary",icon:"iconfont sbt_add"},on:{click:e.formSearchMethod}},[e._v("查询")]),t("el-button",{attrs:{icon:"iconfont sbt_add"},on:{click:function(a){return e.formResetMethod()}}},[e._v("重置")])],1)],1),t("div",{staticClass:"bg-white user-form-table pd24"},[t("el-tabs",{attrs:{type:"card"},on:{"tab-click":e.handleClick},model:{value:e.activeName,callback:function(a){e.activeName=a},expression:"activeName"}},[t("el-tab-pane",{attrs:{label:"用印申请",name:"first"}},[t("el-button",{attrs:{type:"primary",icon:"iconfont sbt_add"},on:{click:e.chooseSign}},[e._v("选择签署方式")])],1),t("el-tab-pane",{attrs:{label:"更改用印",name:"second"}},[t("el-button",{attrs:{type:"primary",icon:"iconfont sbt_add"},on:{click:e.changeData}},[e._v("更改用印信息")])],1)],1),t("CommonSignTabe",{ref:"commonSignTable",attrs:{queryData:e.queryTableData},on:{getData:e.getDataFromTable}})],1)])},r=[],n=t("a34a"),l=t.n(n),c=t("c973"),s=t.n(c),f=t("3156"),p=t.n(f),b=[{type:"input",field:"projectName",title:"合同名称",value:"",props:{placeholder:"请输入"},col:{span:8,labelWidth:"100px"}},{type:"input",field:"as",title:"合同名称",value:"",props:{placeholder:"请输入"},col:{span:8,labelWidth:"100px"}},{type:"input",field:"sa",title:"合同流水号",value:"",props:{placeholder:"请输入"},col:{span:8,labelWidth:"100px"}},{type:"input",field:"fa",title:"我方签约主体",value:"",props:{placeholder:"请输入"},col:{span:8,labelWidth:"100px"}},{type:"input",field:"aa",title:"对方签约主体",value:"",props:{placeholder:"请输入"},col:{span:8,labelWidth:"100px"}},{type:"input",field:"employeeName1",title:"合同金额",value:"",props:{placeholder:"请输入"},col:{span:8,labelWidth:"100px"}},{type:"el-col",children:[{type:"el-button",title:"",name:"btn",props:{type:"primary",icon:"iconfont sbt_search"},children:["查询"],col:{span:4,labelWidth:"100px"},emit:[{name:"click",inject:!0}],emitPrefix:"form-search"},{type:"el-button",title:"",name:"btn",props:{type:"default",icon:"iconfont sbt_reset"},children:["重置"],col:{span:4,labelWidth:"100px"},emit:[{name:"click",inject:!0}],emitPrefix:"form-reset"}],col:{span:8,labelWidth:"100px"},class:"tr"}];var m={data:function(){return{show:!1,overHeight:"150px",ruleForm:{statue:"STA005",contractName:"",ourSide:"",otherSide:""},rules:{},deletUrl:"",searchFormModel:{},searchFormRule:b,searchOption:{resetBtn:!1,submitBtn:!1,form:{size:"small"}},queryTableData:{},timeData:{startTime:"",endTime:""},choosedTableData:[],activeName:"first"}},mounted:function(){this.queryTableData={type:"SEALAPPLICATION",data:this.ruleForm}},methods:{handleClick:function(e,a){"first"===e.name?this.ruleForm.statue="STA005":this.ruleForm.statue="STA006,STA007,STA008,STA009,STA015",this.formSearchMethod()},formSearchMethod:function(){this.ruleForm.approvalTimeFrom=this.timeData.startTime,this.ruleForm.approvalTimeTo=this.timeData.endTime,this.queryContract()},formResetMethod:function(){this.$refs.ruleForm.resetFields(),this.timeData={startTime:"",endTime:""},this.$refs.datePicker.reset(),this.ruleForm.approvalTimeFrom="",this.ruleForm.approvalTimeTo="",this.queryTableData={type:"SEALAPPLICATION",data:p()({},this.ruleForm)}},queryContract:function(){var e=this;return s()(l.a.mark(function a(){return l.a.wrap(function(a){while(1)switch(a.prev=a.next){case 0:e.queryTableData={type:"SEALAPPLICATION",data:p()({},e.ruleForm)},e.$refs.commonSignTable.getData();case 2:case"end":return a.stop()}},a)}))()},getDataFromTable:function(e){this.choosedTableData=[],e.length>1||0===e.length?this.$message({type:"error",message:"必须勾选且只能选一条！"}):this.choosedTableData.push(e[0])},changeData:function(){if(this.choosedTableData&&1===this.choosedTableData.length){if("STA006"!==this.choosedTableData[0].statue&&"STA007"!==this.choosedTableData[0].statue)return void this.$message({type:"error",message:"不满足合同更改用印信息条件！"});this.$router.push({name:"applyseal",query:{type:"auditing",contractId:this.choosedTableData[0].contractId,signType:"CHANGESIGN"}})}else this.$message({type:"error",message:"请勾选一条"})},chooseSign:function(){if(this.choosedTableData&&1===this.choosedTableData.length){if("STA005"!==this.choosedTableData[0].statue)return void this.$message({type:"error",message:"该合同已申请用印！"});this.$router.push({name:"applyseal",query:{type:"auditing",contractId:this.choosedTableData[0].contractId,signType:"CHOOSESIGNTYPE"}})}else this.$message({type:"error",message:"请勾选一条"})}}},u=m,v=(t("7848"),t("0c7c")),h=Object(v["a"])(u,i,r,!1,null,"dbfa55ce",null),x=h.exports,g=t("e073e"),y={data:function(){return{choose:x}},watch:{$route:function(e,a){var t=e.query.type;this.changeComponent(t)}},created:function(){var e=this.$route.query.type;this.changeComponent(e)},methods:{changeComponent:function(e){switch(e){case"add":case"edit":case"view":case"auditing":this.choose=g["a"];break;default:this.choose=x;break}}}},w=y,k=Object(v["a"])(w,d,o,!1,null,"1c6cce44",null);a["default"]=k.exports},7848:function(e,a,t){"use strict";var d=t("98dd"),o=t.n(d);o.a},"98dd":function(e,a,t){var d=t("efe9");"string"===typeof d&&(d=[[e.i,d,""]]),d.locals&&(e.exports=d.locals);var o=t("499e").default;o("a345a0d4",d,!0,{sourceMap:!1,shadowMode:!1})},efe9:function(e,a,t){a=e.exports=t("c356")(!1),a.push([e.i,"blockquote[data-v-dbfa55ce],body[data-v-dbfa55ce],dd[data-v-dbfa55ce],dl[data-v-dbfa55ce],dt[data-v-dbfa55ce],fieldset[data-v-dbfa55ce],h1[data-v-dbfa55ce],h2[data-v-dbfa55ce],h3[data-v-dbfa55ce],h4[data-v-dbfa55ce],h5[data-v-dbfa55ce],h6[data-v-dbfa55ce],input[data-v-dbfa55ce],ol[data-v-dbfa55ce],p[data-v-dbfa55ce],pre[data-v-dbfa55ce],td[data-v-dbfa55ce],textarea[data-v-dbfa55ce],th[data-v-dbfa55ce],ul[data-v-dbfa55ce]{font-family:PingFangSC-Regular,PingFangSC-Medium,Microsoft YaHei,Helvetica Neue,Droid Sans,Droid Sans Fallback,Heiti SC,Hiragino Sans GB,Simsun,sans-self,serif;margin:0;padding:0;font-size:14px}body[data-v-dbfa55ce],html[data-v-dbfa55ce]{overflow:hidden}body .el-table colgroup.gutter[data-v-dbfa55ce],body .el-table th.gutter[data-v-dbfa55ce]{display:table-cell!important}table[data-v-dbfa55ce]{border-collapse:collapse;border-spacing:0;empty-cells:show}ul[data-v-dbfa55ce]{list-style:none}input[data-v-dbfa55ce]:-webkit-autofill,select[data-v-dbfa55ce]:-webkit-autofill,textarea[data-v-dbfa55ce]:-webkit-autofill{-webkit-text-fill-color:#606266!important;-webkit-box-shadow:0 0 0 1000px transparent inset!important;background-color:transparent;background-image:none;-webkit-transition:background-color 50000s ease-in-out 0s;transition:background-color 50000s ease-in-out 0s}.el-select--medium[data-v-dbfa55ce]{vertical-align:bottom!important}.el-select__input[data-v-dbfa55ce]{vertical-align:baseline}input[data-v-dbfa55ce]{background-color:transparent}input[data-v-dbfa55ce]:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px transparent inset!important;-webkit-text-fill-color:#606266!important}.bg-white[data-v-dbfa55ce]{background:#fff}.pl24[data-v-dbfa55ce]{padding-left:24px}.pd16[data-v-dbfa55ce]{padding:16px}.pd24[data-v-dbfa55ce]{padding:24px}.pd24_1[data-v-dbfa55ce],.pdl24[data-v-dbfa55ce]{padding-left:24px}.pd24_1[data-v-dbfa55ce]{padding-bottom:24px}.tc[data-v-dbfa55ce]{text-align:center}.tr[data-v-dbfa55ce]{text-align:right}.white[data-v-dbfa55ce]{color:#fff}.flex[data-v-dbfa55ce]{display:-webkit-box;display:-ms-flexbox;display:flex}.flex-center-between[data-v-dbfa55ce]{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.flex-center[data-v-dbfa55ce],.flex-center-between[data-v-dbfa55ce]{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.flex-center[data-v-dbfa55ce]{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.flex-around[data-v-dbfa55ce]{-ms-flex-pack:distribute;justify-content:space-around}.flex-center-around[data-v-dbfa55ce]{-ms-flex-pack:distribute;justify-content:space-around}.flex-center-around[data-v-dbfa55ce],.flex-center-end[data-v-dbfa55ce]{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.flex-center-end[data-v-dbfa55ce]{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.flex-center-start[data-v-dbfa55ce]{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ml5[data-v-dbfa55ce]{margin-left:5px}.ml10[data-v-dbfa55ce]{margin-left:10px}.ml15[data-v-dbfa55ce]{margin-left:15px}.ml20[data-v-dbfa55ce]{margin-left:20px}.mr10[data-v-dbfa55ce]{margin-right:10px}.mr20[data-v-dbfa55ce]{margin-right:20px}.mt10[data-v-dbfa55ce]{margin-top:10px}.mt16[data-v-dbfa55ce]{margin-top:16px}.mt20[data-v-dbfa55ce]{margin-top:20px}.mt24[data-v-dbfa55ce]{margin-top:24px}.mb16[data-v-dbfa55ce]{margin-bottom:16px}.mb20[data-v-dbfa55ce]{margin-bottom:20px}.mb24[data-v-dbfa55ce]{margin-bottom:24px}.p15[data-v-dbfa55ce]{padding:15px}.p20[data-v-dbfa55ce]{padding:20px}.p25[data-v-dbfa55ce]{padding:25px}.pt10[data-v-dbfa55ce]{padding-top:10px}.pt30[data-v-dbfa55ce]{padding-top:30px}.pr20[data-v-dbfa55ce]{padding-right:20px}.pb24[data-v-dbfa55ce]{padding-bottom:24px}.el-drawer__body[data-v-dbfa55ce]{overflow:auto!important}.pointer[data-v-dbfa55ce]{cursor:pointer}img[data-v-dbfa55ce]{border:0}textarea[data-v-dbfa55ce]{resize:none}caption[data-v-dbfa55ce],th[data-v-dbfa55ce]{text-align:left}em[data-v-dbfa55ce],i[data-v-dbfa55ce]{font-style:normal}hr[data-v-dbfa55ce]{margin-top:0;margin-bottom:0}a[data-v-dbfa55ce]:focus{outline:none!important}a[data-v-dbfa55ce]{text-decoration:none!important;color:#2393f7}.el-drawer[data-v-dbfa55ce]:focus,button[data-v-dbfa55ce]:focus,input[data-v-dbfa55ce]:focus{outline:none;-moz-outline:none}.__view[data-v-dbfa55ce]{width:0!important}.form-bg[data-v-dbfa55ce]{width:100%;overflow:hidden;background:#f9fbfc;padding:0 10px 0 10px;border-radius:3px}.form-bg .el-input.is-disabled .el-input__inner[data-v-dbfa55ce]{color:#303133;font-size:14px}.form-bg .el-textarea__inner[data-v-dbfa55ce]{font-size:14px}.form-bg .el-textarea.is-disabled .el-textarea__inner[data-v-dbfa55ce]{color:#303133;font-size:14px}.w-100[data-v-dbfa55ce]{width:100%!important}.t-l[data-v-dbfa55ce]{text-align:left}.list-search[data-v-dbfa55ce]{width:100%}.el-icon-document-copy[data-v-dbfa55ce]{vertical-align:middle;margin-right:5px!important;width:24px;text-align:center;font-size:18px}.title-size[data-v-dbfa55ce]{overflow:visible!important;visibility:visible!important;height:57px!important}.el-submenu__icon-arrow.el-icon-arrow-right[data-v-dbfa55ce]{display:block!important}.el-submenu__icon-arrow.el-icon-arrow-right .el-menu-item.is-active[data-v-dbfa55ce]{text-align:center!important}.color-blue[data-v-dbfa55ce]{color:#0070c1}.el-menu--collapse[data-v-dbfa55ce]{width:auto}.common-footer-box[data-v-dbfa55ce]{width:98%;position:fixed;bottom:0;left:0;background:#fff;padding:20px;-webkit-box-shadow:0 -4px 8px 0 rgba(0,0,0,.1);box-shadow:0 -4px 8px 0 rgba(0,0,0,.1);z-index:10}.common-footer[data-v-dbfa55ce]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.common-footer-content[data-v-dbfa55ce]{margin-left:14%;width:77%}.ft18[data-v-dbfa55ce]{font-size:18px}.ft16[data-v-dbfa55ce]{font-size:16px}.ft10[data-v-dbfa55ce]{padding-top:20px;font-size:14px}.ft25[data-v-dbfa55ce]{font-size:25px}.el-dialog__header[data-v-dbfa55ce]{padding:13px 20px;border-bottom:1px solid #dee0e3}.el-tree-node[data-v-dbfa55ce],.is-expanded[data-v-dbfa55ce],.is-focusable[data-v-dbfa55ce]{color:#606266}.is-current[data-v-dbfa55ce]{color:#2393f7}.bg100[data-v-dbfa55ce]{height:100px}li[data-v-dbfa55ce]{list-style:none}.el-menu--popup-right-start[data-v-dbfa55ce]{margin-left:0}.el-step__description.is-finish[data-v-dbfa55ce]{color:#303133}.el-step__title.is-finish[data-v-dbfa55ce]{color:#303133!important}.el-step__head.is-finish[data-v-dbfa55ce]{color:#303133;border-color:#303133}.el-step__description.is-wait[data-v-dbfa55ce],.el-step__title.is-wait[data-v-dbfa55ce]{color:#303133}.el-step__head.is-wait[data-v-dbfa55ce]{color:#303133;border-color:#303133}.el-step__line[data-v-dbfa55ce]{background-color:#303133}.el-tooltip__popper[data-v-dbfa55ce]{max-width:20%}.underline[data-v-dbfa55ce]{text-decoration:underline;color:#2393f7}.modlue-box[data-v-dbfa55ce]{width:100%;height:100%;position:fixed;z-index:20}.viewOffice[data-v-dbfa55ce]{height:90%;position:fixed}.vue-treeselect--disabled .vue-treeselect__control[data-v-dbfa55ce]{background-color:#f5f7fa;height:32px!important}.vue-treeselect__control[data-v-dbfa55ce]{height:32px}.vue-treeselect__menu[data-v-dbfa55ce]{max-height:250px!important}.vue-treeselect--disabled .vue-treeselect__single-value[data-v-dbfa55ce]{color:#303133;font-size:13px}.modlue-box .el-loading-spinner .circular[data-v-dbfa55ce]{display:none}.modlue-box .el-loading-spinner .el-loading-text[data-v-dbfa55ce]{font-size:16px}.radio-cont[data-v-dbfa55ce]{padding:20px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.setradio[data-v-dbfa55ce]{padding-bottom:14px}.setradio .el-radio[data-v-dbfa55ce]{padding:0;width:100%;background:#fff}.setradio .el-radio[data-v-dbfa55ce],.setradio .el-radio__input[data-v-dbfa55ce]{white-space:normal}.setradio .el-radio__label[data-v-dbfa55ce]{padding:0}.setradio .el-radio.is-bordered.is-checked[data-v-dbfa55ce]{border:2px solid #409eff}.setradio .el-radio-group[data-v-dbfa55ce]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.setradio .el-radio__input[data-v-dbfa55ce]{padding:0;margin:0;position:absolute;bottom:-25px;left:45%}.setradio .el-radio__input .el-radio__inner[data-v-dbfa55ce]{width:16px;height:16px}.radio-img img[data-v-dbfa55ce]{width:50px}.radio-rig[data-v-dbfa55ce]{margin-left:10px}.radio-rig span[data-v-dbfa55ce]{display:block;font-size:16px;font-weight:600;color:#1f2329;margin-bottom:10px}.radio-rig p[data-v-dbfa55ce]{display:none;font-size:12px;color:#8f959e;letter-spacing:0;text-align:justify;line-height:18px}.el-radio:hover .hind[data-v-dbfa55ce]{display:block}.box-solid-bt[data-v-dbfa55ce]{border-bottom:1px solid #eee;margin-bottom:16px}.border-top[data-v-dbfa55ce]{margin-top:15px;padding-top:15px}.border-top[data-v-dbfa55ce],.tp-das[data-v-dbfa55ce]{border-top:1px dashed #d9d9d9}#over-select .el-select__tags-text[data-v-dbfa55ce]{display:inline-block;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#over-select .el-select .el-tag__close.el-icon-close[data-v-dbfa55ce]{top:-5px}.el-submenu__title[data-v-dbfa55ce]{border:none}.vue-treeselect__menu-container[data-v-dbfa55ce],.vue-treeselect__portal-target[data-v-dbfa55ce]{z-index:90000000000000!important}.el-tag.el-tag--info[data-v-dbfa55ce]{color:#303133;font-size:14px}.over-hid[data-v-dbfa55ce]{height:150px;overflow:hidden}.over-vis[data-v-dbfa55ce]{height:auto;overflow:visible}.button-center[data-v-dbfa55ce]{text-align:center}.button-center span[data-v-dbfa55ce]{font-size:14px;color:#2393f7}",""])}}]);