<template>
  <el-row style="margin-bottom: 10px">
    <el-button type="primary" :icon="Edit">编辑模式</el-button>
    <el-button type="primary" :icon="Share" />
    <el-button type="primary" :icon="Delete" />
  </el-row>
  <el-table
    :data="tableData"
    :column="tableColumns"
    border
    stripe
    height="100%"
  >
    <el-table-column
      prop="name"
      label="姓名"
      width="120"
      align="center"
      fixed="left"
      show-overflow-tooltip
    />
    <el-table-column
      prop="id"
      label="学号"
      width="150"
      align="center"
      show-overflow-tooltip
    />
    <el-table-column
      prop="className"
      label="班级"
      width="120"
      align="center"
      show-overflow-tooltip
    />
    <el-table-column
      prop="age"
      label="年龄"
      width="60"
      align="center"
      show-overflow-tooltip
    />
    <el-table-column
      prop="sex"
      label="性别"
      width="60"
      align="center"
      show-overflow-tooltip
    />
    <el-table-column
      prop="phone"
      label="电话"
      width="120"
      align="center"
      show-overflow-tooltip
    />
    <el-table-column
      prop="email"
      label="邮箱"
      align="center"
      show-overflow-tooltip
    />
  </el-table>
  <el-pagination background layout="prev, pager, next" :total="1000" />
</template>
<script lang="ts" setup>
import axios from "axios";
import { Delete, Edit, Search, Share, Upload } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { Alignment } from "element-plus/es/components/table-v2/src/constants";

axios.get("http://localhost:8088/student").then((resp) => {
  if (resp.data.code != "200") {
    console.log("获取数据失败：" + resp.data.msg);
  }
  tableData.value = resp.data.data;
});

// const fetchData = async () => {
//   const resp = await $axios.get("/student");
//     if (resp.data.code != "200") {
//     console.log("获取数据失败：" + resp.data.msg);
//   }
//   tableData.value = resp.data.data;
// };

// onMounted(() => {
//   fetchData();
// });

const tableData = ref<any[]>([]); // 传递给组件的 data 参数

const tableColumns = [
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
];
</script>