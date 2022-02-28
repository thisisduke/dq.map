<template>
    <a-button
      class="editable-add-btn"
      @click="handleAdd"
      style="margin-bottom: 8px"
      >添加</a-button
    >
    <a-table
      bordered
      :rowKey="(record,index)=>{return index}"
      :data-source="tableData"
      :pagination="false"
      :columns="columns">

      <template #column_name="{record}">
        <div class="global-search-wrapper" style="width: 300px">
          <a-auto-complete
            class="global-search"
            size="large"
            style="width: 100%"
            placeholder="请输入关键字搜索"
            option-label-prop="title"
            v-model:value="record.column_name"
            @select="onSelect"
            @search="handleSearch"
            @change="handleChange(record.key)"
          >
            <template #dataSource>
              <a-select-option v-for="item in dataSource" :key="item.column_name" :title="item.column_name">
                {{ item.column_name }}
              </a-select-option>
            </template>
            <a-input>
              <template #suffix><search-outlined class="certain-category-icon" /></template>
            </a-input>
          </a-auto-complete>
        </div>
      </template>
      <template
        v-for="col in editType"
        #[col]="{ text,record }" :key="col">
        <div>
          <a-input
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key][col]"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template #operation="{ record }">
        <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a @click="handleSave(record.key)">保存</a>
            <a-popconfirm title="确定取消编辑内容吗？" @confirm="handleCancel(record.key)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>

            <a @click="handleEdit(record.key)">编辑</a>
            <a-popconfirm
              v-if="tableData.length"
              title="确定删除本条信息吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record.key)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </div>

      </template>
    </a-table>
</template>
<script lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue';
import { toRefs, defineComponent, reactive, PropType, Ref, ref, UnwrapRef } from "vue";
import { cloneDeep } from "lodash-es";
import { columns } from "./tableConfig";
import { getColumnInfo } from '@/api/index'

interface Option {
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
    disabled:Boolean,
    data:Array as PropType<Option[]>,
  },
  components: {
    SearchOutlined,
  },
  setup(props) {
    const value = ref('');
    const dataSource = ref<Option[]>([]);

    //table-data
    const tableData: Ref<Option[]> = ref([]);

    if(props.data){
      tableData.value = props.data && props.data
    }

    const activeKey = tableData.value[0] ? ref(tableData.value[0].key) : ref(0);

    const editType = [
      'category_name',
      'caliber_desc',
      'aggregate_mode',
      'example_value'
    ]

    const editableData: UnwrapRef<Record<string, Option>> = reactive({});

    const onSelect = (value: string) => {
      const index = Number(activeKey.value)
      dataSource.value.map(item=>{
          if(item.column_name == value){
            tableData.value[index].column_name = value
            tableData.value[index].category_name = item.category_name
            tableData.value[index].caliber_desc = item.caliber_desc
            tableData.value[index].aggregate_mode = item.aggregate_mode
            tableData.value[index].example_value = item.example_value
          }
        })
    };


    const getTableData = ( value : string)=>{
      getColumnInfo(value).then(res=>{
        if (res.status_code == 10000) {
          dataSource.value = res.data.column_data
        }
      })
    }

    const handleSearch = (value: string) => {
      getTableData(value)
    };

    const handleChange = (value: string) => {
      activeKey.value = value
    };


    //table op
    const handleEdit = (key: string) => {
      editableData[key] = cloneDeep(tableData.value.filter(item => key === item.key)[0]);
    };
    const handleSave = (key: string) => {
      Object.assign(tableData.value.filter(item => key === item.key)[0], editableData[key]);
      delete editableData[key];
    };
    const handleCancel = (key: string) => {
      delete editableData[key];
    };

    const handleDelete = (key: string) => {
      tableData.value = tableData.value.filter((item) => item.key !== key);
    };


    const newTabIndex = ref(0);

    const handleAdd = () => {
      activeKey.value = `${newTabIndex.value++}`;

      tableData.value.forEach(item=>{

        if(item.key == activeKey.value){
          activeKey.value = `${newTabIndex.value++}`;
        }
      })


      const newData = {
        key: activeKey.value,
        column_name: "",
        category_name: "",
        caliber_desc: "",
        aggregate_mode: "",
        example_value: "",
      };
      dataSource.value = []
      tableData.value.push(newData);
    };

    return {
      columns,
      editType,

      tableData,
      dataSource,
      editableData,

      onSelect,
      handleSearch,

      handleAdd,
      handleDelete,
      handleChange,

      handleCancel,
      handleEdit,
      handleSave,
    };
  },
});
</script>
<style>
.global-search-wrapper {
  padding-right: 50px;
}

.global-search {
  width: 100%;
}

.global-search.ant-select-auto-complete .ant-select-selection--single {
  margin-right: -46px;
}

.global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input:not(:last-child) {
  padding-right: 62px;
}

.global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.global-search-item {
  display: flex;
}

.global-search-item-desc {
  flex: auto;
  text-overflow: ellipsis;
  overflow: hidden;
}

.global-search-item-count {
  flex: none;
}
</style>
