<template>
    <el-row>
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
    </el-row>

    <div style="display: flex">
        <!-- <el-button type="primary" :icon="Edit">批量编辑</el-button> -->
        <el-button type="primary" :icon="Delete">批量删除</el-button>
        <el-button type="primary" :icon="Plus" @click="showDialog = true">添加数据</el-button>
        <el-button type="primary" :icon="Files" @click="startProgress">一键制单</el-button>
    </div>

    <br />

    <!--添加数据对话框表单-->
    <el-dialog ref="form" :title="isEditing ? '编辑数据' : '添加数据'" v-model="showDialog" width="50%" @closed="dialogClosed">
        <el-form ref="editorFormRef" :model="apartmentData" label-width="80px"
            @keyup.enter.native="onSubmit(editorFormRef)">
            <el-form-item label="楼栋名" prop="buildingDataItem">
                <el-select v-model="apartmentData.buildingData" placeholder="请选择" value-key="id" style="width: 100%"
                    @change="buildingChange">
                    <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item label="房间号" prop="apartmentIdItem">
                <el-select v-model="apartmentData.apartmentId" placeholder="请选择" value-key="id" style="width: 100%">
                    <el-option v-for="item in apartmentList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="类型" prop="typeItem">
                <el-select v-model="apartmentData.type" placeholder="请选择" value-key="id" style="width: 100%">
                    <el-option label="水" value="水" />
                    <el-option label="电" value="电" />
                </el-select>
            </el-form-item>

            <el-form-item label="用量" prop="amountItem">
                <el-input v-model="apartmentData.amount"></el-input>
            </el-form-item>

            <el-form-item label="周期" prop="startTimeItem">
                <el-col :span="10">
                    <el-date-picker v-model="apartmentData.startTimeFormat" type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择一个日期" />
                </el-col>
                <el-col :span="2" class="text-center">
                    <span class="text-gray-500">-</span>
                </el-col>
                <el-col :span="10">
                    <el-date-picker v-model="apartmentData.endTimeFormat" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择一个日期" />
                </el-col>

                <!-- <el-input v-model="apartmentData.startTime"></el-input> -->
            </el-form-item>

            <el-form-item label="支付状态">
                    {{ apartmentData.billData.status ? apartmentData.billData.status : "账单未生成" }}
                <el-button v-if="!apartmentData.billData.status" style="margin-left: 10px;">支付</el-button>
            </el-form-item>
            <div>
                <el-button type="primary" @click="onSubmit(editorFormRef)">提交</el-button>
                <el-button @click="showDialog = false">取消</el-button>
            </div>
        </el-form>
    </el-dialog>

    <!-- 详情页面 -->
    <el-dialog v-model="showDetailDialog" width="50%" @closed="dialogClosed" title="用量详情">
        <el-form :model="usageDetail" label-width="80px">
            <el-form-item label="楼栋名" prop="buildingDataItem">
                <el-text> {{ usageDetail.buildingName }}</el-text>
            </el-form-item>

            <el-form-item label="房间号" prop="apartmentIdItem">
                {{ usageDetail.apartmentName }}
            </el-form-item>

            <el-form-item label="类型" prop="typeItem">
                {{ usageDetail.type }}
            </el-form-item>

            <el-form-item label="用量" prop="amountItem">
                {{ usageDetail.amount }}
            </el-form-item>

            <el-form-item label="周期" prop="startTimeItem">
                {{ usageDetail.startTimeFormat }} - {{ usageDetail.endTimeFormat }}
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="账单状态">
                    {{ usageDetail.bill ? "账单已生成" : "账单未生成" }}
                <el-button v-if="!usageDetail.bill" style="margin-left: 10px;">一键生成</el-button>
            </el-form-item>
            <div v-if="usageDetail.bill">
                <el-form-item label="账单号">
                    {{ usageDetail.bill.id }}
                </el-form-item>
                <el-form-item label="支付时间">
                    {{ usageDetail.bill.payDate }}
                </el-form-item>
                <el-form-item label="补助额度">
                    {{ usageDetail.bill.subsidy }}
                </el-form-item>
                <el-form-item label="单价">
                    {{ usageDetail.bill.unitPrice }} 元
                </el-form-item>
                <el-form-item label="总计">
                    {{ usageDetail.bill.total }} 元
                </el-form-item>
            </div>

        </el-form>
    </el-dialog>

    <el-dialog v-model="showProgressDialog" width="60%" title="执行进度" :close-on-click-modal="false"
        :close-on-press-escape="false" :show-close="false">
        <el-progress :percentage="progress" style="margin-bottom: 8px;" />
        {{ progressText }}
        <br />
        <el-button v-if="progress === 100" @click="showProgressDialog = false" style="margin-top: 8px;">关闭</el-button>
    </el-dialog>

    <el-table :data="tableData" border stripe height="370">
        <el-table-column :v-if="showSelection" type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="buildingName" label="楼栋名" width="110" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="apartmentName" label="宿舍号" width="80" align="center" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="60" align="center" show-overflow-tooltip />
        <el-table-column prop="amount" label="用量" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="startTime" label="开始时间" align="center" show-overflow-tooltip />
        <el-table-column prop="endTime" label="结束时间" align="center" show-overflow-tooltip />
        <el-table-column align="center" label="操作" width="210">
            <template #default="scope">
                <el-button type="default" size="small" @click="onDetail(scope.row)">详情</el-button>
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
    Files,
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
    unitPrice: number;
    subsidy: number;
    total: number;
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
const showDetailDialog = ref(false); // 控制详情对话框的显示与隐藏
const isEditing = ref(false); // 是否正在编辑
const apartmentData = reactive({
    id: "",
    type: "",
    amount: "",
    startTime: "",
    endTime: "",
    startTimeFormat: "",
    endTimeFormat: "",
    apartmentId: "",
    buildingId: "",
    buildingData: {} as Building,
    billData: {} as Bill,
});

