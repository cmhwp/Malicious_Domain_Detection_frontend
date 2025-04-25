<template>
  <div class="about-container">
    <h1>关于恶意域名检测系统</h1>

    <a-card class="about-card">
      <h2>项目简介</h2>
      <p>
        恶意域名检测系统是一个基于深度学习的网络安全工具，用于识别潜在的恶意域名。系统利用多种先进的神经网络模型，对域名进行特征提取和分类，帮助用户快速识别可能的安全威胁。
      </p>
    </a-card>

    <a-card class="about-card">
      <h2>核心功能</h2>
      <a-list>
        <a-list-item>单一域名检测：输入单个域名进行实时检测</a-list-item>
        <a-list-item>批量域名检测：一次性检测多个域名</a-list-item>
        <a-list-item>多模型支持：CNN, CNN-BiLSTM, LSTM, Transformer</a-list-item>
        <a-list-item>详细分析报告：包含风险因素、异常模式及特征解释</a-list-item>
      </a-list>
    </a-card>

    <a-card class="about-card">
      <h2>技术实现</h2>
      <p>
        本系统前端采用Vue 3 + TypeScript开发，结合Ant Design
        Vue组件库构建用户界面。后端采用深度学习技术实现多种检测模型，包括:
      </p>
      <a-descriptions bordered>
        <a-descriptions-item label="CNN">卷积神经网络，适合提取域名字符级特征</a-descriptions-item>
        <a-descriptions-item label="LSTM">长短期记忆网络，分析域名字符序列模式</a-descriptions-item>
        <a-descriptions-item label="CNN-BiLSTM">结合CNN和双向LSTM的混合模型</a-descriptions-item>
        <a-descriptions-item label="Transformer"
          >基于注意力机制的模型，捕捉全局依赖关系</a-descriptions-item
        >
      </a-descriptions>
    </a-card>

    <a-card class="about-card">
      <h2>使用说明</h2>
      <p>
        在"域名检测"页面，您可以输入单个域名并选择检测模型进行分析。系统会返回该域名是否为恶意域名的判断，置信度，以及详细的分析报告。
      </p>
      <p>
        在"批量域名检测"页面，您可以一次性输入多个域名（每行一个），系统将批量处理并返回统计结果。
      </p>
    </a-card>

    <a-card class="about-card">
      <h2>联系我们</h2>
      <p>如果您在使用过程中遇到任何问题，或有改进建议，请联系系统管理员。</p>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
// Component logic can be added here
</script>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.about-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #1890ff;
  margin-bottom: 16px;
}
</style>
