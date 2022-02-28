<template>
    <div class="row-search">
    <a-row>
      <label>关键字:</label>
      <a-input v-model:value="search"  @change="searchInput" placeholder="请输入搜索关键字" />
    </a-row>
    <a-row>
      <label>状态:</label>
      <a-select
          showArrow
          style="width: 200px"
          v-model:value="status"
          @change="searchSelect"
          placeholder="请选择服务状态"
        >
          <a-select-option v-for="i in stateArr" :value="i.value" :key="i.value">
            {{ i.text }}
          </a-select-option>
        </a-select>
    </a-row>
    <a-button type="primary" @click="onSearch"><SearchOutlined /></a-button>
  </div>
  <a-table
    :rowKey="(record,index)=>{return index}"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    @change="handleChange"
    >
      <template #subject="{ record }">
        <div v-for="sub in subjectArr"  :key="sub.value">
          <span v-if="record.subject == sub.value">{{sub.text}}</span>
        </div>
      </template>
      <template #scene="{ record }">
        <div v-for="sub in sceneArr"  :key="sub.value">
          <span v-if="record.scene == sub.value">{{sub.text}}</span>
        </div>
      </template>
      <template #operation="{ record }">
        <!-- 草稿 -->
        <span class="table-operation" v-if="record.state === 0 | record.state === 3">
          <a @click="onCheck(record.id)">查看</a>
          <!-- 本人用户 -->
          <a-popconfirm
            v-if="dataSource.length"
            title="确定删除本条信息吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="onServiceState(record.id,-1)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
        <!-- 待审核 -->
        <span class="table-operation" v-if="record.state === 1">
          <a @click="onCheck(record.id)">查看</a>
          <a @click="onServiceState(record.id,2)">通过</a>
          <a style="color:'red'" @click="onServiceState(record.id,0)">驳回</a>

          <!-- 本人用户 -->
          <a-popconfirm
            v-if="dataSource.length"
            title="确定删除本条信息吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="onServiceState(record.id,-1)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
        <!-- 已审核完成用户 -->
        <span class="table-operation" v-if="record.state === 2">
          <a @click="onCheck(record.id)">查看</a>
          <a @click="onServiceState(record.id,3)">发布</a>

          <!-- 本人用户 -->
          <a-popconfirm
            v-if="dataSource.length"
            title="确定删除本条信息吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="onServiceState(record.id,-1)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>



</template>

<script lang="ts">
import { defineComponent, computed, toRaw, onMounted, reactive, toRefs } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { notification } from 'ant-design-vue';
import { Router,useRouter } from "vue-router";
import { getAuditList,serviceState,getFilter} from "@/api/index";
import { columns } from "./tableConfig";


interface IState {
  loading:boolean,
  dataSource:Array<Record<string, unknown>>,
  pageAbout:Record<string, unknown>,
  stateArr:Array<Record<string, unknown>>,
  sceneArr:Array<Record<string, unknown>>,
  subjectArr:Array<Record<string, unknown>>,
}

export default defineComponent({
  name: "Audit",
  components: {
    SearchOutlined,
  },
  setup() {
    const router:Router = useRouter();

    const state:IState = reactive({

      loading:true,
      dataSource:[],
      pageAbout:{},
      sceneArr:[],
      subjectArr:[],

      stateArr:[{
        value:'',
        text:'全部'
      },{
        value:0,
        text:'草稿'
      },{
        value:1,
        text:'待审核'
      },{
        value:2,
        text:'已审核'
      },{
        value:3,
        text:'已完成'
      }]
    })

    const params = reactive({
      page:1,
      page_size:10,
      search:'',
      status:'',
    })

    const searchInput = (e:any) =>{
        params.search = e.target.value
    }
    const searchSelect = (value:string) =>{
        params.status = value
    }


    onMounted(() => {
      auditList(params)
    })

    // 获取下拉列表数据
    getFilter().then(res => {
      if (res.status_code == 10000) {
        state.sceneArr = res.data.TYPE_BUSIESS_SCENARIO
        state.subjectArr = res.data.TYPE_THEME
      }
    });
    const auditList = (params: Record<string, unknown>) =>{
        state.loading = true
        getAuditList(params).then(res=>{
          if (res.status_code == 10000) {
            state.loading = false
            state.dataSource = res.data.data
          }
        })
    }
    const onSearch = ()=>{

      auditList(params)
    }

    /**
     * 分页
     */
    const pagination = computed(() => ({
      total: toRaw(state.pageAbout).total,
      current: toRaw(state.pageAbout).current_page,
      page_size:10,
    }));

    const handleChange = (pag: Record<string, number>) => {
      params.page = pag.current
      auditList(params);
    };

    //查看
    const onCheck = (id: string) => {
      const disabled = '1'
      router.push({path:'/dataSet/create', query :{ id , disabled }})
    };

    // -1:删除，0：驳回，2：通过，3:发布
    const onServiceState = (key: string, status: number) => {
      let successInfo:string = ""
      let errorInfo:string = ""
      switch (status) {
        case -1:
          successInfo = "服务删除成功"
          errorInfo = "服务删除失败"
          break;
        case 0:
          successInfo = "服务已驳回"
          errorInfo = "服务驳回失败"
          break;
        case 2:
          successInfo = "服务已审核通过"
          errorInfo = "服务审核失败"
          break;
        case 3:
          successInfo = "服务发布成功"
          errorInfo = "服务发布失败"
          break;
      }
      serviceState({id:key,state:status}).then(res=>{
        console.log('status',status)
        if(res.data.code){
          notification['success']({
            message: successInfo,
          });
          auditList(params);
        }else{
           notification['error']({
            message: errorInfo,
          });
        }
      })
    };


    return{
      onSearch,
      columns,

      onCheck,
      onServiceState,
      searchInput,
      searchSelect,

      pagination,
      handleChange,

      ...toRefs(state),
      ...toRefs(params),
    }
  }
})
</script>
<style lang="less" scoped>
.row-search {
  display: flex;
  justify-content: space-between;
  width: 50vw;
  height: 35px;
  line-height: 35px;
  margin: 30px 0px;
}
.row-search label {
  margin-right: 24px;
}
.row-search input,select {
  width: 200px;
}
.table-operation a{
  margin:0 4px;
}
</style>
