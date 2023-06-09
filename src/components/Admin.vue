<template>
    <div class="common-layout">
      <el-container>
        <el-header>学生公寓管理系统</el-header>
        <el-container>
          <el-aside width="200px"><SideBar/></el-aside>
          <el-container>
            <el-main><StudentList/></el-main>
            <!-- <el-footer><a href="https://beian.miit.gov.cn/" style="">粤ICP备20037475号</a></el-footer> -->
          </el-container>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import SideBar from './SideBar.vue'
import Table from './Table.vue'
import StudentList from './StudentList.vue'

export default {
    components: {
        SideBar,
        Table,
        StudentList
    }
}

</script>

<style>
.common-layout {
  height: 100vh;
}
</style>
