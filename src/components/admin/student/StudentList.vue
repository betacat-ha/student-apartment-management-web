<template>
  <el-row>
    <el-form :inline="true" :model="searchStu">
      <el-form-item label="查询内容">
        <div style="display: inline-flex">
          <el-select v-model="searchStu.type" style="width: 100px">
            <!-- <el-option label="不限" value="0"></el-option> -->
            <el-option label="学号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="班级" value="3"></el-option>
          </el-select>
          <el-input v-model="searchStu.content" placeholder="请输入查询内容" style="width: 150px"></el-input>
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
    <!-- <el-button type="primary" :icon="Edit">批量编辑</el-button> -->
    <el-button type="primary" :icon="Delete">批量删除</el-button>
    <el-button type="primary" :icon="Plus" @click="showDialog = true">添加学生</el-button>
  </div>

  <br />

  <!--添加数据对话框表单-->
  <el-dialog ref="form" :title="isEditing ? '编辑学生' : '添加学生'" v-model="showDialog" width="40%" @closed="dialogClosed">
    <el-form ref="editorFormRef" :model="stuData" label-width="60px" :rules="editorRules"
      @keyup.enter.native="onSubmit(editorFormRef)">
      <el-form-item label="学号" prop="id">
        <el-input v-model="stuData.id"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
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
      <el-form-item label="性别" prop="gender">
        <el-select v-model="stuData.gender" placeholder="请选择" style="width: 100%">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
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
        <el-select v-model="stuData.buildingData" placeholder="请选择" value-key="id" style="width: 100%"
          @change="buildingChange">
          <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="房间号">
        <el-select v-model="stuData.apartmentId" placeholder="请选择" value-key="id" style="width: 100%">
          <el-option v-for="item in apartmentList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <div>
        <el-button type="primary" @click="onSubmit(editorFormRef)">提交</el-button>
        <el-button @click="showDialog = false">取消</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-table :data="tableData" border stripe height="370">
    <el-table-column :v-if="showSelection" type="selection" width="55" align="center"></el-table-column>
    <el-table-column prop="name" label="姓名" width="120" align="center" fixed="left" show-overflow-tooltip />
    <el-table-column prop="id" label="学号" width="150" align="center" show-overflow-tooltip />
    <el-table-column prop="className" label="班级" width="120" align="center" show-overflow-tooltip />
    <el-table-column prop="age" label="年龄" width="60" align="center" show-overflow-tooltip />
    <el-table-column prop="gender" label="性别" width="60" align="center" show-overflow-tooltip />
    <el-table-column prop="phone" label="电话" width="120" align="center" show-overflow-tooltip />
    <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip />
    <el-table-column align="center" label="操作" width="150">
      <template #default="scope">
        <el-button type="default" size="small" @click="onEdit(scope.row.id)">编辑</el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <br />
  <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
    :page-sizes="[5, 10, 15, 20, 30, 40]" :small="pagination.small" :disabled="pagination.disabled"
    :background="pagination.background" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
import { FormInstance, FormRules, ElMessage } from "element-plus";

interface Building {
  id: number;
  name: string;
  apartments: Apartment[];
}

interface Apartment {
  id: number;
  buildingId: number;
  name: string;
  students: any;
}

// 表单规则
const editorFormRef = ref<FormInstance>();
const editorRules = reactive<FormRules>({
  id: [{ required: true, message: "请输入学号！", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名！", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别！", trigger: "blur" }],
});

const tableData = ref<any[]>([]); // 传递给组件的 data 参数
const showSelection = ref<boolean>(true); // 传递给组件的 showSelection 参数
const showDialog = ref(false); // 控制对话框的显示与隐藏
const isEditing = ref(false); // 是否正在编辑
const stuData = reactive({
  name: "",
  id: "",
  className: "",
  gender: "",
  age: "",
  phone: "",
  email: "",
  apartmentId: "",
  status: "",
  buildingData: {} as Building,
});
const pagination = reactive({
  small: false,
  disabled: true,
  background: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
});
// 宿舍列表的数据
const buildingList = ref<any[]>([]);
const apartmentList = ref<any[]>([]);

