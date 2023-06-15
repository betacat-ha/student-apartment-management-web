<template>
    <el-row>
        <el-form :inline="true" :model="searchApartment">
            <el-form-item label="楼宇名">
                <el-select v-model="searchApartment.buildingData" placeholder="请选择" value-key="id" style="width: 100%;"
                    @change="searchBuildingChange">
                    <el-option label="不限" value=""></el-option>
                    <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item label="房间号">
                <el-select v-model="searchApartment.apartmentId" placeholder="请选择" value-key="id" style="width: 100%">
                    <el-option label="不限" value=""></el-option>
                    <el-option v-for="item in apartmentList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="类型">
                <el-select v-model="searchApartment.type" placeholder="请选择" value-key="id" style="width: 80px">
                    <el-option label="不限" value=""></el-option>
                    <el-option label="水" value="水"></el-option>
                    <el-option label="电" value="电"></el-option>
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
        <el-button type="primary" :icon="Plus" @click="showDialog = true">添加数据</el-button>
    </div>

    <br />

    <!--添加数据对话框表单-->
    <el-dialog ref="form" :title="isEditing ? '编辑数据' : '添加数据'" v-model="showDialog" width="40%" @closed="dialogClosed">
        <el-form ref="editorFormRef" :model="apartmentData" label-width="80px" :rules="editorRules"
            @keyup.enter.native="onSubmit(editorFormRef)">
            <el-form-item label="楼宇名">
                <el-select v-model="apartmentData.buildingData" placeholder="请选择" value-key="id" style="width: 100%"
                    @change="buildingChange">
                    <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item label="房间号" prop="apartmentId">
                <el-select v-model="apartmentData.apartmentId" placeholder="请选择" value-key="id" style="width: 100%">
                    <el-option v-for="item in apartmentList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="类型" prop="type">
                <el-select v-model="apartmentData.type" placeholder="请选择" value-key="id" style="width: 100%">
                    <el-option label="水" value="水" />
                    <el-option label="电" value="电" />
                </el-select>
            </el-form-item>

            <el-form-item label="用量" prop="amount">
                <el-input v-model="apartmentData.amount"></el-input>
            </el-form-item>

            <el-form-item label="开始时间">
                <el-date-picker v-model="apartmentData.startTime" type="dates" value-format="x"
                    placeholder="Pick one or more dates" />
                <!-- <el-input v-model="apartmentData.startTime"></el-input> -->
            </el-form-item>
            <el-form-item label="结束时间">
                <el-input v-model="apartmentData.endTime"></el-input>
            </el-form-item>

            <el-form-item label="支付状态">
                <el-label>
                    {{ apartmentData.billData.status ? apartmentData.billData.status : "账单未生成" }}
                </el-label>
                <el-button v-if="!apartmentData.billData.status" style="margin-left: 10px;">支付</el-button>
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
            <div>
                <el-button type="primary" @click="onSubmit(editorFormRef)">提交</el-button>
                <el-button @click="showDialog = false">取消</el-button>
            </div>
        </el-form>
    </el-dialog>

    <el-table :data="tableData" border stripe height="370">
        <el-table-column :v-if="showSelection" type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="buildingName" label="楼宇" width="110" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="apartmentName" label="宿舍号" width="80" align="center" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="60" align="center" show-overflow-tooltip />
        <el-table-column prop="amount" label="用量" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="startTime" label="开始时间" align="center" show-overflow-tooltip />
        <el-table-column prop="endTime" label="结束时间" align="center" show-overflow-tooltip />
        <el-table-column align="center" label="操作" width="210">
            <template #default="scope">
                <el-button type="default" size="small" @click="onEdit(scope.row.id)">详情</el-button>
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

interface Bill {
    id: number;
    usage_id: number;
    amount: number;
    status: string;
    date: string;
    payDate: string;
    payType: string;
}

// 表单规则
const editorFormRef = ref<FormInstance>();
const editorRules = reactive<FormRules>({
    amount: [{ required: true, message: "请输入用量！", trigger: "blur" }],
    type: [{ required: true, message: "请输入类型！", trigger: "blur" }],
    apartmentId: [{ required: true, message: "请选择宿舍！", trigger: "blur" }],
});

const value4 = ref('')
const tableData = ref<any[]>([]); // 传递给组件的 data 参数
const showSelection = ref<boolean>(true); // 传递给组件的 showSelection 参数
const showDialog = ref(false); // 控制对话框的显示与隐藏
const isEditing = ref(false); // 是否正在编辑
const apartmentData = reactive({
    type: "",
    amount: "",
    startTime: "",
    endTime: "",
    apartmentId: "",
    buildingId: "",
    buildingData: {} as Building,
    billData: {} as Bill,
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
const searchApartment = reactive({
    content: "",
    buildingData: {} as Building,
    apartmentId: "",
    type: "",
    startTime: "",
    endTime: "",
});

function onEdit(id: number) {
    const matchingData = tableData.value.find(item => item.id === id);
    if (matchingData) {
        console.log(matchingData);
        apartmentData.type = matchingData.type;
        apartmentData.amount = matchingData.amount;
        apartmentData.startTime = matchingData.startTime;
        apartmentData.endTime = matchingData.endTime;
        apartmentData.apartmentId = matchingData.apartmentId;
        apartmentData.buildingData = getBuildingFromApartmentId(matchingData.apartmentId, buildingList.value);
        apartmentList.value = apartmentData.buildingData.apartments;
        isEditing.value = true;
        showDialog.value = true;
    } else {
        ElMessage.error('页面数据异常，请刷新页面重试！')
    }
}

function dialogClosed() {
    apartmentData.type = "";
    apartmentData.amount = "";
    apartmentData.startTime = "";
    apartmentData.endTime = "";
    apartmentData.apartmentId = "";
    apartmentData.buildingData = {} as Building;
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
    const buildingId = searchApartment.buildingData.id == undefined ? 0 : searchApartment.buildingData.id;
    const apartmentId = searchApartment.apartmentId;
    const type = searchApartment.type;
    const startTime = searchApartment.startTime;
    const endTime = searchApartment.endTime;

    axios.get("http://localhost:8088/api/usage/search?apartmentId=" + apartmentId
        + "&buildingId=" + buildingId
        + "&startTimeFormat=" + startTime
        + "&endTimeFormat=" + endTime
        + "&type=" + type
    ).then((resp) => {
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
    searchApartment.apartmentId = "";
    searchApartment.buildingData = {} as Building;
    searchApartment.type = "";
    searchApartment.startTime = "";
    searchApartment.endTime = "";
    refreshData();
}

// 提交学生数据
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (!valid) {
            return;
        }
        axios.post("http://localhost:8088/api/student", apartmentData).then((resp) => {
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
    apartmentList.value = apartmentData.buildingData.apartments;
    apartmentData.apartmentId = "";
}

// 查询框的楼宇改变
function searchBuildingChange() {
    apartmentList.value = searchApartment.buildingData.apartments;
    searchApartment.apartmentId = "";
}

refreshData();

// 刷新数据
function refreshData(enablePagination: boolean = false) {
    var getStr = "http://localhost:8088/api/usage"
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