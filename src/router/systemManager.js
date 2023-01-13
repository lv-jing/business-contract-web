export default [
    {
        path:'systemManager',
        name:'systemManager',
        title:'系统管理',
        component: resolve => require(['@/views/Main/SystemManagement/System'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '菜单管理'
            }
        ]
    },
    {
        path:'userManager',
        name:'userManager',
        title:'用户管理',
        component: resolve => require(['@/views/Main/SystemManagement/user/userList'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '用户管理'
            }
        ]
    },
    {
        path:'orgManager',
        name:'orgManager',
        title:'组织管理',
        component: resolve => require(['@/views/Main/SystemManagement/user/orgList'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '组织管理'
            }
        ]
    },
    {
        path:'roleUserManager',
        name:'roleUserManager',
        title:'角色用户管理',
        component: resolve => require(['@/views/Main/SystemManagement/user/roleUserList'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '角色用户管理'
            }
        ]
    },
    {
        path:'userPower',
        name:'userPower',
        title:'用户数据权限管理',
        component: resolve => require(['@/views/Main/SystemManagement/user/userPower'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '用户数据权限管理'
            }
        ]
    },{
        path:'roleManager',
        name:'roleManager',
        title:'角色管理',
        component: resolve => require(['@/views/Main/SystemManagement/user/roleList'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '角色管理'
            }
        ]
    },
    {
        path:'dictManager',
        name:'dictManager',
        title:'字典管理',
        component: resolve => require(['@/views/Main/SystemManagement/System/dictList'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '字典管理'
            }
        ]
    },{
        path:'node',
        name:'node',
        title:'环节配置',
        component: resolve => require(['@/views/Main/SystemManagement/workflow/node'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '审批环节配置'
            }
        ]
    },{
        path:'taskNode',
        name:'taskNode',
        title:'环节配置',
        component: resolve => require(['@/views/Main/SystemManagement/workflow/taskNode'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '审批节点配置'
            }
        ]
    },{
        path:'defined',
        name:'defined',
        title:'要素组合配置',
        component: resolve => require(['@/views/Main/SystemManagement/workflow/defined'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统设置'
            },
            {
                name: '',
                title: '要素组合配置'
            }
        ]
    },{
        path:'path',
        name:'path',
        title:'审批路径配置',
        component: resolve => require(['@/views/Main/SystemManagement/workflow/path'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '审批路径配置'
            }
        ]
    },{
        path:'approval',
        name:'approval',
        title:'审批规则配置',
        component: resolve => require(['@/views/Main/SystemManagement/workflow/approval'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '审批规则配置'
            }
        ]
    },{
        path:'calendar',
        name:'calendar',
        title:'工作日历',
        component: resolve => require(['@/views/Main/SystemManagement/System/calendar'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '工作日历'
            }
        ]
    },{
        path:'batchManager',
        name:'batchManager',
        title:'批量维护',
        component: resolve => require(['@/views/Main/SystemManagement/batchManager/index'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '批量维护'
            }
        ]
    },
    {
        path:'workflowSetting',
        name:'workflowSetting',
        title:'流程配置',
        component: resolve => require(['@/views/Main/SystemManagement/workflow'],resolve),
        meta: [
            {
                name: 'home',
                title: '首页'
            },
            {
                name: '',
                title: '系统管理'
            },
            {
                name: '',
                title: '流程配置'
            }
        ]
    }
]