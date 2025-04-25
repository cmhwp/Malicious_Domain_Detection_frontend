<template>
  <div class="batch-detection-container">
    <h1>批量域名检测</h1>
    <div class="detection-form">
      <a-form :model="formState" layout="vertical">
        <a-form-item
          label="域名列表"
          name="domains"
          :rules="[{ required: true, message: '请输入域名列表' }]"
        >
          <a-textarea
            v-model:value="formState.domains"
            placeholder="请输入多个域名，每行一个"
            :rows="8"
          />
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
          <a-button type="primary" @click="submitForm" :loading="loading">批量检测</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div v-if="result" class="detection-result">
      <a-alert
        :message="`检测结果: 总计 ${result.summary.total_domains} 个域名`"
        :description="`恶意域名: ${result.summary.malicious_count} (${result.summary.malicious_percentage.toFixed(
          2,
        )}%), 正常域名: ${result.summary.benign_count}`"
        type="info"
        show-icon
        style="margin-bottom: 20px"
      />

      <a-tabs default-active-key="table">
        <a-tab-pane key="table" tab="表格视图">
          <a-table
            :dataSource="tableData"
            :columns="columns"
            :pagination="{ pageSize: 10 }"
            :row-class-name="(record: any) => (record.is_malicious ? 'dangerous-row' : '')"
          />
        </a-tab-pane>
        <a-tab-pane key="stats" tab="统计视图">
          <div class="stats-container">
            <a-card title="域名检测结果比例" style="width: 100%; margin-bottom: 20px">
              <a-progress
                :percent="result.summary.malicious_percentage"
                :format="(percent: number) => `${percent.toFixed(2)}% 恶意域名`"
                status="exception"
                stroke-color="red"
              />
              <a-progress
                :percent="100 - result.summary.malicious_percentage"
                :format="(percent: number) => `${percent.toFixed(2)}% 正常域名`"
                status="normal"
                stroke-color="green"
              />
            </a-card>
            <a-card title="执行情况" style="width: 100%">
              <p>总执行时间: {{ result.summary.execution_time.toFixed(2) }}ms</p>
              <p>
                平均每个域名执行时间:
                {{ (result.summary.execution_time / result.summary.total_domains).toFixed(2) }}ms
              </p>
            </a-card>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, h } from 'vue'
import { modelType } from '@/types'
import { predictMultiple } from '@/api'
import type { predictMultipleResponse } from '@/types'

const formState = reactive({
  domains: '',
  modelType: modelType.cnn,
})

const loading = ref(false)
const result = ref<predictMultipleResponse | null>(null)

const columns = [
  {
    title: '域名',
    dataIndex: 'domainName',
    key: 'domainName',
  },
  {
    title: '检测结果',
    dataIndex: 'is_malicious',
    key: 'is_malicious',
    customRender: ({ text }: { text: boolean }) => {
      return {
        props: {
          style: {
            color: text ? 'red' : 'green',
          },
        },
        children: text ? '恶意域名' : '正常域名',
      }
    },
  },
  {
    title: '置信度',
    dataIndex: 'confidence',
    key: 'confidence',
    customRender: ({ text }: { text: number }) => `${(text * 100).toFixed(2)}%`,
  },
  {
    title: '恶意类型',
    dataIndex: 'malicious_type',
    key: 'malicious_type',
    customRender: ({ text, record }: { text: string; record: any }) => {
      return record.is_malicious ? text : '/'
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: ({ record }: { record: any }) => {
      return h(
        'a-button',
        {
          type: 'link',
          onClick: () => showDetails(record),
        },
        '详情',
      )
    },
  },
]

const tableData = computed(() => {
  if (!result.value) return []
  return Object.entries(result.value.results).map(([domain, data]) => ({
    key: domain,
    domainName: domain,
    ...data,
  }))
})

const submitForm = async () => {
  if (!formState.domains) return

  // 拆分多行文本为域名数组
  const domains = formState.domains
    .split('\n')
    .map((d) => d.trim())
    .filter((d) => d)

  if (domains.length === 0) return

  loading.value = true
  try {
    const res = await predictMultiple({
      domains,
      model: formState.modelType,
    })
    result.value = res
  } catch (error) {
    console.error('批量检测失败:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formState.domains = ''
  formState.modelType = modelType.cnn_bilstm
  result.value = null
}

const showDetails = (record: any) => {
  // 这里可以实现查看详情的逻辑，比如打开一个模态框
  console.log('查看详情:', record)
}
</script>

<style scoped>
.batch-detection-container {
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

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

:deep(.dangerous-row) {
  background-color: #fff2f0;
}
</style>
