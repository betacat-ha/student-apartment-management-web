<template>
    <div class="login-container">
        <div style="flex: 1;">
            <div style=" fit: cover;">
                <el-image src="https://s1.ax1x.com/2023/06/16/pCM1W3q.png" />
            </div>
        </div>

        <div class="login-form">
            <el-form ref="loginFormRef" :model="form" label-width="120px" :rules="rules"
                @keyup.enter.native="submitForm(loginFormRef)">
                <el-form-item>
                    <h1 style="text-align: center;">登录</h1>
                </el-form-item>
                <el-form-item label="用户名" prop="email">
                    <el-input v-model="form.email" autofocus />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(loginFormRef)">登录</el-button>
                    <el-link type="primary" @click="forgetPassword" style="margin-left: 8px">忘记密码？</el-link>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules, ElLoading, ElMessage } from "element-plus";
import { nextTick, reactive, ref } from "vue";
import router from "../router";
import axios from "axios";


// 表单数据
const form = reactive({
    email: "",
    password: "",
});

var loading = false;

// 表单规则
const loginFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
    email: [{ required: true, message: "请输入用户名！", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码！", trigger: "blur" }],
});

// 表单提交操作
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            //   console.log(form);
            // ElLoading.service({
            //     lock: true,
            //     text: "登录中...",
            //     background: "rgba(0, 0, 0, 0.7)",
            // });
            axios.post("http://localhost:8088/api/login", form).then((resp) => {
                if (resp.data.status != null) {
                    ElMessage.error('登录失败 - 系统内部错误')
                    // ElLoading.service().close
                    return;
                } else if (resp.data.code != '200') {
                    ElMessage.error('登录失败 - ' + resp.data.msg)
                    // ElLoading.service().close
                    return;
                }
                // ElLoading.service().close
                localStorage.setItem('token', resp.data.data)
                router.push('/admin')
            });
        } else {
            console.log("error submit!");
        }
    });
};

// 忘记密码操作
function forgetPassword() {
    ElMessage.info("请联系管理员重置密码！");
}

</script>

<style>
.login-container {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    overflow: hidden;
}

.login-form {
    text-align: left;
    width: 40%;
    min-width: 400px;
}

el-form-item :last-child {
    margin-bottom: 0;
}
</style>