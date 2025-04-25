import request from '@/utils/request'
import type {
  predictRequest,
  predictResponse,
  predictMultipleRequest,
  predictMultipleResponse,
  allModelRequestPredictParams,
  allModelRequestPredictResponse,
  availableModelsResponse,
  extractFeaturesRequestParams,
  extractFeaturesResponse,
  availableResultsResponse,
  getTrainingResultRequestParams,
  getTrainingResultResponse,
} from '@/types'

//预测单个域名是否为恶意域名
export const predict = (data: predictRequest) => {
  return request.post<predictResponse>('/predict', data)
}

//预测多个域名是否为恶意域名
export const predictMultiple = (data: predictMultipleRequest) => {
  return request.post<predictMultipleResponse>('/predict/batch', data)
}

//使用所有可用模型的集成进行预测
export const allModelPredict = (data: allModelRequestPredictParams) => {
  return request.post<allModelRequestPredictResponse>('/predict/ensemble', data)
}

//获取可用模型的信息。(/models)
export const getAvailableModels = () => {
  return request.get<availableModelsResponse>('/models')
}

//提取域名的特征。（/features/{domain}）
export const extractFeatures = (params: extractFeaturesRequestParams) => {
  return request.get<extractFeaturesResponse>(`/features/${params.domain}`)
}

//获取可用的训练结果列表。（/training-results）
export const getAvailableResults = () => {
  return request.get<availableResultsResponse>('/training-results')
}

//获取指定的训练结果。（/training-results/{result_id}）
export const getTrainingResult = (params: getTrainingResultRequestParams) => {
  return request.get<getTrainingResultResponse>(`/training-results/${params.result_id}`)
}
