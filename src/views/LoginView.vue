<template>
    <div class="login-container">
        <div style="flex: 1;">
            <div style=" fit: cover;">
                <el-image src="https://s1.ax1x.com/2023/06/16/pCM1W3q.png" />
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
                    <el-input v-model="form.password" />
                </el-form-item>
                <div :style="{'display': isReadyToLogin ? 'none' : 'grid', 'justify-content': 'end', 'margin-bottom': '15px'}">
                    <Verify mode="fixed" captchaType="blockPuzzle" @success="captchaOnSuccess"></Verify>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(loginFormRef)" :loading="isloading" :disabled="!isReadyToLogin">登录</el-button>
                    <el-link type="primary" @click="forgetPassword" style="margin-left: 8px">忘记密码？</el-link>
                </el-form-item>
            </el-form>
        </div>

    </div>

    <!-- 验证码对话框 -->
    <el-dialog v-model="dialogVisible" title="安全验证" width="30%" :before-close="handleClose">
        <div>
            <span>为了您的帐户安全，本次登录需要验证码！</span>
            <el-input v-model="form.verifyCode" placeholder="输入验证码">
                <template #append>
                    <el-button @click="getVerifyCode" :disabled="isGetCodeButtonDisabled">{{ getCodeButton }}</el-button>
                </template>
            </el-input>
            <!-- 服务器返回的提示 -->

        </div>
        <template #footer>
            <span class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取消</el-button> -->
                <el-button type="primary" @click="submitForm(loginFormRef)">
                    验证
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { FormInstance, FormRules, ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { nextTick, reactive, ref } from "vue";
import router from "../router";
import axios from "axios";
import Verify from '@/components/verifition/Verify.vue'

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
            axios.post("/login", form).then((resp) => {
                isloading.value = false;
                if (resp.data.status != null) {
                    ElMessage.error('登录失败 - 系统内部错误')
                    return;
                } else if (resp.data.code == '4001') {
                    // 显示验证码对话框
                    dialogVisible.value = true
                    return;
                } else if (resp.data.code != '200') {
                    ElMessage.error('登录失败 - ' + resp.data.msg)
                    return;
                }
                localStorage.setItem('token', resp.data.data)
                router.push('/admin')
            }).catch(err => {
                isloading.value = false;
                ElMessage.error('登录失败 - 系统内部错误')
            })
        } else {
            console.log("error submit!");
        }
    });
};

// 忘记密码操作
function forgetPassword() {
    ElMessage.info("请联系管理员重置密码！");
}

// 安全验证模块
const dialogVisible = ref(false)

// 关闭对话框
const handleClose = (done: () => void) => {
    form.verifyCode = ''
    done()
}

// 获取验证码
function getVerifyCode() {
    axios.get('/validate/backendSend4Login.do').then(resp => {
        if (resp.data.status != null) {
            ElMessage.error('获取失败 - 系统内部错误')
            return;
        } else if (resp.data.code != '200') {
            ElMessage.error('获取失败 - ' + resp.data.msg)
            return;
        } else {
            countdown()
            ElMessage.success('获取成功')
        }
    })
}

// 获取验证码倒计时
const getCodeButton = ref('获取验证码')
const isGetCodeButtonDisabled = ref(false)
function countdown() {
    isGetCodeButtonDisabled.value = true
    let count = 60
    const timer = setInterval(() => {
        count--
        getCodeButton.value = count + 's'
        if (count <= 0) {
            clearInterval(timer)
            getCodeButton.value = '获取验证码'
            isGetCodeButtonDisabled.value = false
        }
    }, 1000)
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