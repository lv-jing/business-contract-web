/**
 * 查询数据表单
 */

/* eslint-disable */


/**
 * 查询数据表单
 */

export const searchFormRule = [

  {
    "type": "input", "field": "projectName", "title": "合同名称", "value": "",
    props: {
      placeholder: "请输入",
    },
    col: {
      span: 8,
      labelWidth: '100px'
    }
  },
    {
    "type": "input", "field": "as", "title": "合同名称", "value": "",
    props: {
      placeholder: "请输入",
    },
    col: {
      span: 8,
      labelWidth: '100px'
    }
  },
  {
    "type": "input", "field": "sa", "title": "合同流水号", "value": "",
    props: {
      placeholder: "请输入",
    },
    col: {
      span: 8,
      labelWidth: '100px'
    }
  },
  {
    "type": "input", "field": "fa", "title": "我方签约主体", "value": "",
    props: {
      placeholder: "请输入",
    },
    col: {
      span: 8,
      labelWidth: '100px'
    }
  },
  {
    "type": "input", "field": "aa", "title": "对方签约主体", "value": "",
    props: {
      placeholder: "请输入",
    },
    col: {
      span: 8,
      labelWidth: '100px'
    }
  },
  {
    "type": "input", "field": "employeeName1", "title": "合同金额", "value": "",
    props: {
      placeholder: "请输入",
    },
    col: {
      span: 8,
      labelWidth: '100px'
    }
  },
  {
    "type": "el-col",
    children: [{
      "type": "el-button", "title": "", name: "btn",
      props: {
        type: 'primary',
        icon: 'iconfont sbt_search'
      },
      children: ['查询'],
      col: {
        span: 4,
        labelWidth: '100px'
      },
      emit: [{name: 'click', inject: true}],
      emitPrefix: 'form-search',
    }, {
      "type": "el-button", "title": "", name: "btn",
      props: {
        type: 'default',
        icon: 'iconfont sbt_reset'
      },
      children: ['重置'],
      col: {
        span: 4,
        labelWidth: '100px'
      },
      emit: [{name: 'click', inject: true}],
      emitPrefix: 'form-reset',
    }],
    col: {
      span: 8,
      labelWidth: '100px'
    },
    class: 'tr',
  },
]


export function addFormRule(_this) {
  return [
    {
      type: 'common-title',
      name: 'title',
      props: {
        title: '基本信息'
      },
    },
    {
      "type": "input", "field": "documentNumber", "title": "业务实体", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "doc", "title": "产值单编号", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "docs", "title": "报产时间", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "doscs", "title": "创建时间", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "sadsa", "title": "项目编号", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "svvadsa", "title": "项目名称", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "svvafdsddsa", "title": "单价状态", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "doscss", "title": "系统合同编号", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "fd", "title": "总包合同编号", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "fsad", "title": "总包合同名称", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "fsasad", "title": "合同类型", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "aasds", "title": "甲方名称", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "sa", "title": "日记账名称", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "ssaa", "title": "内部产值金额", "value": "",
      class: 'w-100',
      props: {
        placeholder: "请输入"
      },
      col: {
        span: 6,
        labelWidth: '100px'
      },
    },
    {
      "type": "input", "field": "necNote", "title": "形象进度说明", "value": "",
      props: {
        placeholder: "请输入",
        type: "textarea",
        autosize:{ minRows: 4},
        showWordLimit: true,
        maxlength: 1333
      },
      col: {
        span: 24,
        labelWidth: '100px'
      },
    },
  ]
}
