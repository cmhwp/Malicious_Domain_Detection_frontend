<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// 打字机效果的文本
const welcomeText = '欢迎使用恶意域名检测系统'
const displayText = ref('')
const isTyping = ref(true)

// 打字机效果
onMounted(() => {
  let index = 0
  const typingInterval = setInterval(() => {
    if (index < welcomeText.length) {
      displayText.value += welcomeText.charAt(index)
      index++
    } else {
      isTyping.value = false
      clearInterval(typingInterval)
    }
  }, 150)
})

const router = useRouter()
</script>

<template>
  <div class="home">
    <h1 class="typing" :class="{ 'typing-cursor': isTyping }">{{ displayText }}</h1>
    <p>本平台使用先进的机器学习模型帮助识别潜在的恶意域名，为网络安全提供保障。</p>

    <div class="features">
      <div class="feature-card">
        <h3>域名检测</h3>
        <p>使用我们先进的检测算法检查域名是否恶意。</p>
        <a-button type="primary" @click="router.push('/detection')">立即尝试</a-button>
      </div>

      <div class="feature-card">
        <h3>批量分析</h3>
        <p>同时分析多个域名，高效检测潜在威胁。</p>
        <a-button @click="router.push('/batch-detection')">了解更多</a-button>
      </div>

      <div class="feature-card">
        <h3>训练结果</h3>
        <p>查看我们机器学习模型的详细性能分析。</p>
        <a-button @click="router.push('/results')">查看结果</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.typing-cursor::after {
  content: '|';
  display: inline-block;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.features {
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.feature-card {
  flex: 1;
  min-width: 250px;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.feature-card h3 {
  margin-bottom: 1rem;
}

.feature-card p {
  margin-bottom: 1.5rem;
}
</style>
