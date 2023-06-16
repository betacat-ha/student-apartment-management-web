import axios from 'axios'
import store from '@/store/index'
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";

/**
 * 请求拦截
 */
axios.interceptors.request.use(
    config => {
        if (store.state.token != null &&  store.state.token != "") {
            // 请求头加上 token 数据
            config.headers.token = store.state.token;
        }else {
            // 没有token时
        }
        return config;
    },
    error => {
        console.log('error in request');
        return Promise.reject(error);
    }
);

// 添加全局响应拦截器
// axios.interceptors.response.use(
//     (response) => {
//       // 对响应数据进行处理
//       const data = response.data;
  
//       // 在这里可以进行一些统一的处理逻辑
//       // 例如，检查响应中是否存在错误信息，如果存在则进行处理
  
//       // 返回处理后的响应数据
//       return data;
//     },
//     (error) => {
//       // 对响应错误进行处理
//       // 例如，可以在这里统一处理网络错误、超时等情况
  
//       // 返回 Promise 对象，以便在发起请求的地方进行进一步处理
//       return Promise.reject(error);
//     }
//   );
  

axios.interceptors.response.use(
    (res) => {
      // 未设置状态码则默认成功状态
      const code = res.data.code || 200;
      // 获取错误信息
      const msg = res.data.msg;
      // 二进制数据则直接返回
      if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data;
      }
      // token过期
      if (msg === 'NOT_LOGIN') {
        res.data.msg = '登录已过期，请重新登录！';
        location.href = '/login';
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
      } else if (code === 500) {
        ElMessage({
          message: msg,
          type: 'error',
        });
        return Promise.reject(new Error(msg));
      } else if (code !== 200) {
        ElNotification.error({
          title: msg,
        });
        return Promise.reject('error');
      } else {
        return Promise.resolve(res);
      }
    },
    (error) => {
      console.log('err' + error);
      let { message } = error;
      if (message == 'Network Error') {
        message = '后端接口连接异常';
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时';
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常';
      }
      ElMessage({
        message: message,
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    }
  );

  axios.defaults.baseURL = "http://localhost:8088"  // 修改默认配置 请求根路径

// 导出给 main.js 挂载
export default axios;