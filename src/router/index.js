import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Users from '@/views/users/users'
import Rigths from '@/views/roles/rigths'
import Roles from '@/views/roles/roles'
import Category from '@/views/goods/Category'
import GoodList from '@/views/goods/List'
import GoodAdd from '@/views/goods/Add'
import OrderList from '@/views/orders/List'
import Reports from '@/views/reports/index'
import {Message} from 'element-ui'
import NProgress from 'nprogress'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rigths
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'category',
          path: '/categories',
          component: Category
        },
        {
          name: 'goods-list',
          path: '/goods',
          component: GoodList
        },
        {
          name: 'goods-add',
          path: '/goods/add',
          component: GoodAdd
        },
        {
          name: 'order-list',
          path: 'orders',
          component: OrderList
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next)  => {
  NProgress.start();
  if(to.name == 'login') {
    next()
  } else {
    const token = sessionStorage.getItem('token');
    if(!token) {
      roter.push({name: 'login'});
      Message.warning('请先登录');
      return;
    }
    next();
  }
})
router.afterEach((to, from) => {
  NProgress.done();
})
export default router;