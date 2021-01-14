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
            authority: ['admin', 'user'],
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
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                // authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    // authority: ['admin'],
                  },
                ],
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './TableList',
              },
              {
                name: 'productInfo.list',
                icon: 'table',
                path: '/productInfo/list',
                component: './productInfo',
              },

              // {
              //   path: '/invoiceClause/list',
              //   name: 'invoiceClause.list',
              //   icon: 'smile',
              //   component: './invoiceClause',
              // },
             



              {
                path: '/system',
                name: 'system',
                icon: 'crown',
                routes: [
                  {
                    path: '/system/ad/list',
                    name: 'ad.list',
                    icon: 'smile',
                    component: './system/ad',
                  },
                  {
                    name: 'explain_post.list',
                    icon: 'table',
                    path: '/system/explain_post/list',
                    component: './system/explain_post',
                  },
                ],
              },
              {
                path: '/base',
                name: 'base',
                icon: 'crown',
                routes: [
                  {
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
                    path: '/base/comm_data/list/1116',
                    name: 'comm_data.list.1116',
                    icon: 'smile',
                    component: './base/comm_data',
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
