import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "../store";

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
        component: () => import("../views/Home.vue")
      },
      {
        path: "/manager",
        name: "Manager",
        component: () => import("../components/Main.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/user",
        // 命名
        name: "User",
        component: () => import("../views/user/Center.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/user/registers",
        // 命名
        name: "Register",
        component: () => import("../views/user/Registers.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "/user/changepass",
        // 命名
        name: "Changepass",
        component: () => import("../views/user/Changepass.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/user/resetpass",
        // 命名
        name: "Resetpass",
        component: () => import("../views/user/Resetpass.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/user/editprofile",
        // 命名
        name: "Editprofile",
        component: () => import("../views/user/Editprofile.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/user/profile/:id",
        // 命名
        name: "Profile",
        component: () => import("../views/user/Profile.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/user/shuzhi",
        name: "Shuzhi",
        component: () => import("../views/user/Shuzhi.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/user/all",
        // 命名
        name: "All",
        component: () => import("../views/user/All.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/api-debug',
        name: 'ApiDebug',
        component: () => import('../views/ApiDebugPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/agent/:id',
        name: 'CozeAgent',
        component: () => import('../views/CozeChat.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/agents',
        name: 'CozeAgentList',
        component: () => import('../views/CozeAgentList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/courses',
        name: 'Courses',
        component: () => import('../views/Courses.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/study',
        name: 'Study',
        component: () => import('../views/Study.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/Admin.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
    ]
  },

  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("../views/ResetPassword.vue"),
    meta: { guest: true }
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue")
  }

];

const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes,
});

// 导航守卫：验证用户认证状态
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // pinia-use-persist 会在初始化时自动恢复状态
  // 直接使用持久化的状态，不需要手动初始化

  const isAuthenticated = userStore.logined && !!userStore.atoken
  const userRole = userStore.role || 'user'
  const isAdmin = userStore.id === 1 || userRole === 'admin'

  // 需要认证的路由
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // 未登录，打开登录对话框
      userStore.dialogFormVisible = true
      next({ name: "Home" })
      return
    }

    // 需要管理员权限
    if (to.meta.requiresAdmin && !isAdmin) {
      next({ name: "Home" })
      return
    }
  }

  next()
})

export default router;