export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            // authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              // {
              //   path: '/admin',
              //   name: 'admin',
              //   icon: 'crown',
              //   component: './Admin',
              //   // authority: ['admin'],
              //   routes: [
              //     {
              //       path: '/admin/sub-page',
              //       name: 'sub-page',
              //       icon: 'smile',
              //       component: './Welcome',
              //       // authority: ['admin'],
              //     },
              //   ],
              // },
              // {
              //   name: 'list.table-list',
              //   icon: 'table',
              //   path: '/list',
              //   component: './TableList',
              // },

              {
                path: '/system',
                name: 'system',
                icon: 'crown',
                routes: [
                  {
                    path: '/system/store/list',
                    name: 'store.list',
                    icon: 'smile',
                    component: './system/store',
                  },{
                    path: '/system/user/list',
                    name: 'user.list',
                    icon: 'smile',
                    component: './system/user',
                  },{
                    path: '/system/rabc_role/list',
                    name: 'rabc_role.list',
                    icon: 'smile',
                    component: './system/rabc_role',
                  },{
                    path: '/system/rabc_route/list',
                    name: 'rabc_route.list',
                    icon: 'smile',
                    component: './system/rabc_route',
                  },
                  {
                    name: 'explain_post.list',
                    icon: 'table',
                    path: '/system/explain_post/list',
                    component: './system/explain_post',
                  },{
                    path: '/system/ad/list',
                    name: 'ad.list',
                    icon: 'smile',
                    component: './system/ad',
                  },{
                    path: '/system/feedback/list',
                    name: 'feedback.list',
                    icon: 'smile',
                    component: './system/feedback',
                  },
                ],
              },
              {
                path: '/base',
                name: 'base',
                icon: 'crown',
                routes: [
                  {
                    path: '/base/comm_data/list/1115',
                    name: 'comm_data.list.1115',
                    icon: 'smile',
                    component: './base/comm_data/tree',
                  },{
                    path: '/base/comm_data/list/1116',
                    name: 'comm_data.list.1116',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/1112',
                    name: 'comm_data.list.1112',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/1114',
                    name: 'comm_data.list.1114',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/1120',
                    name: 'comm_data.list.1120',
                    icon: 'smile',
                    component: './base/comm_data/tree',
                  },{
                    path: '/base/comm_data/list/1121',
                    name: 'comm_data.list.1121',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/1220',
                    name: 'comm_data.list.1220',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/1221',
                    name: 'comm_data.list.1221',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/1222',
                    name: 'comm_data.list.1222',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/1223',
                    name: 'comm_data.list.1223',
                    icon: 'smile',
                    component: './base/comm_data',
                  },
                  {
                    path: '/base/comm_data/list/2110',
                    name: 'comm_data.list.2110',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/2120',
                    name: 'comm_data.list.2120',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/1230',
                    name: 'comm_data.list.1230',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/3110',
                    name: 'comm_data.list.3110',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/3111',
                    name: 'comm_data.list.3111',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/3112',
                    name: 'comm_data.list.3112',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/3113',
                    name: 'comm_data.list.3113',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/3114',
                    name: 'comm_data.list.3114',
                    icon: 'smile',
                    component: './base/comm_data',
                  },{
                    path: '/base/comm_data/list/3210',
                    name: 'comm_data.list.3210',
                    icon: 'smile',
                    component: './base/comm_data',
                  },
                ],
              },{
                path: '/log',
                name: 'log',
                icon: 'crown',
                routes: [
                  {
                    path: '/log/action_log/list',
                    name: 'action_log.list',
                    icon: 'smile',
                    component: './log/action_log',
                  },{
                    path: '/log/login_log/list',
                    name: 'login_log.list',
                    icon: 'smile',
                    component: './log/login_log',
                  },
                ],
              },


              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
