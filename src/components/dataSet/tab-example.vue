<template>
  <div class="child">
    <div class="create-title">字段信息</div>
    <div class="btn-group-add" v-if="!disabled" @click="handleAdd">
      <img class="img-addExp" src="../../assets/images/add.png" alt="" />
      <div class="btn-addExp">添加取数逻辑</div>
    </div>
  </div>

  <div class="block-line"></div>
    <a-spin v-if="spinning" :spinning="spinning"></a-spin>
    <a-tabs
      hide-add
      v-else
      style="margin-top:24px"
      v-model:activeKey="activeKey"
      type="card"
      >
        <a-tab-pane v-for="pane in demandArr" :key="pane.id" :tab="pane.title" :closable="pane.closable">
          <Example
            v-if="!disabled"
            :id="pane.id"

            :childData="pane"
            ref="childRef"
          />
          <ReadOnlyExample
            v-else
            :id="pane.id"
            :childData="pane"
            ref="childRef"
          />
        </a-tab-pane>

    </a-tabs>


</template>
<script lang="ts">
import { defineComponent, UnwrapRef, reactive, ref, PropType, toRefs } from "vue";
import { notification } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import Example from "./edit-example.vue";
import ReadOnlyExample from "./readonly.vue";
import { getDraftInfo,getOnlineInfo } from "@/api/index";

interface IState{
  spinning:boolean;
  demandArr:IDemand[]
}

interface IDemand{
  id?:string;
  title?: string;
  parent_id?: string;
  closable?: boolean;
  data_id?: string;
  demand_link?: string;
  demand_name?: string;
  demand_remark?: string;
  sql?: string;
  column_name?: Array<{
    category_name: string;
    column_name: string;
    column_comment: string;
    caliber_desc: string;
    aggregate_mode: string;
    example_value: string;
  }>;
}
export default defineComponent({
  name: "TabsExample",
  components: {
    Example,
    ReadOnlyExample,
  },
  props:{

    data:Object as PropType<Record<string, unknown>>,
  },
  setup: (props, { emit }) => {

    const route = useRoute();

    const disabled:boolean = route.query.disabled == '1' ? true :false
    const state:IState = reactive({
      spinning:false,
      demandArr:[{
        title: '子需求 0',
        id:"0",
        closable: false
      }]
    })
    const action = route.query && route.query.action
    const id = route.query && route.query.id
    const base_info_id = route.query && route.query.base_info_id
    if(id !== undefined && action !== 'create'){
        state.spinning = true
        getDraftInfo(id).then(res=>{

        if (res.status_code == 10000) {
          const data = res.data
          state.demandArr = data.demand_info
          state.spinning = false
          if(data.demand_info === null){
            state.demandArr = [{
              title: '子需求 0',
              id:"0",
              closable: false
            }]
          }else{

            state.demandArr.forEach((item:IDemand)=>{
              item.title =`子需求`+ item.id
            })
          }
        }
      })
    }else if(base_info_id !== undefined && action !== 'create'){
        state.spinning = true
        getOnlineInfo(base_info_id).then(res=>{
        if (res.status_code == 10000) {
          const data = res.data
          state.demandArr = data.demand_info
          state.spinning = false
          if(data.demand_info === null){
            state.demandArr = [{
              title: '子需求 0',
              id:"0",
              closable: false
            }]
          }else{
            state.demandArr.forEach((item:IDemand)=>{
              item.title =`子需求`+ item.id
            })
          }
        }
      })
    }

    const activeKey = route.params ? ref(state.demandArr[0].id) : ref(0)

    const newTabIndex = ref(1);

    const handleAdd = () =>{
      activeKey.value = `${newTabIndex.value++}`;
      state.demandArr.push({
        title: `子需求 ${activeKey.value}`,
        parent_id:state.demandArr[0].parent_id,
        id: activeKey.value,
      });
    };
    const remove = (targetKey: string) => {
      let lastIndex = 0;
      state.demandArr.forEach((pane, i) => {
        if (pane.id === targetKey) {
          lastIndex = i - 1;
        }
      });
      state.demandArr = state.demandArr.filter(pane => pane.id !== targetKey);
      if (state.demandArr.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
          activeKey.value = state.demandArr[lastIndex].id;
        } else {
          activeKey.value = state.demandArr[0].id;
        }
      }
    };

    const onEdit = (targetKey: string) => {
      if(!disabled){
        remove(targetKey);
      }else{
        notification['error']({
          message: '无效操作',
        });
      }

    };


    return {
      ...toRefs(state),
      activeKey,

      disabled,

      onEdit,
      handleAdd,

    };
  },
});
</script>
<style lang="less" scoped>
.child{
  display: flex;
  justify-content: space-between;
}
.create-title {
  font-size: 16px;
  font-weight: 600;
}
.block-line {
  height: 1px;
  background-color: #f0f0f0;
  margin-top: 24px;
}

.btn-group-add {
  display: flex;
  height: 35px;
  line-height: 35px;

  cursor: pointer;
}
.img-addExp {
  width: 25px;
  height: 25px;
  margin: 5px;
}
.btn-addExp {
  font-size: 14px;
  font-weight: 600;
  color: #002766;
}

</style>
