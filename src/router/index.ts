import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Welcome from "../components/admin/Welcome.vue";
import AdminView from '../views/AdminView.vue'
import StudentList from "../components/admin/student/StudentList.vue";
import Login from '../components/Login.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin",
    name: "AdminView",
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
    path: "/login",
    name: "LoginView",
    component:Login
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.name !== 'LoginView' && !token) next({name: 'LoginView'}) 
  else next()
})

export default router;