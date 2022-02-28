<template>
  <div class="normal">
    <!-- 筛选条件 -->
    <div class="select-header">
      <div class="tag-select">
        <div class="tag-name">选择标签:</div>
        <a-select
          v-model:value="typeValue"
          @change="changeList"
          style="width: 200px;margin-right:24px"
        >
          <a-select-option v-for="item in typeSource" :key="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </div>

      <a-tooltip title="在左侧选择对应标签，为您添加对应的表单" color="bule">
        <a-button type="primary" class="but" @click="handleModal('ADD')">
          + 新 建</a-button
        >
      </a-tooltip>
    </div>

    <!-- 表格 -->
    <a-table
      :data-source="tableList.arr"
      :columns="columns"
      :rowKey="(record,index)=>{return index}"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #operation="{ record }">
        <span @click="handleModal('EDIT', record)">
          <a> 编辑</a>
        </span>
        <span style="margin-left: 10px">
          <a-popconfirm
          @confirm="onDelete(record.id)"
          title="是否确认删除？"
          ok-text="确定"
          cancel-text="取消"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>

    <!-- 弹框 -->
    <a-modal
      v-model:visible="visible"
      :title="modalTit"
      @ok="handleModal"
      :footer="null"
      width="45%"
      destroyOnClose
    >
      <v-form
        :form="formConfig"
        :formData="formData"
        @onSubmit="handleSubmit"
        :reset="reset"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  toRaw,
} from "vue";
import VForm, { FormItem } from "./formModal/form.vue";
import {
  columnsAll,
  columnsTheme,
  columnsProcess,
  columnsSenario,
  IColumns,
  formAll,
  formTheme,
  formProcess,
  formScenario,
} from "./config";
import { notification } from "ant-design-vue";
import { getFilter } from '@/api/index'
import { getLabelList,addLabel,editLabel,delteLabel } from "@/api/label"
/**
 * 根据选择标签：配置对应的表格，表单
 */
const typeConfig: Record<
  string,
  { columns: Array<IColumns>; form: Array<FormItem> }
> = {
  TYPE_ALL: {
    columns: columnsAll,
    form: formAll,
  },
  TYPE_THEME: {
    columns: columnsTheme,
    form: formTheme,
  },
  TYPE_BUSIESS_PROCESS: {
    columns: columnsProcess,
    form: formProcess,
  },
  TYPE_BUSIESS_SCENARIO: {
    columns: columnsSenario,
    form: formScenario,
  },
};

type ObjectType = Record<string, unknown>;

export default defineComponent({
  components: {
    VForm,
  },

  setup() {
    const typeValue = ref<string>("TYPE_ALL"); // typeValue：下拉框value值
    let modalTit = ref<string>("新建弹框"); //modalTit：弹框标题
    let loading = ref<boolean>(false); //loading：表格加载
    const formData = ref<ObjectType>({}); // formData：回填数据
    const operateType = ref<string>(""); // operateType：判断为 编辑 还是 新建表单
    const listId = ref<unknown>(); // listId：列表每项的id
    const visible = ref<boolean>(false); // visible：弹框展示
    const reset = ref<boolean>(false);
    const tableList = reactive<{
      arr: ObjectType[];
      pagination: Record<string, unknown>;
    }>({
      arr: [],
      pagination: {},
    });
    const typeSource = [
      {
        label: "全部",
        value: "TYPE_ALL",
      },
      {
        label: "主题",
        value: "TYPE_THEME",
      },
      {
        label: "业务过程",
        value: "TYPE_BUSIESS_PROCESS",
      },
      {
        label: "业务场景",
        value: "TYPE_BUSIESS_SCENARIO",
      },
    ];

    const handleModal = (type: string, record: ObjectType) => {
      operateType.value = type;
      listId.value = toRaw(record) && toRaw(record).id;
      visible.value = !visible.value;
      if (type === "EDIT") {
        modalTit.value = "编辑弹框";
        formData.value = toRaw(record);
        reset.value = false;
      } else if (type === "ADD") {
        formData.value = {};
        reset.value = true;
      }
    };

    /**
     * 表格数据
     */
    onMounted(() => {
      feachTableList();
    });

    const feachTableList = (param?: Record<string, unknown>) => {
      loading.value = true;

      getLabelList({
          lable_type: typeValue.value,
          page: 1,
          page_size: 10,
          ...param
      }).then(res=>{
          console.log('res.status_code',res.status_code)
          if (res.status_code === 10000) {
            loading.value = false;
            const { total, from, to, current_page } = res.data;
            tableList.arr = res.data.data;
            tableList.pagination = { total, from, to, current_page };
          }
      })
    };

    /**
     * 切换标签筛选项
     */
    const changeList = () => {
      feachTableList();
      if (typeValue.value === "TYPE_BUSIESS_PROCESS") {
        getFilter().then(res=>{
          if (res.status_code === 10000) {
            res.data.TYPE_THEME.forEach(
              (item: Record<string, unknown>) => {
                item.value = JSON.stringify(item.value);
              }
            );
            formProcess[1].selectList = res.data.TYPE_THEME;
          }
        })
      }

    };

    /**
     * 弹窗新增or编辑保存
     */
    const handleSubmit = (params: Record<string, unknown>) => {
      params.lable_type = typeValue.value;
      if (operateType.value === "ADD") {
          addLabel(params).then(res=>{
            if (res.status_code === 10000) {
              notification['success']({
                message: '新增成功',
              });
              feachTableList();
              setTimeout(() => {
                visible.value = false;
              }, 500);
            }
          })
      } else if (operateType.value === "EDIT") {
        params.id = listId.value;
        editLabel(params).then(res=>{
          if (res.status_code === 10000) {
              notification['success']({
                message: '编辑成功',
              });
              feachTableList();
              setTimeout(() => {
                visible.value = false;
              }, 500);
            }
        })
      }
    };

    /**
     * 表格配置
     */
    const columns = computed(() => {
      return typeConfig[typeValue.value].columns;
    });

    /**
     * 表格操作
     */
    const onDelete = (id: string) => {
      delteLabel({id}).then(res=>{
        if (res.status_code === 10000) {
            feachTableList();
            notification['success']({
                message: '删除成功',
            });
          }
      })
    };

    /**
     * 分页
     */
    const pagination = computed(() => ({
      total: toRaw(tableList.pagination).total,
      current: toRaw(tableList.pagination).current_page,
      pageSize: 10,
    }));
    const handleTableChange = (pag: Record<string, number>) => {
      feachTableList({ page: pag.current });
    };

    /**
     * 弹窗表单配置
     */
    const formConfig = computed(() => {
      return typeConfig[typeValue.value].form;
    });

    return {
      /** 标签 */
      typeValue,
      typeSource,

      /** 表格 */
      columns,
      onDelete,
      tableList,
      loading,
      changeList,
      pagination,
      handleTableChange,

      /** 弹窗 */
      modalTit,
      visible,
      handleModal,
      reset,

      /** 弹窗配置和提交 */
      formConfig,
      formData,
      handleSubmit,
    };
  },
});
</script>
<style lang="less" scoped>
.ant-table-wrapper {
  margin-top: 30px;
}
.normal {
  .select-header {
    position: relative;
    .but {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}

.tag-select {
  display: flex;
  align-items: center;
  .tag-name {
    width: 80px;
  }
  .ant-select {
    width: 200px;
  }
}
</style>
