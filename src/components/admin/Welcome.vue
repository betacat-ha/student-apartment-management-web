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
            <el-avatar :src="require('@/assets/avatar/03b0d39583f48206768a7534e55bcpng.png')" :size="100" />
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

    getAllNotice()
};

// 获取公告
const getAllNotice = () => {
    axios.get("/notice/all").then((res) => {
        console.log(res.data)
        notices.value = res.data.data
    })
    .catch(err => {console.log(err)});
}

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