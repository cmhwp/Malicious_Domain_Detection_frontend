//预测
export enum modelType {
  cnn = 'cnn',
  cnn_bilstm = 'cnn_bilstm',
  lstm = 'lstm',
  transformer = 'transformer',
}

export interface predictRequest {
  domain: string
  model: modelType
}

export interface predictResponse {
  domain: string
  is_malicious: boolean
  confidence: number
  model_used: string
  features: {
    additionalProp1: number
    additionalProp2: number
    additionalProp3: number
  }
  malicious_type: string
  type_confidence: number
  analysis: {
    unusual_patterns: string[]
    risk_factors: string[]
    feature_explanations: {
      additionalProp1: string
      additionalProp2: string
      additionalProp3: string
    }
  }
  execution_time: number
}
//预测多个域名是否为恶意域名
export interface predictMultipleRequest {
  domains: string[]
  model: modelType
}
export interface predictMultipleResponse {
  results: {
    [key: string]: predictResponse
  }
  summary: {
    total_domains: number
    malicious_count: number
    benign_count: number
    malicious_percentage: number
    execution_time: number
  }
}
//使用所有可用模型的集成进行预测
export interface allModelRequestPredictParams {
  domain: string
}
export interface allModelRequestPredictResponse {
  domain: string
  is_malicious: boolean
  confidence: number
  model_used: string
  features: {
    length: number
    num_digits: number
    num_letters: number
    num_special_chars: number
    entropy: number
    digit_ratio: number
    vowel_count: number
    vowel_ratio: number
    unique_char_ratio: number
    consecutive_consonants: number
    consecutive_digits: number
  }
  malicious_type: string
  type_confidence: number
  analysis: {
    unusual_patterns: string[]
    risk_factors: string[]
    feature_explanations: {
      length: string
      entropy: string
      digit_ratio: string
      vowel_ratio: string
      unique_char_ratio: string
    }
  }
  execution_time: number
}

//获取可用模型的信息
export interface availableModelsResponse {
  available_models: {
    name: string
    description: string
  }[]
}
//提取域名的特征
export interface extractFeaturesRequestParams {
  domain: string
}
export interface extractFeaturesResponse {
  length: number
  num_digits: number
  num_letters: number
  num_special_chars: number
  entropy: number
  digit_ratio: number
  vowel_count: number
  vowel_ratio: number
  unique_char_ratio: number
  consecutive_consonants: number
  consecutive_digits: number
}
//获取可用的训练结果列表
export interface availableResultsResponse {
  available_results: {
    result_id: string
    date_created: string
    models_included: string[]
  }[]
}
//获取指定的训练结果
export interface getTrainingResultRequestParams {
  result_id: string
}
export interface modelResult {
  accuracy: number
  precision: number
  recall: number
  f1: number
  inference_time: number
}
export interface getTrainingResultResponse {
  results: {
    [key: string]: modelResult
  }
  charts: {
    comparative_metrics: string // base64 encoded image
    [key: string]: string // allow for other chart types
  }
}
