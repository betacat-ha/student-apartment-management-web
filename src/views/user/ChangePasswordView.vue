<template>
    <div style="display: grid; justify-content: left;">
        <changePassword :hideEmailInput="true" :email="user?.email" />
    </div>
    
</template>

<script lang="ts" setup>
import changePassword from '@/components/user/ChangePassword.vue'
import { ref } from 'vue';
import axios from "axios";
interface User {
    id: number;
    name: string;
    email: string;
}

const user = ref<User>();
axios.get("/user/current").then((res) => {
    user.value = res.data.data;
    console.log(user.value?.email)
})
    .catch(err => { console.log(err) });

</script>