<template>
  <div>
    <Admin/>
  </div>
</template>

<script>
import Admin from './components/Admin.vue'

// axios.defaults.baseURL = "http://localhost:8088"  // 修改默认配置 请求根路径
// Vue.prototype.$http = axios  // Axios绑定在Vue上面

export default {
  name: 'App',
  // created: function () {
  //   axios.get('https://my-json-server.typicode.com/typicode/demo/db').then(response => {
  //     console.log(response.data)
  //   })
  // },
  components: {
    Admin
  }
}
</script>

<style>
.main {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
}
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
    background-color: #e9eef3; color: #333; text-align: center;
  }

  /* .el-menu {
    background-color: #d3dce6;
  } */
</style>
