<template>
    <div class="common-layout">
      <el-container>
        <el-header>学生公寓管理系统</el-header>
        <el-container>
          <el-aside width="200px" style="border:1px solid #eee"><SideBar/></el-aside>
          <el-container>
            <el-main><router-view/></el-main>
            <!-- <el-footer><a href="https://beian.miit.gov.cn/" style="">粤ICP备20037475号</a></el-footer> -->
          </el-container>
        </el-container>
      </el-container>
    </div>
</template>

<script lang="ts" setup>
import SideBar from '../components/admin/SideBar.vue'
import Table from '../components/admin/Table.vue'
import StudentList from './components/StudentList.vue'


</script>

<style>
.common-layout {
  height: 100vh;
}
.el-container {
    height: 100%;
  }

  .el-header,
  .el-footer
  {
    background-color: #b3c0d1; color: #333; text-align: center; line-height: 60px;
  }

  /* .el-aside {
    background-color: #d3dce6; color: #333; text-align: center; line-height: 200px;
  } */

  .el-main {
    background-color: #e9eef3; color: #333; text-align: center;
  }

  /* .el-menu {
    background-color: #d3dce6;
  } */
</style>
