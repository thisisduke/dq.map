<template>
    <div class="row-search">
      <a-row>
        <label>关键字:</label>
        <a-input v-model:value="search" @change="searchInput" placeholder="请输入搜索关键字" />
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
          <span class="table-operation">
            <a @click="onCheck(record.id)">查看</a>
            <a @click="onEdit(record.id)">编辑</a>
            <a-popconfirm
              v-if="dataSource.length"
              title="确定删除本条信息吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="onDelete(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
</template>

<script lang="ts">
import { defineComponent,computed, toRaw,onMounted, reactive, toRefs } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { Router,useRouter } from "vue-router";
import { getDraftList,serviceState,getFilter} from "@/api/index";
import { notification } from 'ant-design-vue';
import { columns } from "./tableConfig";


interface IState {
  loading:boolean,
  dataSource:Array<Record<string, unknown>>,
  pageAbout:Record<string, unknown>,
  sceneArr:Array<Record<string, unknown>>,
  subjectArr:Array<Record<string, unknown>>,
}

export default defineComponent({
  name: "Drafts",
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
      subjectArr:[]
    })

    const params = reactive({
      page:1,
      page_size:10,
      search:'',
    })
    onMounted(() => {
      draftList(params)
    })

    // 获取下拉列表数据
    getFilter().then(res => {
      if (res.status_code == 10000) {
        state.sceneArr = res.data.TYPE_BUSIESS_SCENARIO
        state.subjectArr = res.data.TYPE_THEME
      }
    });

    const draftList = (params: Record<string, unknown>)=>{
      state.loading = true
      getDraftList(params).then(res=>{
          console.log('res.status_code',res.status_code)
          if (res.status_code === 10000) {
            state.loading = false
            state.dataSource = res.data.data
            const { total, from, to, current_page } = res.data
            state.pageAbout = { total, from, to, current_page }
            console.log('state.pageAbout',state.pageAbout)
          }
      })
    }
    const searchInput = (e:any) =>{
        params.search = e.target.value
    }
    const onSearch = ()=>{
      draftList(params)
    }

    /**
     * 分页
     */
    const pagination = computed(() => ({
      total: toRaw(state.pageAbout).total,
      current: toRaw(state.pageAbout).current_page,
      pageSize: 10,
    }));

    const handleChange = (pag: Record<string, number>) => {
      params.page = pag.current
      draftList(params);
    };

    const onCheck = (id: string) => {
      const disabled = '1'
      router.push({path:'/dataSet/create', query :{ id , disabled }})
    };
    const onEdit = (id: string) => {
      const disabled = '0'
      router.push({path:'/dataSet/create', query :{ id , disabled }})
    };
    const onDelete = (id: string) => {
      serviceState({id,state:-1}).then(res=>{

        if(res.data.code){
          notification['success']({
            message: '草稿删除成功',
          });
          draftList(params);
        }else{
           notification['error']({
            message: '草稿删除失败',
          });
        }
      })
    };

    return{
      onSearch,
      columns,
      onEdit,
      onCheck,
      onDelete,
      searchInput,

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
  width: 25vw;
  height: 35px;
  line-height: 35px;
  margin: 30px 0px;
}
.row-search label {
  margin-right: 24px;
}
.row-search input {
  width: 200px;
}
.table-operation a{
  margin:0 4px;
}
</style>
