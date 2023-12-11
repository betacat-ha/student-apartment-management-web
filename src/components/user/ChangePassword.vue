<template>
    <div>
        <el-form ref="loginFormRef" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="用户名" prop="email" :style="props.hideEmailInput ? 'display:none' : ''">
                <el-input v-model="form.email" autofocus :disabled="props.disableEmailInput"/>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" />
            </el-form-item>
            <el-form-item label="短信验证码" prop="verifyCode">
                <el-input v-model="form.verifyCode">
                    <template #append>
                        <el-button @click="getVerifyCode" :disabled="isGetCodeButtonDisabled">{{ getCodeButton
                        }}</el-button>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm(loginFormRef)" :loading="isloading">提交</el-button>
                <el-button @click="clearInput">重置</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>
   
<script setup lang="ts">
import { FormInstance, FormRules, ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { nextTick, reactive, ref, registerRuntimeCompiler } from "vue";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";

// 接收传入参数
interface Props {
    email: string
    disableEmailInput: boolean
    hideEmailInput: boolean
}
const props = withDefaults(defineProps<Props>(), {
    email: '',
    disableEmailInput: false,
    hideEmailInput: false
})

console.log(props.email)

const success = defineEmits(["success"]);
const onSuccess = () => {
  success('success');
}

const isloading = ref(false);

ref(false);

// 表单数据
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码！'))
    } else if (value !== form.newPassword) {
        callback(new Error("密码不一致！"))
    } else {
        callback()
    }
}
const form = reactive({
    email: props.email,
    newPassword: "",
    confirmPassword: "",
    verifyCode: "",
});
const loginFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
    email: [{ required: true, message: "请输入用户名！", trigger: "blur" }],
    newPassword: [{ required: true, message: "请输入密码！", trigger: "blur" }],
    confirmPassword: [{ required: true, validator: validatePass, trigger: "blur" }],
    verifyCode: [{ min: 4, max: 4, required: true, message: "请输入4位验证码！", trigger: "blur" }],
});

// 表单提交操作
const submitForm = async (formEl: FormInstance | undefined) => {
    isloading.value = true;
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            axios.post("/auth/resetPwd", form).then((resp) => {
                isloading.value = false;
                if (resp.data.code != '200') {
                    ElMessage.error('失败 - ' + resp.data.msg)
                    return;
                }
                ElMessageBox.alert('密码修改完成', '成功', {
                    confirmButtonText: '确定'
                })
                clearInput();
                onSuccess();
            }).catch(err => {
                isloading.value = false;
                ElMessageBox.alert('系统内部错误，请联系管理员', '失败', {
                    confirmButtonText: '确定'
                })
            })
        } else {
            isloading.value = false;
            console.log("error submit!");
        }
    });
};

// 获取验证码
function getVerifyCode() {
    axios.get('/validate/Send4ResetPwd.do?email=' + form.email).then(resp => {
        if (resp.data.status != null) {
            ElMessage.error('获取失败 - 系统内部错误')
            return;
        } else if (resp.data.code != '200') {
            ElMessage.error('获取失败 - ' + resp.data.msg)
            return;
        } else {
            countdown()
            props.disableEmailInput = true;
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

// 清除输入的内容
const clearInput = () => {
    form.confirmPassword = ''
    form.newPassword = ''
    form.verifyCode = ''
}

</script>
   
<style scoped></style>
  