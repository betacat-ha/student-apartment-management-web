<template>
    <div style="display: flex; height: 60px; align-items: center; justify-content: center;">
        <div style="flex:1;">
            <div style="font-size: x-large; font-weight: bold; margin-left: 100px;">
                学生公寓管理系统
            </div>

        </div>
        <div style="width: 100px; text-align: right;">
            <el-button style="font-size: medium;" type="plain" link @click="logout">
                退出登录
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from "@/router";

function logout() {
    localStorage.removeItem('token');
    router.push('/login');
}
</script>
