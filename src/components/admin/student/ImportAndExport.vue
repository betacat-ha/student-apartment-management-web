<template>
    <el-row>
        <div style="display: flex; align-items: center;">
            从数据库导出Excel文件：
            <el-button @click="exportStudent()">导出</el-button>
        </div>
    </el-row>
    <br />
    <el-row>
        <div style="display: flex; align-items: center;">
            将Excel文件导入数据库：
            <el-button>选择文件</el-button>
            <el-button disabled>导入</el-button>
        </div>
    </el-row>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';

const exportStudent = () => {
    const fileName = "学生数据.xlsx"
    axios({
        method: 'get',
        url: '/student/export',
        responseType: 'blob',
        headers: {
            'access-control-allow-headers': 'Authorization, Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, X-File-Type, Cache-Control, Origin',
            'access-control-allow-methods': 'GET, POST, OPTIONS, PUT, DELETE',
            'access-control-expose-headers': 'Authorization',
            'Content-Type': 'application/json; charset=UTF-8',
            'Token': JSON.stringify(localStorage.getItem('token'))
        }
    }).then((res) => {
        const blob = new Blob([res],  { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        let brower = '';
        if (navigator.userAgent.indexOf('Edge') > -1) {
            brower = 'Edge'
        }
        if ('download' in document.createElement('a')) {
            if (brower === 'Edge') {
                navigator.msSaveBlob(blob, fileName);
                return
            }
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName);
            if (!document.getElementById(fileName)) {
                document.body.appendChild(link);
            }
            link.click();
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link)
        } else {
            //IE10+下载
            navigator.msSaveBlob(blob, fileName)
        }
        
        ElMessage.success("下载成功！");
    }).catch(error => {
        console.log(error)
    })
}
</script>