const usageDetail = ref({
    id: "",
    type: "",
    amount: "",
    startTime: "",
    endTime: "",
    startTimeFormat: "",
    endTimeFormat: "",
    buildingName: "",
    apartmentName: "",
    bill: {} as Bill,
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

const onDetail = (usage: any) => {
    console.log(usage);
    usageDetail.value = usage;
    console.log(usage.buildingName);

    showDetailDialog.value = true;
}

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
        apartmentData.id = matchingData.id;
        apartmentData.startTimeFormat = matchingData.startTimeFormat;
        apartmentData.endTimeFormat = matchingData.endTimeFormat;
        apartmentList.value = apartmentData.buildingData.apartments;
        isEditing.value = true;
        showDialog.value = true;

        // 清除验证，避免因数据自动填入导致校验失败
        editorFormRef.value?.clearValidate();
    } else {
        ElMessage.error('页面数据异常，请刷新页面重试！')
    }
}

function dialogClosed() {
    apartmentData.type = "";
    apartmentData.amount = "";
    apartmentData.startTime = "";
    apartmentData.endTime = "";
    apartmentData.startTimeFormat = "";
    apartmentData.endTimeFormat = "";
    apartmentData.apartmentId = "";
    apartmentData.buildingData = {} as Building;
    isEditing.value = false;
}

// 从宿舍ID中获取楼栋信息
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
    axios.delete("http://localhost:8088/api/usage?id=" + id).then((resp) => {
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

// 提交数据
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (!valid) {
            return;
        }
        axios.post("http://localhost:8088/api/usage", apartmentData).then((resp) => {
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

// 楼栋改变
function buildingChange() {
    apartmentList.value = apartmentData.buildingData.apartments;
    apartmentData.apartmentId = "";
}

// 查询框的楼栋改变
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

let socket: WebSocket | null = null;
const progress = ref(0);
const showProgressDialog = ref(false);
const progressText = ref("");

// Websoket连接成功事件
const websocketonopen = (res: any) => {
    console.log("WebSocket连接成功", res);
};
// Websoket接收消息事件
const websocketonmessage = (res: any) => {
    if (res.data == "连接成功") {
        console.log("收到来自服务器的消息：", res.data);
        progressText.value = "服务器正在执行中...（请不要关闭窗口）";
        return;
    }

    if (res.data == "100") {
        progressText.value = "服务器执行完毕";
        progress.value = 100;
        socket?.close();
        return;
    }

    progress.value = res.data;
};
// Websoket连接错误事件
const websocketonerror = (res: any) => {
    console.log("连接错误", res);
};
// Websoket断开事件
const websocketclose = (res: any) => {
    console.log("断开连接", res);
};
const initWebSocket = (userid: number) => {
    // ws地址 -->这里是你的请求路径
    const wsuri = "ws://localhost:8088/wsServer/" + userid;
    socket = new WebSocket(wsuri);
    socket.onmessage = websocketonmessage;
    socket.onopen = websocketonopen;
    socket.onerror = websocketonerror;
    socket.onclose = websocketclose;
};


const startProgress = () => {
    showProgressDialog.value = true;
    progress.value = 0;
    progressText.value = "指令已向服务器下发，正在等待响应...（请不要关闭窗口）";
    setTimeout(() => {
        axios.get("/api/bill/generate").then((res) => {
            if (res.data.code != "200") {
                ElMessage.error("制单失败：" + res.data.msg)
            } else {
                ElMessage.success("一键制单成功")
            }
        });
        axios.get("/api/user/current").then((res) => {
            initWebSocket(res.data.data.id)
        });
    }, 2000);
};


</script>