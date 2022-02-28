<template>
  <a-layout>
    <LayoutSider></LayoutSider>
    <a-layout :style="{ marginLeft: '200px'}">
      <LayoutHeader></LayoutHeader>
      <LayoutContent />

    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import LayoutHeader from "@/components/layout//layout-header.vue";
import LayoutSider from "@/components/layout/layout-sider.vue";
import LayoutContent from "@/components/layout/layout-content.vue";


@Options({
  components: {
    LayoutHeader,
    LayoutSider,
    LayoutContent
  },
})
export default class Home extends Vue {

}
</script>
<style lang="less" scoped>

</style>
