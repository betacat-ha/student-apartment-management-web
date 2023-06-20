<template>
  <el-form
    ref="loginFormRef"
    :model="form"
    label-width="120px"
    :rules="rules"
    @keyup.enter.native="submitForm(loginFormRef)"
  >
    <el-form-item label="用户名" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(loginFormRef)"
        >登录</el-button
      >
      <el-link type="primary" @click="forgetPassword" style="margin-left: 8px"
        >忘记密码？</el-link
      >
    </el-form-item>
  </el-form>
</template>
  
  <script lang="ts" setup>
import { FormInstance, FormRules, ElLoading, ElMessage } from "element-plus";
import { nextTick, reactive, ref } from "vue";
import  router  from "../router";
import axios from "axios";
import store from "@/store";

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
      axios.post("http://localhost:8088/api/login", form).then((resp) => {
        if (resp.data.status != null) {
            ElMessage('登录失败 - 系统内部错误')
            return;
        } else if (resp.data.code != '200') {
            ElMessage('登录失败 - ' + resp.data.msg)
            return;
        }
        console.log(resp.data.data)
        store.state.token = resp.data.data
        localStorage.setItem('token', resp.data.data)
        // router.push('/admin')
      });
    } else {
      console.log("error submit!");
    }
  });
};

// 忘记密码操作
function forgetPassword() {
  console.log("忘记密码啦！");
}
</script>