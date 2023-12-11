<template>
    <!-- <h5 class="mb-2">Default colors</h5> -->
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      router
    >
    <el-menu-item index="/admin">
      <el-icon><HomeFilled /></el-icon>
      <span>首页</span>
    </el-menu-item>
      <el-sub-menu index="1">
        <template #title>
          <el-icon><UserFilled /></el-icon>
          <span>学生管理</span>
        </template>
          <el-menu-item index="/admin/student-list">学生列表</el-menu-item>
          <el-menu-item index="/admin/import-export">导入导出</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><PieChart /></el-icon>
          <span>水电管理</span>
        </template>
          <el-menu-item index="/admin/wae-usage">水电用量</el-menu-item>
          <el-menu-item index="/admin/wae-bill">水电账单</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3" v-if="showSysSetting">
        <template #title>
          <el-icon><setting /></el-icon>
          <span>系统管理</span>
        </template>
          <el-menu-item index="/admin/building-list">楼栋管理</el-menu-item>
          <el-menu-item index="/admin/user-list">员工管理</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="99">
        <template #title>
          <el-icon><User /></el-icon>
          <span>个人设置</span>
        </template>
          <el-menu-item index="/admin/setting/change-pwd">修改密码</el-menu-item>
      </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from '@/http'
// const handleOpen = (key: string, keyPath: string[]) => {
// console.log(key, keyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
// console.log(key, keyPath)
// }

const showSysSetting = ref<boolean>(false);

axios.get('/user/current').then((resp) => {
  const data = resp.data.data;
  if (resp.data.code != "200") {
    return;
  }

  if (data.roleId == 1) {
    showSysSetting.value = true;
  }

})

</script>
