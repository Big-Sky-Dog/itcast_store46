import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Users from '@/views/users/users'
import Rigths from '@/views/roles/rigths'
import Roles from '@/views/roles/roles'
import MyBreadcrumb from '@/components/MyBreadcrumb'

Vue.use(Router)
Vue.component(MyBreadcrumb.name, MyBreadcrumb)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
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
        }
      ]
    }
  ]
})
