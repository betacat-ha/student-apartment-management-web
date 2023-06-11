import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Welcome from "../components/admin/Welcome.vue";
import AdminView from '../views/AdminView.vue'
import StudentList from "../components/admin/student/StudentList.vue";
import Login from '../components/Login.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin",
    component: AdminView,
    children: [
      {
        path: '',
        component: Welcome
      },
      {
        path: "student-list",
        component: StudentList
      }
    ]
  },
  {
    path: "/",
    component:Login,
    children: [
      {
        path: "/student-list",
        component: StudentList
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;