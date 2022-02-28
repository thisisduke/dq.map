import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Login from "@/views/login.vue"
import Home from "@/views/index.vue";
import Error from "@/components/error/404.vue";

import Create from "@/components/dataSet/form-base.vue";
import CreateDetails from "@/components/dataSet/tab-example.vue";

import List from "@/views/dataSet/List.vue";
import VersionList from "@/components/dataSet/version/index.vue";
import Drafts from "@/views/dataSet/Drafts.vue";
import Audit from "@/views/dataSet/Audit.vue";
import Normal from "@/views/config/Normal.vue";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "登录",
    component: Login,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/",
    component: Home,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: "/dataSet/create",
        name: "create",
        component: Create,
        meta: {
          requireAuth: true,
        },
      },{

        path: "/dataSet/create/details",
        name: "details",
        component: CreateDetails,
        meta: {
          requireAuth: true,
        },

      },{
        path: "/dataSet/list",
        name: "list",
        component: List,
        meta: {
          requireAuth: true,
        },

      },{
        path: "/dataSet/drafts",
        name: "drafts",
        component: Drafts,
        meta: {
          requireAuth: true,
        },
      },{
        path: "/dataSet/audit",
        name: "audit",
        component: Audit,
        meta: {
          requireAuth: true,
        },
      },{
        path: "/config/normal",
        name: "normal",
        component: Normal,
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: Error,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
