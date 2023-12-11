<template>
    <!-- 详情页面 -->
    <el-dialog v-model="showNoticeDetailDialog" width="50%" :title="editNotice.title">
        <el-text>作者：{{ editNotice.authorName }} 时间：{{ editNotice.createTime }}</el-text>
        <div style="white-space: pre-wrap; text-align: left;">{{ editNotice.content }}</div>
    </el-dialog>
    <div style="display: flex; flex-direction: column;">
        <!-- <h1>
            👏欢迎使用
        </h1> -->
        <div style="display: flex; align-items: center; justify-content: left;">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="100" />
            <el-row style="margin-left: 10px;">
                <el-col :span="8">
                    <el-tag effect="dark">{{ user?.roleId == 1 ? '超级管理员' : '宿舍管理员' }}</el-tag>
                </el-col>
                <el-col :span="16" :push="1">
                    <el-label>{{ user?.name }}，欢迎你</el-label>
                </el-col>
            </el-row>
        </div>
    </div>
    <el-divider></el-divider>
    <el-row :gutter="1">
        <el-col :span="12">
            <el-card>
                <h3>公告栏</h3>
                <el-divider></el-divider>
                <el-row v-for="notice in notices" :key="notice.id" style=" align-items: center; margin-bottom: 5px;">
                    <el-col :span="16" style="text-align: left;">
                        <el-tag :type="notice.tagType">{{ notice.tag }}</el-tag>
                        <el-button type="text" @click="onShowNotice(notice)" link>{{ notice.title }}</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-label type="info">{{ notice.createTime }}</el-label>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>

        <el-col :span="12">
            <el-card>
                <h3>昨日考勤情况</h3>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="12">
                        <p style="font-weight: bold;">晚归人数</p>
                        <el-descriptions :column="1">
                            <el-descriptions-item label="学生宿舍3栋">3人</el-descriptions-item>
                            <el-descriptions-item label="学生宿舍6栋">1人</el-descriptions-item>
                            <el-descriptions-item label="学生宿舍7栋">0人</el-descriptions-item>
                        </el-descriptions>
                    </el-col>
                    <el-col :span="12">
                        <p style="font-weight: bold;">未归人数</p>
                        <el-descriptions :column="1">
                            <el-descriptions-item label="学生宿舍3栋">0人</el-descriptions-item>
                            <el-descriptions-item label="学生宿舍6栋">3人</el-descriptions-item>
                            <el-descriptions-item label="学生宿舍7栋">0人</el-descriptions-item>
                        </el-descriptions>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { ElAvatar } from "element-plus";
import axios from "@/http";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

interface User {
    id: number;
    name: string;
    buildingId: number;
    roleId: number;
}

interface Notice {
    id: number;
    title: string;
    content: string;
    authorName: string;
    tag: string;
    tagType: string;
    createTime: string;
    updateTime: string;
}

const user = ref<User>();
const notices = ref<Notice[]>([]);
const showNoticeDetailDialog = ref(false);

const editNotice = reactive<Notice>({
    id: 0,
    title: "",
    content: "",
    authorName: "",
    tag: "",
    tagType: "",
    createTime: "",
    updateTime: "",
})

const refreshData = () => {
    axios.get("/user/current").then((res) => {
        user.value = res.data.data;
    })
    .catch(err => {console.log(err)});
    notices.value.push({
        id: 2,
        title: "关于启用东校区智能电控系统的通知",
        content: "\n各位东校区的同学：\n    你们好！为提高东校区用电的管理水平，保障用电安全，方便大家查询及缴纳电费，现定于2023年6月19日启用东校区智能电控系统，届时大家可通过学校企业微信-工作台-个人工具找到“智慧电控”这个应用来查询和缴纳电费。操作流程见附件一。\n    请同学们6月21日前登录电控系统补交本学期以来所欠电费，6月22日起，电控系统将转为预付费模式，即先充值后用电模式，如房间没有剩余电量则自动断电。",
        authorName: "后勤处 网络信息中心",
        tag: "紧急",
        tagType: "danger",
        createTime: "2023-06-17 12:00:00",
        updateTime: "2023-06-17 12:00:00",
    });

    notices.value.push({
        id: 1,
        title: "请做好本季度的宿舍卫生检查工作",
        content: "测试公告内容",
        authorName: "张三",
        tag: "普通",
        tagType: "primary",
        createTime: "2023-12-11 12:00:00",
        updateTime: "2023-12-11 12:00:00",
    });
};

const onShowNotice = (notice: Notice) => {
    editNotice.title = notice.title;
    editNotice.authorName = notice.authorName;
    editNotice.content = notice.content;
    editNotice.createTime = notice.createTime;
    showNoticeDetailDialog.value = true;
}
onMounted(() => {

    refreshData();

});

onBeforeUnmount(()=> {
    
}
)

</script>

<style>
el-link {
    display: inline-block;
    text-overflow: ellipsis;
    width: 20em;
    white-space: nowrap;
    overflow: hidden;
}
.tttt {
  white-space: pre-wrap;
}
</style>