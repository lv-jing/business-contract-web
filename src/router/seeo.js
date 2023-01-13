const Main = resolve => require(['@/views/ssoLogin/index'], resolve);

export default [

    {
        path: '/seo',
        name: 'seo',
        component: Main,
        title: '合同签章',
        redirect: {
            name: 'contractSign'
        },
        children:
            [
                {
                    path: '/contractSign',
                    name: 'contractSign',
                    title: '合同签章',
                    component: resolve => require(['@/views/ssoLogin/contractSign/index'], resolve),
                    meta: [
                        {
                            name: '',
                            title: '合同签章'
                        },

                    ],
                },
                {
                    path: '/authCompany',
                    name: 'authCompany',
                    title: '资质认证',
                    component: resolve => require(['@/views/ssoLogin/authCompany'], resolve),
                    meta: [


                    ]
                },
            ]
    },

]

