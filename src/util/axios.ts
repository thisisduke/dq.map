import Axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

// 定义接口
interface PendingType {
  url: string | undefined;
  method: Method | undefined;
  params: Record<string, unknown> | undefined;
  data: Array<string>  | undefined;
  cancel: () => void;
}

// 取消重复请求
const pending: Array<PendingType> = [];
// const CancelToken = Axios.CancelToken;

// axios 实例
const axios = Axios.create({
  timeout: 6000,
  responseType: "json",
});
const router = useRouter()
// 移除重复请求
const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key;
    const list: PendingType = pending[key];
    // 当前请求在数组中存在时执行函数体
    if (
      list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      // 执行取消操作
      list.cancel();
      // 从数组中移除记录
      pending.splice(item, 1);
    }
  }
};

// 添加请求拦截器
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // const token = Vue.ls.get(ACCESS_TOKEN)
    // if (token) {
    //     config.headers['Authorization'] = 'Bearer ' + token
    // }
    const email = localStorage.getItem("EMAIL")
    if(email){
      config.headers.email = email?.slice(1,-1)
    }
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // if (config.headers.isJwt) {
    // const token = localStorage.getItem("ACCESS_TOKEN");
    // if (token) {
    //   config.headers.Authorization = "Bearer " + token;
    // }
    // }
    return config;
  },
  (error: any) => {
    console.log(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  // 请求成功
  (response: AxiosResponse) => {
    removePending(response.config);
    return response;
  },
  // 请求失败
  (error: any) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      const response = error.response;

      // 根据返回的code值来做不同的处理(和后端约定)
      switch (response?.status) {
        case 401:
          // token失效
          // storage().remove('token');
          // storage('localstorage').remove('token');
          // window.location.href = "/login";
          break;
        case 403:
          // 没有权限
          window.location.href = "/403";
          break;
        case 500:
          // 服务端错误
          // window.location.href = "/503";
          message.error(response.status);
          break;
        case 503:
          // 服务端错误
          window.location.href = "/503";
          break;
        default:
          break;
      }
      // 超时重新请求
      const config = error.config;
      // 全局的请求次数,请求的间隙
      const [RETRY_COUNT, RETRY_DELAY] = [0, 1000];

      if (config && RETRY_COUNT) {
        // 设置用于跟踪重试计数的变量
        config.__retryCount = config.__retryCount || 3;
        // 检查是否已经把重试的总数用完
        if (config.__retryCount >= RETRY_COUNT) {
          return Promise.reject(response || { message: error.message });
        }
        // 增加重试计数
        config.__retryCount++;
        // 创造新的Promise来处理指数后退
        const backoff = new Promise((resolve: any) => {
          setTimeout(() => {
            resolve();
          }, RETRY_DELAY || 1);
        });
        // instance重试请求的Promise
        return backoff.then(() => {
          return axios(config);
        });
      }

      // eslint-disable-next-line
        return Promise.reject(response || {message: error.message});
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明

      message.warn("网络连接异常,请稍后再试!");
    }
  }
);

export default axios;
