import axios from 'axios';
import NProgress from 'nprogress'

const MyAxios = {};
MyAxios.install = (Vue) => {
  // axios.defaults.baseURL = 'http://localhost:8080/';
  // Vue.prototype.$http = axios;

  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
  })
  instance.interceptors.request.use(function (config) {
    NProgress.start();
    // Do something before request is sent
    // 判断当前请求的地址是否是login
    if (config.url.toLowerCase() !== 'login') {
      const token = sessionStorage.getItem('token');
      // 如果请求的地址不是login，设置token
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    // Do something with response data
    NProgress.done();
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

  Vue.prototype.$http = instance;

}
export default MyAxios