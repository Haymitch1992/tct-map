import axios from 'axios'
import { userStore } from '../store/user';
import { ElMessage } from 'element-plus';

// 跨域认证信息 header 名
const xsrfHeaderName = 'X-Auth-Token'

axios.defaults.timeout = 5000
axios.defaults.withCredentials= true
axios.defaults.xsrfHeaderName= xsrfHeaderName
axios.defaults.xsrfCookieName= xsrfHeaderName

// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
  AUTH1: 'auth1',
  AUTH2: 'auth2',
}

// http method
const METHOD = {
  GET: 'get',
  POST: 'post'
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url: string, method: string, params?: object, config?: object) {
  axios.interceptors.request.use(function (config: any) {
    // const old = localStorage.getItem('login-store')
    // if (old) { 
    //   let obj = JSON.parse(old)
    //   config.headers.usertoken = obj.user_token
    //   config.headers.userid = obj.user_id
    //   config.headers.cipher = obj.cipher
    // }
    // 在发送请求之前做些什么

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
// 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    const store = userStore();
    if (response.data.code === 401 ) { 
      store.user_name = '';
      store.user_token = '';
      store.role = '';
        ElMessage({
          message: response.data.text,
          type: 'warning',
          duration: 1000,
          grouping: true,
        });
      setTimeout(() => { 
        window.location.href='/'
      },3000)

    }
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // console.log('响应拦截器************',error)
    // 对响应错误做点什么
    return Promise.reject(error);
  });



  switch (method) {
    case METHOD.GET:
      return axios.get(url, {params, ...config})
    case METHOD.POST:
      return axios.post(url, params, config)
    default:
      return axios.get(url, {params, ...config})
  }
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
// function setAuthorization(auth:any, authType = AUTH_TYPE.BEARER) {
//   switch (authType) {
//     case AUTH_TYPE.BEARER:
//       Cookie.set(xsrfHeaderName,  auth.token, {expires: auth.expireAt})
//       break
//     case AUTH_TYPE.BASIC:
//     case AUTH_TYPE.AUTH1:
//     case AUTH_TYPE.AUTH2:
//     default:
//       break
//   }
// }

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
// function removeAuthorization(authType = AUTH_TYPE.BEARER) {
//   switch (authType) {
//     case AUTH_TYPE.BEARER:
//       Cookie.remove(xsrfHeaderName)
//       break
//     case AUTH_TYPE.BASIC:
//     case AUTH_TYPE.AUTH1:
//     case AUTH_TYPE.AUTH2:
//     default:
//       break
//   }
// }

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
// function checkAuthorization(authType = AUTH_TYPE.BEARER) {
//   switch (authType) {
//     case AUTH_TYPE.BEARER:
//       if (Cookie.get(xsrfHeaderName)) {
//         return true
//       }
//       break
//     case AUTH_TYPE.BASIC:
//     case AUTH_TYPE.AUTH1:
//     case AUTH_TYPE.AUTH2:
//     default:
//       break
//   }
//   return false
// }

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors:any, options:any) {
  const {request, response} = interceptors
  // 加载请求拦截器
  request.forEach((item: { onFulfilled: any; onRejected: any }) => {
    let {onFulfilled, onRejected} = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {

      onFulfilled = (config: any) => config
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = (error: any) => Promise.reject(error)
    }
    axios.interceptors.request.use(function (config:any) {
      // 在发送请求之前做些什么
      config.headers['user_token'] = 123
      return config;
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });
    // axios.interceptors.request.use(
    //   config => onFulfilled(config, options),
    //   error => onRejected(error, options)
    // )
  })
  // 加载响应拦截器
  response.forEach((item: { onFulfilled: any; onRejected: any }) => {
    let {onFulfilled, onRejected} = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = (response: any) => response
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = (error: any) => Promise.reject(error)
    }
    axios.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    )
  })
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url: string) {
  const params:any = {}
  if (!url || url === '' || typeof url !== 'string') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
  }
  return params
}

export {
  METHOD,
  AUTH_TYPE,
  request,

  loadInterceptors,
  parseUrlParams
}