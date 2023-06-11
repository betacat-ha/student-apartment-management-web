<template>
  <el-row>
    <el-form :inline="true" :model="searchStu">
      <el-form-item label="查询内容">
        <div style="display: inline-flex">
          <el-select v-model="searchStu.type" style="width: 100px">
            <el-option label="不限" value="0"></el-option>
            <el-option label="学号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="班级" value="3"></el-option>
          </el-select>
          <el-input
            v-model="searchStu.content"
            placeholder="请输入查询内容"
            style="width: 150px"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="searchStu.gender" style="width: 80px">
          <el-option label="不限" value="0"></el-option>
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <div style="display: flex">
    <el-button type="primary" :icon="Edit">批量编辑</el-button>
    <el-button type="primary" :icon="Delete">批量删除</el-button>
    <el-button type="primary" :icon="Plus" @click="showDialog = true"
      >添加学生</el-button
    >
  </div>

  <br />

  <!--添加数据对话框表单-->
  <el-dialog ref="form" title="编辑学生" v-model="showDialog" width="40%">
    <el-form ref="form" :model="stuData" label-width="60px">
      <el-form-item label="学号">
        <el-input v-model="stuData.id"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="stuData.name"></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="stuData.className"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="stuData.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="stuData.email"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="stuData.gender"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="证件照">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers="token"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="stuData.image" :src="stuData.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->

      <el-form-item label="楼宇名">
        <el-select
          v-model="stuData.buildingData"
          placeholder="请选择"
          value-key="id"
          style="width: 100%"
          @change="buildingChange"
        >
          <el-option
            v-for="item in buildingList"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="房间号">
        <el-select
          v-model="stuData.apartmentId"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in apartmentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <div>
        <el-button type="primary" @click="add">提交</el-button>
        <el-button @click="showDialog = false">取消</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-table :data="tableData" border stripe height="830">
    <el-table-column
      :v-if="showSelection"
      type="selection"
      width="55"
      align="center"
    ></el-table-column>
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
    <el-table-column align="center" label="操作" width="150">
      <template #default="scope">
        <el-button type="default" size="small" @click="update(scope.row.id)">编辑</el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background layout="prev, pager, next" :total="1000" />
</template>
<script lang="ts" setup>
import axios from "axios";
import {
  Delete,
  Edit,
  Plus,
  Search,
  Share,
  Upload,
} from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { Alignment } from "element-plus/es/components/table-v2/src/constants";
import { ElMessage } from "element-plus";

const tableData = ref<any[]>([]); // 传递给组件的 data 参数
const showSelection = ref<boolean>(true); // 传递给组件的 showSelection 参数
const showDialog = ref(false); // 控制对话框的显示与隐藏
const stuData = reactive({
  name: "",
  id: "",
  className: "",
  gender: "",
  age: "",
  phone: "",
  email: "",
  apartmentId: "",
  buildingData: "",
});

// 宿舍列表的数据
const buildingList = ref<any[]>([]);
const apartmentList = ref<any[]>([]);

// 查询表单的数据
const searchStu = reactive({
  content: "",
  type: "0",
  gender: "0",
});

function update(id: number) {
  const matchingData = tableData.value.find(item => item.id === id);
  if (matchingData) {
    console.log(matchingData); // 匹配的数据对象
    stuData.name = matchingData.name;
    stuData.id = matchingData.id;
    stuData.className = matchingData.className;
    stuData.age = matchingData.age;
    stuData.gender = matchingData.sex;
    stuData.phone = matchingData.phone;
    stuData.email = matchingData.email;
    showDialog.value = true;
  } else {
    ElMessage.error('页面数据异常，请刷新页面重试！')
  }
}

function deleteById(id: number) {
  console.log(id);
}

function search() {
  console.log(searchStu);
}

function clear() {
  searchStu.content = "";
  searchStu.gender = "0";
  searchStu.type = "0";
}

function add() {
  console.log(stuData);
}

function buildingChange() {
  apartmentList.value = stuData.buildingData.apartments;
  stuData.apartmentId = "";
  console.log(stuData.buildingData);
}

function onEdit() {
  console.log("编辑");
}

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

// 获取表格数据
axios.get("http://localhost:8088/student").then((resp) => {
  showSelection.value = true;
  console.log(resp);
  if (resp.data.code != "200") {
    console.log("获取数据失败：" + resp.data.msg);
  }
  tableData.value = resp.data.data;
});

// 获取宿舍数据
axios.get("http://localhost:8088/api/building").then((resp) => {
  console.log(resp);
  if (resp.data.code != "200") {
    console.log("获取数据失败：" + resp.data.msg);
  } else {
    console.log(resp.data.data);
    buildingList.value = resp.data.data;
  }
});
</script>