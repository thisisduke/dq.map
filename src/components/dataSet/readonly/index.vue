<template>
  <a-table
    bordered
    :pagination="false"
    :rowKey="(record,index)=>{return index}"
    :data-source="dataSource"
    :columns="columns">
  </a-table>
</template>
<script lang="ts">
import { toRefs, defineComponent, reactive, PropType, Ref, ref, UnwrapRef } from "vue";
import { columns } from "./tableConfig";

interface IDataItem {
  key:string;
  column_name: string;
  category_name: string;
  caliber_desc: string;
  aggregate_mode: string;
  example_value: string;
}

export default defineComponent({
  name: "SQLEditable",
  props:{
    data:Array as PropType<IDataItem[]>,
  },
  setup(props) {
    const dataSource: Ref<IDataItem[]> = ref([]);

    if(props.data){
      dataSource.value = props.data && props.data
    }

    return {
      columns,
      dataSource
    };
  },
});
</script>
<style lang="less">
.editable-row-operations a {
  margin-right: 8px;
}
</style>
