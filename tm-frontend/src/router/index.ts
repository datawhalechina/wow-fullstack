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
            path: "/course",
            // 命名
            name: "Course",
            component: () => import("../views/course/Course.vue"),
        },
        {
            path: "/course/edit",
            // 命名
            name: "Editcourse",
            component: () => import("../views/course/Edit.vue"),
        },
        {
            path: "/articles",
            // 命名
            name: "Articles",
            component: () => import("../views/Articles.vue"),
        },
        {
          path: "/user",
          // 命名
          name: "User",
          component: () => import("../views/user/Center.vue"),
        },
        {
        path: "/user/registers",
          // 命名
          name: "Register",
          component: () => import("../views/user/Registers.vue"),
        },
        {
          path: "/user/changepass",
          // 命名
          name: "Changepass",
          component: () => import("../views/user/Changepass.vue"),
        },
        {
          path: "/user/editprofile",
            // 命名
            name: "Editprofile",
            component: () => import("../views/user/Editprofile.vue"),
        },
        {
          path: "/user/profile/:id",
            // 命名
            name: "Profile",
            component: () => import("../views/user/Profile.vue"),
        },
        {
          path: "/user/learn",
          // 命名
          name: "Learn",
          component: () => import("../views/user/Learn.vue"),
        },
        {
          path: "/user/supervise",
          // 命名
          name: "Supervise",
          component: () => import("../views/user/Supervise.vue"),
        },
    ]
  },
  
  
  
];
 
const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes,
});
 
export default router;