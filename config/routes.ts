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
                name: 'warehouseInfo.list',
                icon: 'table',
                path: '/warehouseInfo/list',
                component: './warehouseInfo',
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
                path: '/base',
                name: 'base',
                icon: 'crown',
                routes: [
                  {
                    path: '/base/invoiceClause/list',
                    name: 'invoiceClause.list',
                    icon: 'smile',
                    component: './base/invoiceClause',
                  },
                ],
              },

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
