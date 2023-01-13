import Vue from 'vue'
import formCreate from '@form-create/element-ui' // 引入自动生成form-create
import commonTitle from "@/components/CommonTitle/index";
import commonPagination from "@/components/CommonPagination/index";
import commonFooter from "@/components/CommonFooter/index";
import commonComplete from "@/components/CommonAutoComplete/index.js"
import commonSerachPerson from '@/components/commonSerachPerson'
import CommonHeaderHome from '@/components/CommonHeaderHome'
import CommonSelect from '@/components/CommonSelect'
import CommonSelectItem from '@/components/CommonSelect/selectItem'
import templateTree from '@/components/templateTree'
import CommonApproval from '@/components/CommonApproval'
import CommonApprovalMode from '@/components/CommonApprovalMode'
import CommonTableAppoval from '@/components/CommonTableAppoval'
import CommonRelation from '@/components/CommonRelation'
import CommonSignTabe from '@/components/CommonSignTabe/index'
import DictCodeToDictName from '@/components/DictCodeToDictName/index'
import datePicker from '@/components/datePicker'
import CommonItemSelect from '@/components/CommonItemSelect/index'
import CommonContractInfo from '@/components/CommonContractInfo/index'
import CommonSignChangeOrderButton from '@/components/CommonSignButton/CommonSignChangeOrderButton'
import CommonSignDeleteButton from '@/components/CommonSignButton/CommonSignDeleteButton'
import CommonSignFileShow from '@/components/CommonSignFileShow'
import CommonTreeSelect from '@/components/treeSelect'
import CommonTreeOrg from '@/components/treeSelectOrg'
import contractTypeTreeList from '@/components/contractTypeTreeList'
import CommonOrgTree from '@/components/CommonOrgTree'
import radioBox from '@/components/radioBox'
import CommonWorkflowPicture from '@/components/CommonWorkflowPicture/index'
import CommonCooperation from '@/components/CommonCooperation'
// 底部固定提交保存按钮
Vue.use(commonFooter)
Vue.use(formCreate)
Vue.use(commonTitle)
Vue.use(commonPagination)
Vue.use(commonComplete)
Vue.component('commonSerachPerson',commonSerachPerson)
Vue.component('commonHeaderHome',CommonHeaderHome)
Vue.component('CommonSelect',CommonSelect)
Vue.component('CommonSelectItem',CommonSelectItem)
Vue.component('templateTree',templateTree)
Vue.component('commonApproval',CommonApproval)
Vue.component('commonMode',CommonApprovalMode)
Vue.component('commonTableappoval',CommonTableAppoval)
Vue.component('commonRelation',CommonRelation)
Vue.component('CommonSignTabe',CommonSignTabe)
Vue.component('DictCodeToDictName',DictCodeToDictName)
Vue.component('datePicker',datePicker)
Vue.component('commonItemSelect',CommonItemSelect)
Vue.component('CommonContractInfo',CommonContractInfo)
Vue.component('CommonSignButton',CommonSignChangeOrderButton)
Vue.component('CommonSignDeleteButton',CommonSignDeleteButton)
Vue.component('CommonSignFileShow',CommonSignFileShow)
Vue.component('CommonTreeSelect',CommonTreeSelect)
Vue.component('CommonTreeOrg',CommonTreeOrg)
Vue.component('contractTypeTreeList',contractTypeTreeList)
Vue.component('CommonOrgTree',CommonOrgTree)
Vue.component('radioBox',radioBox)
Vue.component('CommonWorkflowPicture',CommonWorkflowPicture)
Vue.component('CommonCooperation',CommonCooperation)