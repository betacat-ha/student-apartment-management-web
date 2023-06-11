<template>
    <!-- <h5 class="mb-2">Default colors</h5> -->
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      router
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><UserFilled /></el-icon>
          <span>学生管理</span>
        </template>
          <el-menu-item index="admin/student-list">学生列表</el-menu-item>
          <el-menu-item index="1-2">导入导出</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><location /></el-icon>
          <span>水电管理</span>
        </template>
          <el-menu-item index="2-1">水电用量</el-menu-item>
          <el-menu-item index="2-2">水电账单</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="3" disabled>
        <el-icon><document /></el-icon>
        <span>Navigator Three</span>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <span>Navigator Four</span>
      </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import {
Document,
Menu as IconMenu,
Location,
Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
console.log(key, keyPath)
}
</script>
