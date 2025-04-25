<template>
  <div class="results-container">
    <h1>模型训练结果</h1>

    <div class="results-selector">
      <a-spin :spinning="loadingAvailableResults">
        <a-card title="选择训练结果" style="width: 100%; margin-bottom: 24px">
          <a-select
            v-model:value="selectedResultId"
            placeholder="请选择训练结果"
            style="width: 100%"
            @change="handleResultChange"
            :loading="loadingAvailableResults"
          >
            <a-select-option
              v-for="result in availableResults"
              :key="result.result_id"
              :value="result.result_id"
            >
              {{ result.date_created }} (包含模型: {{ result.models_included.join(', ') }})
            </a-select-option>
          </a-select>
        </a-card>
      </a-spin>
    </div>

    <a-spin :spinning="loadingResult">
      <div v-if="trainingResult" class="results-content">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-card title="模型比较图表" style="margin-bottom: 24px">
              <div class="chart-container">
                <img :src="trainingResult.charts.comparative_metrics" class="chart-image" />
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="24">
            <a-card title="模型性能指标对比">
              <a-table
                :dataSource="modelComparisonData"
                :columns="columns"
                :pagination="false"
                bordered
                size="middle"
              >
                <template #headerCell="{ column }">
                  <span v-if="column.dataIndex !== 'model_name'">
                    {{ column.title }}
                    <a-tooltip :title="getMetricDescription(column.dataIndex)">
                      <question-circle-outlined />
                    </a-tooltip>
                  </span>
                  <span v-else>{{ column.title }}</span>
                </template>

                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'model_name'">
                    <strong>{{ record.model_name }}</strong>
                  </template>
                  <template
                    v-else-if="['accuracy', 'precision', 'recall', 'f1'].includes(column.dataIndex)"
                  >
                    <span :style="{ color: getColorByValue(record[column.dataIndex]) }">
                      {{ (record[column.dataIndex] * 100).toFixed(2) }}%
                    </span>
                  </template>
                  <template v-else-if="column.dataIndex === 'inference_time'">
                    {{ record.inference_time.toFixed(2) }}ms
                  </template>
                </template>
              </a-table>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <a-empty
        v-else-if="!loadingResult && !trainingResult"
        description="请选择一个训练结果以查看详情"
      />
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { getAvailableResults, getTrainingResult } from '@/api'
import type { availableResultsResponse, getTrainingResultResponse } from '@/types'

const availableResults = ref<availableResultsResponse['available_results']>([])
const selectedResultId = ref<string>('')
const trainingResult = ref<getTrainingResultResponse | null>(null)
const loadingAvailableResults = ref(false)
const loadingResult = ref(false)

const columns = [
  { title: '模型名称', dataIndex: 'model_name', key: 'model_name', fixed: 'left' },
  {
    title: '准确率',
    dataIndex: 'accuracy',
    key: 'accuracy',
    sorter: (a: any, b: any) => a.accuracy - b.accuracy,
  },
  {
    title: '精确率',
    dataIndex: 'precision',
    key: 'precision',
    sorter: (a: any, b: any) => a.precision - b.precision,
  },
  {
    title: '召回率',
    dataIndex: 'recall',
    key: 'recall',
    sorter: (a: any, b: any) => a.recall - b.recall,
  },
  { title: 'F1得分', dataIndex: 'f1', key: 'f1', sorter: (a: any, b: any) => a.f1 - b.f1 },
  {
    title: '推理时间',
    dataIndex: 'inference_time',
    key: 'inference_time',
    sorter: (a: any, b: any) => a.inference_time - b.inference_time,
  },
]

const modelComparisonData = computed(() => {
  if (!trainingResult.value) return []

  return Object.entries(trainingResult.value.results).map(([model, metrics]) => ({
    key: model,
    model_name: model,
    ...metrics,
  }))
})

onMounted(async () => {
  await fetchAvailableResults()
})

const fetchAvailableResults = async () => {
  loadingAvailableResults.value = true
  try {
    const response = await getAvailableResults()
    availableResults.value = response.available_results

    // 如果有结果，自动选择第一个
    if (availableResults.value.length > 0) {
      selectedResultId.value = availableResults.value[0].result_id
      await handleResultChange(selectedResultId.value)
    }
  } catch (error) {
    console.error('Failed to fetch available results:', error)
  } finally {
    loadingAvailableResults.value = false
  }
}

const handleResultChange = async (resultId: string) => {
  if (!resultId) {
    trainingResult.value = null
    return
  }

  loadingResult.value = true
  try {
    const response = await getTrainingResult({ result_id: resultId })
    trainingResult.value = response
  } catch (error) {
    console.error('Failed to fetch training result:', error)
  } finally {
    loadingResult.value = false
  }
}

const getMetricDescription = (metric: string) => {
  const descriptions: Record<string, string> = {
    accuracy: '准确率 - 正确预测的样本数占总样本数的比例',
    precision: '精确率 - 在被预测为正类的样本中，真正的正类所占的比例',
    recall: '召回率 - 在真正的正类样本中，被成功预测为正类的比例',
    f1: 'F1得分 - 精确率和召回率的调和平均数',
    inference_time: '推理时间 - 模型进行一次预测所需的平均时间',
  }

  return descriptions[metric] || ''
}

const getColorByValue = (value: number) => {
  if (value >= 0.9) return '#52c41a' // 绿色 - 优秀
  if (value >= 0.7) return '#1890ff' // 蓝色 - 良好
  if (value >= 0.5) return '#faad14' // 黄色 - 一般
  return '#f5222d' // 红色 - 较差
}
</script>

<style scoped>
.results-container {
  max-width: 1200px;
  margin: 0 auto;
}

.results-content {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
}

.chart-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.chart-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>