// 查询表单的数据
const searchStu = reactive({
  content: "",
  type: "1",
  gender: "0",
});

function onEdit(id: number) {
  const matchingData = tableData.value.find(item => item.id === id);
  if (matchingData) {
    stuData.name = matchingData.name;
    stuData.id = matchingData.id;
    stuData.className = matchingData.className;
    stuData.age = matchingData.age;
    stuData.gender = matchingData.gender;
    stuData.phone = matchingData.phone;
    stuData.email = matchingData.email;
    stuData.apartmentId = matchingData.apartmentId;
    stuData.buildingData = getBuildingFromApartmentId(matchingData.apartmentId, buildingList.value);
    stuData.status = matchingData.status;
    apartmentList.value = stuData.buildingData.apartments;
    isEditing.value = true;
    showDialog.value = true;
  } else {
    ElMessage.error('页面数据异常，请刷新页面重试！')
  }
}

function dialogClosed() {
  stuData.name = "";
  stuData.id = "";
  stuData.className = "";
  stuData.gender = "";
  stuData.age = "";
  stuData.phone = "";
  stuData.email = "";
  stuData.apartmentId = "";
  stuData.buildingData = {} as Building;
  isEditing.value = false;
}

// 从宿舍ID中获取楼宇信息
const getBuildingFromApartmentId = (apartmentId: number, data: Building[]): Building => {
  for (const building of data) {
    for (const apartment of building.apartments) {
      if (apartment.id === apartmentId) {
        return building;
      }
    }
  }
  return {} as Building;
};

// 处理每页显示条数变化
function handleSizeChange() {

}

// 处理当前页码变化
function handleCurrentChange() {
  console.log('handleCurrentChange:', pagination.currentPage)

}

// 删除
function deleteById(id: number) {
  axios.delete("http://localhost:8088/api/student?id=" + id).then((resp) => {
    if (resp.data.code != "200") {
      ElMessage.error("删除失败：" + resp.data.msg)
    } else {
      ElMessage.success("删除成功")
      refreshData();
    }
  });
}

// 查询
function search() {
  if (searchStu.content == "" && searchStu.gender == "0") {
    ElMessage.error("请输入要查询的内容！")
    return;
  }

  // TODO: 根据查询条件查询数据
  axios.get("http://localhost:8088/api/student/search?type=" + searchStu.type
    + "&content=" + searchStu.content
    + "&gender=" + searchStu.gender).then((resp) => {
      if (resp.data.code != "200") {
        ElMessage.error("查询失败：" + resp.data.msg)
      } else {
        tableData.value = resp.data.data;
        ElMessage.success("查询成功")
      }
    });
}

// 清空查询条件
function clear() {
  searchStu.content = "";
  searchStu.gender = "0";
  searchStu.type = "0";
  refreshData();
}

// 提交学生数据
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (!valid) {
      return;
    }
    axios.post("http://localhost:8088/api/student", stuData).then((resp) => {
      if (resp.data.code != "200") {
        ElMessage.error("提交失败：" + resp.data.msg)
      } else {
        ElMessage.success(resp.data.msg)
        refreshData();
        showDialog.value = false;
      }
    });
  });
}

// 楼宇改变
function buildingChange() {
  apartmentList.value = stuData.buildingData.apartments;
  stuData.apartmentId = "";
}

refreshData();

// 刷新数据
function refreshData(enablePagination: boolean = false) {
  var getStr = "http://localhost:8088/api/student"
  if (enablePagination) {
    getStr += "?page=" + pagination.currentPage + "&size=" + pagination.pageSize
  }


  // 获取表格数据
  axios.get(getStr).then((resp) => {
    showSelection.value = true;
    if (resp.data.code != "200") {
      ElMessage.error("获取数据失败：" + resp.data.msg)
    }
    tableData.value = resp.data.data;
  });

  // 获取宿舍数据
  axios.get("http://localhost:8088/api/building").then((resp) => {
    if (resp.data.code != "200") {
      ElMessage.error("获取数据失败：" + resp.data.msg)
    } else {
      buildingList.value = resp.data.data;
    }
  });
}
</script>