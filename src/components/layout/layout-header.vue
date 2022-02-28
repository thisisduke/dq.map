<template>
  <a-layout-header  :style="{ position: 'fixed', zIndex: 1, width: '100%',color:'#fff' }">
    <div class="user" @click="handleLoginOut">

      <span class="loginout">退出登录</span>
      <svg t="1624590254812" class="icon" viewBox="0 0 1024 1024" version="1.1"
      xmlns="http://www.w3.org/2000/svg" p-id="2251" width="20" height="20"><path d="M85.333333 469.333333h418.133334v85.333334H85.333333z" p-id="2252" fill="#e2e2e2"></path><path d="M360.533333 765.866667l-59.733333-59.733334 194.133333-194.133333-194.133333-194.133333 59.733333-59.733334L614.4 512z" p-id="2253" fill="#e2e2e2"></path><path d="M938.666667 938.666667H512v-85.333334h341.333333V170.666667H512V85.333333h426.666667z"
      p-id="2254" fill="#e2e2e2"></path></svg>
    </div>

  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Router, useRouter } from 'vue-router';
export default defineComponent({
  name: "LayoutHeader",
  setup() {

    const router:Router = useRouter()
    const handleLoginOut =()=>{
      localStorage.clear();
      router.push('/login')
    }
    return{
      handleLoginOut
    }
  }
});
</script>

<style lang="less" scoped>
.user{
  position: absolute;
  right: 240px;
  cursor: pointer;
}
.loginout{
  font-size: 14px;
  font-weight: 400;

}
.icon{
  position: relative;
  top:5px;
  left:5px
}
</style>
