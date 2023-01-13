export default [
    {
        path:'approver',
        name:'approver',
        title:'审批人视图',
        component: resolve => require(['@/views/Main/report/reportPage/approver'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '报表分析'
            },
            {
                name: '',
                title: '审批人视图'
            }
        ]
    },
    {
        path:'deptLeader',
        name:'deptLeader',
        title:'部门负责人视图',
        component: resolve => require(['@/views/Main/report/reportPage/deptLeader'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '报表分析'
            },
            {
                name: '',
                title: '部门负责人视图'
            }
        ]
    },
    {
        path:'employee',
        name:'employee',
        title:'经办人视图',
        component: resolve => require(['@/views/Main/report/reportPage/employee'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '报表分析'
            },
            {
                name: '',
                title: '经办人视图'
            }
        ]
    },
    {
        path:'lawyer',
        name:'lawyer',
        title:'法律专员视图',
        component: resolve => require(['@/views/Main/report/reportPage/lawyer'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '报表分析'
            },
            {
                name: '',
                title: '法律专员视图'
            }
        ]
    },
    {
        path:'lawyerManager',
        name:'lawyerManager',
        title:'法律经理视图',
        component: resolve => require(['@/views/Main/report/reportPage/lawyerManager'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '报表分析'
            },
            {
                name: '',
                title: '法律经理视图'
            }
        ]
    },
    {
        path:'leader',
        name:'leader',
        title:'集团领导视图',
        component: resolve => require(['@/views/Main/report/reportPage/leader'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '报表分析'
            },
            {
                name: '',
                title: '集团领导视图'
            }
        ]
    },
    {
        path:'sealManager',
        name:'sealManager',
        title:'印章管理员视图',
        component: resolve => require(['@/views/Main/report/reportPage/sealManager'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '报表分析'
            },
            {
                name: '',
                title: '印章管理员视图'
            }
        ]
    },
    {
        path:'unitLeader',
        name:'unitLeader',
        title:'分管领导视图',
        component: resolve => require(['@/views/Main/report/reportPage/unitLeader'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '报表分析'
            },
            {
                name: '',
                title: '分管领导视图'
            }
        ]
    },
    
]