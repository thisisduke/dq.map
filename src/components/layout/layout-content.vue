<template>
  <div :style="{
    margin:'88px 24px 24px 24px'
  }">
      <!-- <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>
          {{ breadcrumb }}
        </a-breadcrumb-item>
      </a-breadcrumb> -->
      <a-layout-content
        :style="{
          background: '#fff',
          margin: 0,
          padding:'24px',
          minHeight: '280px',
        }"
      >
        <router-view />
      </a-layout-content>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Router,useRoute,useRouter } from "vue-router";
export default defineComponent({
  name: "LayoutContent",
  
});
</script>

<style lang="less" scoped>
.header {
  color: white;
  line-height: 64px;
  font-size: 20px;
  font-weight: 600;
}
</style>
