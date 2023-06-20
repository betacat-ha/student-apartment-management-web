import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Welcome from "../components/admin/Welcome.vue";
import AdminView from '../views/AdminView.vue'
import StudentList from "../components/admin/student/StudentList.vue";
import LoginView from '../views/LoginView.vue'
import WAEUsage from '../components/admin/waterAndElectricity/WAEUsage.vue'
import WAEBill from '@/components/admin/waterAndElectricity/WAEBill.vue'
import BuildingList from '../components/admin/building/BuildingList.vue'
import UserList from '../components/admin/user/UserList.vue'
import StudentView from '@/views/StudentView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "LoginView",
    component:LoginView
  },
  {
    path: "/admin",
    name: "AdminView",
    component: AdminView,
    children: [
      {
        path: '',
        name: 'Welcome',
        component: Welcome
      },
      {
        path: "student-list",
        name: "StudentList",
        component: StudentList
      },
      {
        path: "wae-usage",
        name: "WAEUsage",
        component: WAEUsage
      },
      {
        path: "wae-bill",
        name: "WAEBill",
        component: WAEBill
      },
      {
        path: "building-list",
        name: "BuildingList",
        component: BuildingList
      },
      {
        path: "user-list",
        name: "UserList",
        component: UserList
      }
    ]
  },
  {
    path: "/student",
    name: "StudentView",
    component:StudentView
  },
  

  

  // {path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../components/NotFound.vue')},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (to.name !== 'LoginView' && !token) next({name: 'LoginView'}) 
//   else next()
// })

export default router;