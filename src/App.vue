<template>
  <div>
    <Admin/>
  </div>
</template>

<script>
import Admin from './components/Admin.vue'

export default {
  name: 'App',
  components: {
    Admin
  }
}
</script>

<style>

.el-container {
    height: 100%;
  }

  .el-header,
  .el-footer
  {
    background-color: #b3c0d1; color: #333; text-align: center; line-height: 60px;
  }
/* 
  .el-aside {
    background-color: #d3dce6; color: #333; text-align: center; line-height: 200px;
  } */

  .el-main {
    background-color: #e9eef3; color: #333; text-align: center; line-height: 160px;
  }

  /* .el-menu {
    background-color: #d3dce6;
  } */
</style>
