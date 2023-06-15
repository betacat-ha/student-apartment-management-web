import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Welcome from "../components/admin/Welcome.vue";
import AdminView from '../views/AdminView.vue'
import StudentList from "../components/admin/student/StudentList.vue";
import Login from '../components/Login.vue'
import WAEUsage from '../components/admin/waterAndElectricity/WAEUsage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "LoginView",
    component:Login
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
      }
    ]
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