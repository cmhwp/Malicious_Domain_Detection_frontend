import axios from 'axios'
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios'
import router from '@/router'
import { message } from 'ant-design-vue'

const baseURL = 'http://127.0.0.1:8000/api/v1'

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 3000000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 简化的请求拦截器，不使用token
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 如果是文件下载响应，直接返回
    if (
      response.headers['content-type']?.includes('application/octet-stream') ||
      response.headers['content-type']?.includes('application/pdf') ||
      response.headers['content-type']?.includes('image/')
    ) {
      return response
    }

    // 处理业务逻辑成功
    if (res.code === 0 || res.success) {
      return res
    }
    return res
  },
  (error) => {
    // 处理请求错误
    if (error.response) {
      const { status } = error.response

      // 处理401未授权错误
      if (status === 401) {
        message.error('未授权，请检查接口权限')
        router.push('/auth/login')
      }
      // 处理403禁止访问错误
      else if (status === 403) {
        message.error('无权访问')
        router.push('/403')
      }
      // 处理404不存在错误
      else if (status === 404) {
        message.error('请求的资源不存在')
      }
      // 处理500服务器错误
      else if (status === 500) {
        message.error('服务器错误，请稍后再试')
      }
      // 其他错误
      else {
        message.error(error.response.data?.error || '请求失败')
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      message.error('网络错误，无法连接到服务器')
    } else {
      // 请求配置错误
      message.error('请求配置错误')
    }

    return Promise.reject(error)
  },
)

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config)
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config)
  },
  // 暴露axios实例，方便扩展
  defaults: instance.defaults,
}

export default request
