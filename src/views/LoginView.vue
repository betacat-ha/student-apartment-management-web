<template>
    <div class="login-container">
        <div style="flex: 1;">
            <div style=" fit: cover;">
                <el-image :src="require('@/assets/Background/Blackchain.png')" />
            </div>
        </div>

        <div class="login-form">
            <el-form ref="loginFormRef" :model="form" label-width="120px" :rules="rules">
                <!-- @keyup.enter.native="submitForm(loginFormRef)" -->
                <el-form-item>
                    <h1 style="text-align: center;">登录</h1>
                </el-form-item>
                <el-form-item label="用户名" prop="email">
                    <el-input v-model="form.email" autofocus />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"/>
                </el-form-item>
                <div :style="{'display': isReadyToLogin ? 'none' : 'grid', 'justify-content': 'end', 'margin-bottom': '15px'}">
                    <Verify mode="fixed" captchaType="blockPuzzle" @success="captchaOnSuccess"></Verify>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(loginFormRef)" :loading="isloading" :disabled="!isReadyToLogin">登录</el-button>
                    <el-link type="primary" @click="dialogVisible = true" style="margin-left: 8px">忘记密码？</el-link>
                </el-form-item>
            </el-form>
        </div>

    </div>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="dialogVisible" title="重置密码" width="40%" :before-close="handleClose">
        <changePassword :email="form.email" style="padding-right: 50px;" @success="dialogVisible = false"/>
    </el-dialog>
</template>

<script setup lang="ts">
import { FormInstance, FormRules, ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { nextTick, reactive, ref } from "vue";
import router from "../router";
import store from '@/store/index'
import axios from "axios";
import Verify from '@/components/verifition/Verify.vue'
import changePassword from '@/components/user/ChangePassword.vue'

// 表单数据
const form = reactive({
    email: "",
    password: "",
    verifyCode: "",
});

const isloading = ref(false);
const isReadyToLogin = ref(false);

// 表单规则
const loginFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
    email: [{ required: true, message: "请输入用户名！", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码！", trigger: "blur" }],
    verifyCode: [{ required: false, message: "请输入验证码！", trigger: "blur" }],
});

// 表单提交操作
const submitForm = async (formEl: FormInstance | undefined) => {
    isloading.value = true;
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            axios.post("/auth/login", form).then((resp) => {
                isloading.value = false;
                if (resp.data.status != null) {
                    return;
                } else if (resp.data.code == '4001') {
                    // 显示验证码对话框
                    dialogVisible.value = true
                    return;
                } else if (resp.data.code != '200') {
                    ElMessage.error('登录失败 - ' + resp.data.msg)
                    return;
                }

                // 保存Token数据
                localStorage.setItem('token', resp.data.data)
                store.state.token = resp.data.data

                router.push('/admin')

                
            }).catch(err => {
                isloading.value = false;
                // ElMessage.error('登录失败 - 系统内部错误')
            })
        } else {
            console.log("error submit!");
        }
    });
};

// 安全验证模块
const dialogVisible = ref(false)

// 关闭对话框
const handleClose = (done: () => void) => {
    form.verifyCode = ''
    done()
}

function captchaOnSuccess(params:any) {
    isReadyToLogin.value = true
    form.verifyCode = params.captchaVerification
}


</script>

<style>
.login-container {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
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