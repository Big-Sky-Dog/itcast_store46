import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Users from '@/views/users/users'
import Rigths from '@/views/roles/rigths'
import Roles from '@/views/roles/roles'
import Category from '@/views/goods/Category'
import {Message} from 'element-ui'

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
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next)  => {
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
export default router;