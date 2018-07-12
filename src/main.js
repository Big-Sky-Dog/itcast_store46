// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MyAxios from './plugins/MyAxios'
import './assets/css/style.css'
import moment from 'moment'
import MyBreadcrumb from '@/components/MyBreadcrumb'

Vue.config.productionTip = false
Vue.component(MyBreadcrumb.name, MyBreadcrumb)
Vue.filter('fmtDate', (value, fmtString) => {
  return moment(value).format(fmtString);
});
Vue.use(MyAxios)
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
