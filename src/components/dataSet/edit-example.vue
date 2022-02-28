<template>

  <!-- 子需求 -->
  <div class="tab-content">
    <a-form
    :model="formState"
    :label-col="labelCol"
    :wrapper-col="wrapperCol">

      <a-row>
        <a-col :span="12">
          <a-form-item label="数据ID"  v-bind="validateInfos.data_id">
            <a-input
            v-model:value="formState.data_id"
            placeholder="请输入数据ID" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="需求链接"  v-bind="validateInfos.demand_link">
            <a-input
              v-model:value="formState.demand_link"
              placeholder="请输入需求链接"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-item label="子需求名称"  v-bind="validateInfos.demand_name">
            <a-input
              v-model:value="formState.demand_name"
              placeholder="请输入子需求名称"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12" >
          <a-form-item
            :wrapper-col="{ span: 18 }"
            label="详细描述"
             v-bind="validateInfos.demand_remark"
          >
            <a-textarea
              :auto-size="{ minRows: 5 }"
              v-model:value="formState.demand_remark"
              placeholder="请输入子需求描述"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <div class="block-line"></div>

      <textarea
      :id="editID"

      @change="editTextarea"
      style="display: none" />

      <div class="block-line"></div>


      <SQLEditable
        :data="dataSource"
        ref="editRef"
      />

      <a-row style="justify-content: flex-end">
        <div class="btn-group">
          <a-button type="primary" @click="handleOperation(0)">保存</a-button>
          <a-button type="primary" @click="handleOperation(1)">提交</a-button>
          <a-button @click="resetFields"
            >取消</a-button
          >
        </div>
      </a-row>
    </a-form>

  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, toRaw, ref, reactive, UnwrapRef, nextTick, toRefs } from "vue";
import { useForm } from "@ant-design-vue/use";
import CodeMirror from "codemirror";
import { notification } from 'ant-design-vue';
import SQLEditable from "./editable/index.vue";
import { useRoute } from 'vue-router';
import { saveDemandInfo } from "@/api/index";
import { constant } from "lodash";

interface IFormState {
  data_id: string;
  demand_link: string;
  demand_name: string;
  demand_remark: string;
}

interface IDemand{
  id:string;
  parent_id:string;
  data_id: string;
  demand_link: string;
  demand_name: string;
  demand_remark: string;
  sql: string;
  column_name: IColumnName[];
}

interface  IColumnName{
    category_name: string;
    column_name: string;
    column_comment: string;
    caliber_desc: string;
    aggregate_mode: string;
    example_value: string;
}

export default defineComponent({
  name: "ReadOnlyExample",
  components: {
    SQLEditable,
  },
  props:{
    id:String,
    spining:Boolean,
    childData:Object as PropType<IDemand>,
  },
  setup: (props,{ emit }) => {
    const editRef = ref()
    const route = useRoute();


    const formState: UnwrapRef<IFormState> = reactive({
      data_id: "",
      demand_link: "",
      demand_name: "",
      demand_remark: "",
    });


    let editID = `editDom`+props.id
    let editor:any

    nextTick(() => {
      let editDom = document.getElementById(editID);

      editor = CodeMirror.fromTextArea(editDom as HTMLTextAreaElement, {
        lineNumbers: true,
        tabSize: 2,
        theme: "ayu-mirage",
      });
      editor.getDoc().setValue(props.childData?.sql)
      editor.refresh()
    });

    let dataSource:IColumnName[] = reactive([])

    // 验证
    const rulesRef = reactive({

      data_id: [
        {

          required: true,
          message: "请输入数据ID",
        }
      ],demand_link: [
        {

          required: true,
          message: "请输入需求链接",
        }
      ],demand_name: [
        {

          required: true,
          message: "请输入子需求名称",
        }
      ],demand_remark: [
        {

          required: true,
          message: "请输入子需求描述",
        }
      ],
    });
    const { validate, validateInfos } = useForm(formState, rulesRef);
    console.log('props.childData',props.childData)
    if(props.childData){
      formState.data_id = props.childData && props.childData.data_id
      formState.demand_link = props.childData && props.childData.demand_link
      formState.demand_name = props.childData && props.childData.demand_name
      formState.demand_remark = props.childData && props.childData.demand_remark
      dataSource = props.childData && props.childData.column_name

    }

    const handleOperation = (type:number)=>{

      validate().then((record: IFormState) => {
        const id = props.id

        const parent_id = route.query.parent_id === undefined ? (props.childData && props.childData.parent_id) : route.query.parent_id
        console.log('parent_id',parent_id)
        const sql = editor && editor.getValue()
        const column_name = editRef.value.tableData.filter((item:any) => item.column_name !== "");




        let params:Record<string, unknown> = {
            id,
            parent_id,
            is_submit:type,
            data_id: record.data_id,
            demand_link: record.demand_link,
            demand_name: record.demand_name,
            demand_remark: record.demand_remark,
            sql,
            column_name,
        }

        console.log('params',params)


        let successInfo:string = ""
        let errorInfo:string = ""
        switch (type) {
          case 0:
            successInfo = "当前子需求已成功保存到草稿箱"
            errorInfo = "当前子需求保存失败"
            break;
          case 1:
            successInfo = "当前子需求已提交到服务审核"
            errorInfo = "当前子需求提交到服务审核失败"
            break;
        }
        saveDemandInfo(params).then(res=>{
          console.log('res',res)
          if (res.data.code) {
            notification['success']({
              message: successInfo,
            });
          }else{
            notification['error']({
              message: errorInfo,
            });
          }
        })
      })
    }


    return {
      editID,
      editRef,

      labelCol: { span: 6 },
      wrapperCol: { span: 12 },

      formState,
      dataSource,
      validateInfos,
      handleOperation,

    };
  },
});
</script>
<style lang="less" scoped>
@import "~@/assets/css/codemirror.css";

.tab-content {
  margin-top: -16px;
  padding: 20px;
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}
.create-title {
  font-size: 16px;
  font-weight: 600;
}
.block-line {
  height: 1px;
  background-color: #f0f0f0;
  margin-bottom: 24px;
  margin-top: 24px;
}

.btn-group {
  width: 20vw;
  display: flex;
  margin-top:42px;
  margin-bottom: 42px;
  justify-content: space-between;
}

</style>
