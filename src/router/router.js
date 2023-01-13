export default [
  {
    path: 'home',
    name: 'home',
    component: resolve => require(['@/views/Main/Home'], resolve),
    meta: [{
      name: 'home',
      title: '首页'
    }]
  },
  {
    path: 'agencymatter',
    name: 'agencymatter',
    title: '工作平台',
    component: resolve => require(['@/views/Main/MyWork/agencyMatter'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '工作平台'
      },
      {
        title: '待办事项'
      },
    ]
  },
  {
    path: 'donematter',
    name: 'donematter',
    title: '工作平台',
    component: resolve => require(['@/views/Main/MyWork/doneMatter'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '工作平台'
      },
      {
        title: '已办事项'
      },
    ]
  },
  {
    path: 'finishmatter',
    name: 'finishmatter',
    title: '工作平台',
    component: resolve => require(['@/views/Main/MyWork/finishMatter'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '工作平台'
      },
      {
        title: '办结事项'
      },
    ]
  },
  {
    path: 'authorizedapproval',
    name: 'authorizedapproval',
    title: '工作平台',
    component: resolve => require(['@/views/Main/MyWork/authorizedApproval'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '工作平台'
      },
      {
        title: '授权审批'
      },
    ]
  },
  {
    path: 'applyseal',
    name: 'applyseal',
    title: '合同签署',
    component: resolve => require(['@/views/Main/contractSigning/applySeal'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同签署'
      },
      {
        title: '申请用印'
      },
    ]
  },
  {
    path: 'printdownload',
    name: 'printdownload',
    title: '合同签署',
    component: resolve => require(['@/views/Main/contractSigning/printDownload'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同签署'
      },
      {
        title: '打印下载'
      },
    ]
  },
  {
    path: 'confirmation',
    name: 'confirmation',
    title: '合同签署',
    component: resolve => require(['@/views/Main/contractSigning/confirmationSignature'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同签署'
      },
      {
        title: '确认签署'
      },
    ]
  },{
    path: 'offlineSeal',
    name: 'offlineSeal',
    title: '线下用印补盖',
    component: resolve => require(['@/views/Main/contractSigning/offlineSeal/list'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同签署'
      },
      {
        title: '线下用印补盖'
      },
    ]
  },
  {
    path: 'watermarkapplication',
    name: 'watermarkapplication',
    title: '合同签署',
    component: resolve => require(['@/views/Main/contractSigning/watermarkApplication'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同签署'
      },
      {
        title: '无水印申请'
      },
    ]
  },
  {
    path: 'singleContract',
    name: 'singleContract',
    title: '合同发起',
    component: resolve => require(['@/views/Main/ContractApproval/SingleContract'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同报审'
      },
      {
        title: '合同发起'
      },
    ]
  },
  {
    path: 'singleContracts',
    name: 'singleContracts',
    title: '合同发起',
    component: resolve => require(['@/views/Main/ContractApproval/SingleContracts'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同报审'
      },
      {
        title: '批量发起'
      },
    ]
  },
  {
    path: 'changevoid',
    name: 'changevoid',
    title: '合同发起',
    component: resolve => require(['@/views/Main/ContractApproval/changeVoid'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同报审'
      },
      {
        title: '变更补充'
      },
    ]
  },
  {
    path: 'drafts',
    name: 'drafts',
    title: '草稿箱',
    component: resolve => require(['@/views/Main/ContractApproval/Drafts'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同报审'
      },
      {
        title: '草稿箱'
      },
    ]
  },
  {
    path: 'accountquery',
    name: 'accountquery',
    title: '合同台账查询',
    component: resolve => require(['@/views/Main/ComprehensiveQuery/accountQuery'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '综合查询'
      },
      {
        title: '合同台账查询'
      },
    ]
  },
  {
    path: 'archivequery',
    name: 'archivequery',
    title: '合同归档查询',
    component: resolve => require(['@/views/Main/ComprehensiveQuery/archiveQuery'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '综合查询'
      },
      {
        title: '合同归档查询'
      },
    ]
  },
  {
    path: 'batchquery',
    name: 'batchquery',
    title: '合同归档查询',
    component: resolve => require(['@/views/Main/ComprehensiveQuery/batchQuery'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '综合查询'
      },
      {
        title: '批量合同查询'
      },
    ]
  },
  {
    path: 'contractarchive',
    name: 'contractarchive',
    title: '合同归档',
    component: resolve => require(['@/views/Main/contractArchive'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同归档'
      },
      {
        title: '合同归档'
      },
    ]
  },
  {
    path: 'circulationquery',
    name: 'circulationquery',
    title: '合同传阅查询',
    component: resolve => require(['@/views/Main/ComprehensiveQuery/circulationQuery'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '综合查询'
      },
      {
        title: '合同传阅查询'
      },
    ]
  },
  {
    path: 'terms',
    name: 'terms',
    title: '条款管理',
    component: resolve => require(['@/views/Main/lawyerCenter/termOperate'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '律师中心'
      },
      {
        name: '',
        title: '条款管理'
      },
    ]
  },
  {
    path: 'managetemplate',
    name: 'managetemplate',
    title: '范本管理',
    component: resolve => require(['@/views/Main/template/templateOperate'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '律师中心'
      },
      {
        name: '',
        title: '范本管理'
      },
    ]
  },{
    path: 'cooprationForbidden',
    name: 'cooprationForbidden',
    title: '失信名单',
    component: resolve => require(['@/views/Main/lawyerCenter/coopration'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '律师中心'
      },
      {
        name: '',
        title: '失信名单'
      },
    ]
  },
  {
    path: 'contractManagetemplate',
    name: 'contractManagetemplate',
    title: '范本管理',
    component: resolve => require(['@/views/Main/template/templateOperate'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同范本'
      },
      {
        name: '',
        title: '范本管理'
      },
    ]
  },

  {
    path: 'contractMonitoring',
    name: 'contractMonitoring',
    title: '合同监控',
    component: resolve => require(['@/views/Main/lawyerCenter/contractMonitoring'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '律师中心'
      },
      {
        name: '',
        title: '合同监控'
      },
    ]
  },
  {
    path:'templateMainTain',
    name:'templateMainTain',
    title:'范本维护',
    component: resolve => require(['@/views/Main/lawyerCenter/templateMainTain'],resolve),
    meta:[
      {
        name:'home',
        title:'首页'
      },
      {
        name:'',
        title:'律师中心'
      },
      {
        name:'',
        title:'范本维护'
      }
    ]
  },
  {
    path: 'querytemplate',
    name: 'querytemplate',
    title: '查询范本',
    component: resolve => require(['@/views/Main/template/querytemplate'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同范本'
      },
      {
        name: '',
        title: '查询范本'
      },
    ]
  },
  {
    path: 'commontemplates',
    name: 'commontemplates',
    title: '查询范本',
    component: resolve => require(['@/views/Main/commonTemplates'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同范本'
      },
      {
        name: '',
        title: '常用范本'
      },
    ]
  },
  {
    path: 'distribute',
    name: 'distribute',
    title: '查询范本',
    component: resolve => require(['@/views/distribute'], resolve),
    meta: [
      {
        name: 'home',
        title: ''
      }
    ]
  },
  {
    path: 'contractrecall',
    name: 'contractrecall',
    title: '流程作废',
    component: resolve => require(['@/views/Main/contractreCall'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '流程作废'
      },
      {
        name: '',
        title: '流程作废'
      },
    ]
  },
  {
    path: 'toolremind',
    name: 'toolremind',
    title: '合同助手',
    component: resolve => require(['@/views/Main/contractAssistant/toolremind'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同助手'
      },
      {
        name: '',
        title: '小工具-提醒'
      },
    ]
  },
  {
    path: 'toolwarning',
    name: 'toolwarning',
    title: '合同助手',
    component: resolve => require(['@/views/Main/contractAssistant/toolwarning'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同助手'
      },
      {
        name: '',
        title: '小工具-预警'
      },
    ]
  },
  {
    path: 'toolauth',
    name: 'toolauth',
    title: '合同助手',
    component: resolve => require(['@/views/Main/contractAssistant/toolauth'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同助手'
      },
      {
        name: '',
        title: '小工具-合同传阅'
      },
    ]
  },
  {
    path: 'tooltransfer',
    name: 'tooltransfer',
    title: '合同助手',
    component: resolve => require(['@/views/Main/contractAssistant/tooltransfer'], resolve),
    meta: [
      {
        name: 'home',
        title: '首页'
      },
      {
        name: '',
        title: '合同助手'
      },
      {
        name: '',
        title: '小工具-合同移交'
      },
    ]
  },
]

