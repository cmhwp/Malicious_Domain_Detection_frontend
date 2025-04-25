<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo" class="logo-img" />
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="home">
          <router-link to="/">首页</router-link>
        </a-menu-item>
        <a-menu-item key="detection">
          <router-link to="/detection">域名检测</router-link>
        </a-menu-item>
        <a-menu-item key="batch-detection">
          <router-link to="/batch-detection">批量检测</router-link>
        </a-menu-item>
        <a-menu-item key="results">
          <router-link to="/results">训练结果</router-link>
        </a-menu-item>
        <a-menu-item key="about">
          <router-link to="/about">关于我们</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 50px">
      <div class="site-layout-content">
        <slot></slot>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center"> 恶意域名检测系统 ©2025 </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const selectedKeys = computed<string[]>(() => {
  const path = route.path
  if (path === '/') return ['home']
  if (path === '/detection') return ['detection']
  if (path === '/batch-detection') return ['batch-detection']
  if (path === '/results') return ['results']
  if (path === '/about') return ['about']
  return []
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header {
  width: 100%;
}

.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
  flex: 1;
  width: 100%;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.layout .logo {
  float: left;
  margin-right: 30px;
}

.ant-row-rtl .layout .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}

a-layout-content {
  flex: 1;
  width: 100%;
}

.ant-menu-item a {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
}

.ant-menu-item-selected a,
.ant-menu-item a:hover {
  color: #fff;
}
</style>
