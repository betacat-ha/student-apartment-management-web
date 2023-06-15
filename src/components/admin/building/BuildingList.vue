<template>
    <!-- <el-row>
        <el-form :inline="true" :model="searchApartment">
            <el-form-item label="楼栋名">
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
    </el-row> -->

    <div style="display: flex">
        <!-- <el-button type="primary" :icon="Edit">批量编辑</el-button> -->
        <el-button type="primary" :icon="Delete">批量删除</el-button>
        <el-button type="primary" :icon="Plus" @click="showDialog = true">添加数据</el-button>
    </div>

    <br />

    <!--添加数据对话框表单-->
    <el-dialog ref="form" :title="isEditing ? '编辑数据' : '添加数据'" v-model="showDialog" width="40%" @closed="dialogClosed">
        <el-form ref="editorFormRef" :model="buildingData" label-width="80px" @keyup.enter.native="onSubmit(editorFormRef)">
            <el-form-item label="楼栋名" prop="buildingDataItem">
                <el-input v-model="buildingData.name"></el-input>
            </el-form-item>

            <el-form-item label="房间号" prop="apartmentIdItem">
                <el-tag v-for="item in buildingData.apartments" :key="item.id" class="mx-1" effect="light" closable
                    @close="deleteApartment(item.id)">
                    {{ item.name }}
                </el-tag>
            </el-form-item>

            <!-- <el-lable>
                请注意，删除楼栋时，该楼栋下的所有房间将被删除！
            </el-lable> -->

            <el-form-item label="添加房间" prop="addApartment">
                <el-input v-model="buildingData.newApartment">
                    <template #append>
                        <el-button type="button" @click="addApartment">添加</el-button>
                    </template>
                </el-input>
            </el-form-item>

            <div>
                <el-button type="primary" @click="onSubmit(editorFormRef)">提交</el-button>
                <el-button @click="showDialog = false">取消</el-button>
            </div>
        </el-form>
    </el-dialog>

    <el-table :data="tableData" border stripe height="450">
        <el-table-column :v-if="showSelection" type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="楼栋名" width="110" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="administrator" label="管理员" align="center" show-overflow-tooltip />
        <el-table-column align="center" label="操作">
            <template #default="scope">
                <el-button type="default" size="small" @click="onEdit(scope.row.id)">详情</el-button>
                <el-button type="default" size="small" @click="onEdit(scope.row.id)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
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
    amountItem: [{ required: true, message: "请输入用量！", trigger: "blur" }],
    typeItem: [{ required: true, message: "请输入类型！", trigger: "blur" }],
    buildingDataItem: [{ required: true, message: "请选择楼栋！", trigger: "blur" }],
    apartmentIdItem: [{ required: true, message: "请选择宿舍！", trigger: "blur" }],
    startTimeItem: [{ required: true, message: "请选择开始时间！", trigger: "blur" }],
    endTimeItem: [{ required: true, message: "请选择结束时间！", trigger: "blur" }],
});

const tableData = ref<any[]>([]); // 传递给组件的 data 参数
const showSelection = ref<boolean>(true); // 传递给组件的 showSelection 参数
const showDialog = ref(false); // 控制对话框的显示与隐藏
const isEditing = ref(false); // 是否正在编辑
const buildingData = reactive({
    id: "",
    name: "",
    administrator: "",
    newApartment: "",
    apartments: [] as Apartment[],
});

// 宿舍列表的数据
const buildingList = ref<any[]>([]);
const apartmentList = ref<any[]>([]);

function addApartment() {
    buildingData.apartments.push({
        id: 0,
        buildingId: 0,
        name: buildingData.newApartment,
        students: [],
    });
}

function deleteApartment(id: number) {
    const index = buildingData.apartments.findIndex(item => item.id === id);
    console.log(index);
    if (index !== -1) {
        buildingData.apartments.splice(index, 1);
    }
}

function onEdit(id: number) {
    const matchingData = tableData.value.find(item => item.id === id);
    if (matchingData) {
        console.log(matchingData);
        buildingData.id = matchingData.id;
        buildingData.name = matchingData.name;
        buildingData.apartments = matchingData.apartments;

        isEditing.value = true;
        showDialog.value = true;

        // 清除验证，避免因数据自动填入导致校验失败
        editorFormRef.value?.clearValidate();
    } else {
        ElMessage.error('页面数据异常，请刷新页面重试！')
    }
}

function dialogClosed() {
    buildingData.id = "";
    buildingData.name = "";
    buildingData.apartments = [] as Apartment[];
    buildingData.newApartment = "";
    isEditing.value = false;
}

// 删除
function deleteById(id: number) {
    axios.delete("http://localhost:8088/api/building?id=" + id).then((resp) => {
        if (resp.data.code != "200") {
            ElMessage.error("删除失败：" + resp.data.msg)
        } else {
            ElMessage.success("删除成功")
            refreshData();
        }
    });
}

// 提交数据
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (!valid) {
            return;
        }
        axios.post("http://localhost:8088/api/building", buildingData).then((resp) => {
            if (resp.data.code != "200") {
                ElMessage.error(resp.data.msg);
                refreshData();
            } else {
                ElMessage.success("操作完成！")
                refreshData();
                showDialog.value = false;
            }
        });
    });
}

refreshData();

// 刷新数据
function refreshData() {
    // 获取楼栋数据
    axios.get("http://localhost:8088/api/building").then((resp) => {
        showSelection.value = true;
        if (resp.data.code != "200") {
            ElMessage.error("获取数据失败：" + resp.data.msg)
        } else {
            buildingList.value = resp.data.data;
            tableData.value = resp.data.data;
        }
    });

    // 获取宿舍数据
    axios.get("http://localhost:8088/api/apartment").then((resp) => {
        if (resp.data.code != "200") {
            ElMessage.error("获取数据失败：" + resp.data.msg)
        } else {
            apartmentList.value = resp.data.data;
        }
    });

}
</script>