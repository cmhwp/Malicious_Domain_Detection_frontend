<template>
  <div class="detection-container">
    <h1>域名检测</h1>
    <div class="detection-form">
      <a-form :model="formState" layout="vertical">
        <a-form-item
          label="域名"
          name="domain"
          :rules="[{ required: true, message: '请输入域名' }]"
        >
          <a-input v-model:value="formState.domain" placeholder="请输入需要检测的域名" />
        </a-form-item>

        <a-form-item label="模型类型" name="modelType">
          <a-radio-group v-model:value="formState.modelType">
            <a-radio :value="modelType.cnn">CNN</a-radio>
            <a-radio :value="modelType.cnn_bilstm">CNN-BiLSTM</a-radio>
            <a-radio :value="modelType.lstm">LSTM</a-radio>
            <a-radio :value="modelType.transformer">Transformer</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="submitForm" :loading="loading">检测</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
          <a-button style="margin-left: 10px" @click="useAllModels">使用所有模型</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div v-if="result" class="detection-result">
      <a-result
        :status="result.is_malicious ? 'error' : 'success'"
        :title="result.is_malicious ? '恶意域名' : '正常域名'"
        :sub-title="`检测域名: ${result.domain} | 置信度: ${(result.confidence * 100).toFixed(2)}% | 使用模型: ${result.model_used}`"
      >
        <template #extra>
          <a-button type="primary" @click="resetForm">新检测</a-button>
        </template>

        <div class="detail-info">
          <a-descriptions title="检测详情" bordered>
            <a-descriptions-item label="恶意类型" :span="3" v-if="result.is_malicious">
              {{ result.malicious_type }} (置信度: {{ (result.type_confidence * 100).toFixed(2) }}%)
            </a-descriptions-item>
            <a-descriptions-item label="执行时间" :span="3"
              >{{ result.execution_time.toFixed(2) }}ms</a-descriptions-item
            >

            <a-descriptions-item
              label="异常模式"
              :span="3"
              v-if="result.is_malicious && result.analysis.unusual_patterns.length"
            >
              <a-tag
                v-for="(pattern, index) in result.analysis.unusual_patterns"
                :key="index"
                color="red"
                >{{ pattern }}</a-tag
              >
            </a-descriptions-item>

            <a-descriptions-item
              label="风险因素"
              :span="3"
              v-if="result.is_malicious && result.analysis.risk_factors.length"
            >
              <a-tag
                v-for="(factor, index) in result.analysis.risk_factors"
                :key="index"
                color="orange"
                >{{ factor }}</a-tag
              >
            </a-descriptions-item>
          </a-descriptions>

          <a-divider orientation="left">特征详情</a-divider>

          <a-table
            :dataSource="featureData"
            :columns="featureColumns"
            :pagination="false"
            size="small"
          />
        </div>
      </a-result>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { modelType } from '@/types'
import { predict, allModelPredict } from '@/api'
import type { predictResponse, allModelRequestPredictResponse } from '@/types'

const formState = reactive({
  domain: '',
  modelType: modelType.cnn,
})

const loading = ref(false)
const result = ref<predictResponse | allModelRequestPredictResponse | null>(null)
const featureData = ref<any[]>([])
const featureColumns = [
  { title: '特征名称', dataIndex: 'name', key: 'name' },
  { title: '数值', dataIndex: 'value', key: 'value' },
  { title: '解释', dataIndex: 'explanation', key: 'explanation' },
]

const submitForm = async () => {
  if (!formState.domain) return

  loading.value = true
  try {
    const res = await predict({
      domain: formState.domain,
      model: formState.modelType,
    })
    result.value = res
    processFeatures(res)
  } catch (error) {
    console.error('检测失败:', error)
  } finally {
    loading.value = false
  }
}

const useAllModels = async () => {
  if (!formState.domain) return

  loading.value = true
  try {
    const res = await allModelPredict({
      domain: formState.domain,
    })
    result.value = res
    processFeatures(res)
  } catch (error) {
    console.error('检测失败:', error)
  } finally {
    loading.value = false
  }
}

const processFeatures = (data: predictResponse | allModelRequestPredictResponse) => {
  featureData.value = []

  if (!data.features) return

  // 将特征对象转换为表格数据
  Object.entries(data.features).forEach(([key, value]) => {
    const explanation =
      data.analysis?.feature_explanations?.[
        key as keyof typeof data.analysis.feature_explanations
      ] || '-'
    featureData.value.push({
      key,
      name: key,
      value,
      explanation,
    })
  })
}

const resetForm = () => {
  formState.domain = ''
  formState.modelType = modelType.cnn
  result.value = null
  featureData.value = []
}
</script>

<style scoped>
.detection-container {
  max-width: 1000px;
  margin: 0 auto;
}

.detection-form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  margin-bottom: 24px;
}

.detection-result {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.detail-info {
  margin-top: 24px;
  text-align: left;
}
</style>
