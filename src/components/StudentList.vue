<template>
  <el-table :data="tableData" :column="tableColumns" border stripe height="100%">
    <el-table-column prop="name" label="姓名" width="120" align="center" fixed="left" show-overflow-tooltip />
    <el-table-column prop="id" label="学号" width="150" align="center" show-overflow-tooltip />
    <el-table-column prop="className" label="班级" width="120" align="center" show-overflow-tooltip />
    <el-table-column prop="age" label="年龄" width="60" align="center" show-overflow-tooltip />
    <el-table-column prop="sex" label="性别" width="60" align="center" show-overflow-tooltip />
    <el-table-column prop="phone" label="电话" width="120" align="center" show-overflow-tooltip />
    <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip />
  </el-table>
</template>
<script lang="ts">
import axios from "axios";

import { defineComponent } from "vue";
import { Alignment } from "element-plus/es/components/table-v2/src/constants";

function getStudents() {
  axios.get("http://localhost:8088/student").then((resp) => {
    if (resp.data.code != "200") {
      console.log("获取数据失败：" + resp.data.msg);
    }
    this.tableData = resp.data.data;
  });
}

export default defineComponent({
  created: getStudents,
  components: {
  },
  data() {
    return {
      tableData: [], // 传递给组件的 data 参数
      tableColumns: [
        {
          lable: "id",
          dataKey: "id",
          align: "center",
          title: "学号",
        },
        {
          lable: "className",
          dataKey: "className",
          align: "center",
          title: "班级",
        },
        {
          lable: "name",
          dataKey: "name",
          align: "center",
          title: "姓名",
        },
        {
          dataKey: "age",
          align: "center",
          title: "年龄",
        },
        {
          dataKey: "sex",
          align: "center",
          title: "性别",
        },
        {
          dataKey: "phone",
          align: "center",
          title: "电话",
        },
        {
          dataKey: "email",
          align: Alignment.CENTER,
          title: "邮箱",
        },
      ], // 传递给组件的 columns 参数
    };
  },
});
</script>