import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
 
// 路由类型:RouteRecordRaw
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    // 命名
    name: "index",
    component: () => import("../components/Layout.vue"),
    children: [
        {
            path: "/",
            // 命名
            name: "Home",
            component: () => import("../views/Home.vue"),
        },
        {
            path: "/articles",
            // 命名
            name: "Articles",
            component: () => import("../views/Articles.vue"),
        },
    ]
  },
  {
    path: "/login",
    // 命名
    name: "Login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/register",
    // 命名
    name: "Register",
    component: () => import("../components/Register.vue"),
  },
  
];
 
const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes,
});
 
export default router;