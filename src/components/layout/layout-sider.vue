<template>
  <a-layout-sider width="200" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
    <div class="logo" >
        数据集管理平台
        <!-- <img src="https://public-cdn.mokahr.com/1fd7de6e-9133-4a91-bb2c-c6a8e7196bff.png" /> -->
    </div>
    <a-menu
      theme="dark"
      mode="inline"
      :openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      @click="selectItem"
      @openChange="onOpenChange"
    >
      <a-sub-menu v-for="subitem in menu" :key="subitem.path">
        <template #title>
          <!-- <Icon-font :type="subitem.icon" /> -->
          <span>{{ subitem.name }}</span>
        </template>
        <a-menu-item v-for="item in subitem.children" :key="item.path">{{
          item.name
        }}</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  ref,
  UnwrapRef,
  reactive,
  getCurrentInstance,
} from "vue";

import { Router, useRouter } from "vue-router";

interface IMenu {
  name: string;
  icon: string;
  path: string;
  component: string;
  children?: Array<{
    name: string;
    icon: string;
    path: string;
    component: string;
  }>;
}



interface IBreadcrumb {
  name: string;
  path: string;
}

interface IState {
  openKeys: string[];
  rootSubmenuKeys: string[];
  selectedKeys: string[];
  menu:IMenu[]
}

export default defineComponent({
  name: "LayoutSider",
  setup(props, context) {
    const menu = ref<IMenu[]>([
      {
        name: "数据集管理",
        icon: "",
        path: "/dataSet",
        component: "dataSet",
        children: [
          {
            name: "创建数据集",
            icon: "",
            path: "/dataSet/create",
            component: "",
          },
          {
            name: "数据集列表",
            icon: "",
            path: "/dataSet/list",
            component: "",
          },
          {
            name: "草稿箱",
            icon: "",
            path: "/dataSet/drafts",
            component: "",
          },
          {
            name: "服务审核",
            icon: "",
            path: "/dataSet/audit",
            component: "",
          },
        ],
      },
      {
        name: "配置管理",
        icon: "",
        path: "/config",
        component: "config",
        children: [
          {
            name: "业务标签",
            icon: "",
            path: "/config/normal",
            component: "",
          },
        ],
      },
    ]);
    const { proxy }  = getCurrentInstance() as any;
    const selected: string = proxy.$router.currentRoute && proxy.$router.currentRoute.value.path;

    const state: UnwrapRef<IState> = reactive({
      openKeys: ["/dataSet"],
      rootSubmenuKeys: ["/dataSet", "/config"],
      selectedKeys: [selected],
      menu:menu
    });

    // 获取路由器实例
    const router: Router = useRouter();

    // // 路由数据重新封装
    // const routerPackag = (routers: IMenu[]) => {
    //   routers.filter((itemRouter) => {
    //     if (itemRouter.component != "dataSet") {
    //     console.log('itemRouter',itemRouter) // 路由溢出
    //     router.addRoute("dataSet/create", {
    //       path: `${itemRouter.path}`,
    //       name: itemRouter.name,
    //       component: () => import(`@/${itemRouter.component}`),
    //     });
    //   }
    //     console.log('itemRouter',itemRouter)
    //     // 是否存在子集
    //     if (itemRouter.children && itemRouter.children.length) {
    //       routerPackag(itemRouter.children);
    //     }
    //     return true;
    //   });
    // };
    // routerPackag(state.menu);
    // 菜单点击事件
    const selectItem = (item: any) => {
      router.push({
        path: item.key,
      });

    };
    // 处理菜单展开 - 只展开一个菜单
    const onOpenChange = (openKeys: string[]) => {

      const latestOpenKey = openKeys.find(
        (key) => state.openKeys.indexOf(key) === -1
      );
      if (state.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
        state.openKeys = openKeys;
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    };

    return {
      selectItem,
      onOpenChange,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="less">
.logo{
    height: 64px;
    line-height: 64px;
    text-align: center;
    color:#e2e2e2;
    font-weight: 500;
    font-size: 20px;

    img{
        margin-top:14px;
        margin-left:14px;
        height: 36px;
    }
}
</style>
