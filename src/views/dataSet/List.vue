<template>
    <div>
    <a-row class="row-search">
      <a-col :span="7">
        <label>关键字:</label>
        <a-input
          v-model:value="search"
          @change="searchInput"
          placeholder="请输入搜索关键字"
        />
      </a-col>
      <a-col :span="7">
        <label>类型:</label>
        <a-select
            showArrow
            style="width: 200px"
            v-model:value="type"
            @change="searchDataType"
            placeholder="请选择类型"
          >
            <a-select-option v-for="i in typeArr" :value="i.value" :key="i.value">
              {{ i.text }}
            </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="7">
        <label>角色:</label>
        <a-select
            showArrow
            style="width: 200px"
            v-model:value="role"
            @change="searchRole"
            placeholder="请选择角色"
          >
            <a-select-option v-for="i in roleArr" :value="i.value" :key="i.value">
              {{ i.text }}
            </a-select-option>
        </a-select>
      </a-col>

    </a-row>
    <a-row  class="row-search">

      <a-col :span="7">
        <label>业务过程:</label>
        <a-select
            showArrow
            style="width: 200px"
            v-model:value="process"
            @change="searchProcess"
            placeholder="请选择业务过程"
          >
            <a-select-option v-for="i in processArr" :value="i.value" :key="i.value">
              {{ i.text }}
            </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="7">
        <label>业务场景:</label>
        <a-select
            showArrow
            style="width: 200px"
            v-model:value="scene"
            @change="searchScene"
            placeholder="请选择业务场景"
          >
            <a-select-option v-for="i in sceneArr" :value="i.value" :key="i.value">
              {{ i.text }}
            </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="7">
        <label>业务主题:</label>
        <a-select
            showArrow
            style="width: 200px"
            v-model:value="subject"
            @change="searchSubject"
            placeholder="请选择业务主题"
          >
            <a-select-option v-for="i in subjectArr" :value="i.value" :key="i.value">
              {{ i.text }}
            </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-button type="primary" @click="onSearch"><SearchOutlined /></a-button>
      </a-col>
    </a-row>

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
            <a @click="onCheck(record.base_info_id)">查看</a>
            <a @click="onEdit(record.base_info_id)">编辑</a>
            <a-popconfirm
              v-if="dataSource.length"
              title="确定删除本条信息吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="onDelete(record.base_info_id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
      </template>
    </a-table>



</template>

<script lang="ts">
import { defineComponent, toRaw, computed, onMounted, reactive, toRefs } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { notification } from 'ant-design-vue';
import { Router,useRouter } from "vue-router";
import { getFilter,getOnlineList,delOnline} from "@/api/index";
import { columns } from "./tableConfig";

interface IState {
  loading:boolean,
  dataSource:Array<Record<string, unknown>>,
  pageAbout:Record<string, unknown>,
  typeArr:Array<Record<string, unknown>>,
  roleArr:Array<Record<string, unknown>>,
  processArr:Array<Record<string, unknown>>,
  sceneArr:Array<Record<string, unknown>>,
  subjectArr:Array<Record<string, unknown>>,
}

export default defineComponent({
  name: "List",
  components: {
    SearchOutlined,
  },
  setup() {
    const router:Router = useRouter();

    const params = reactive({
      page:1,
      page_size:10,
      search:'',
      type:'',
      role:'',
      process:'',
      scene:'',
      subject:'',
    })


    const state:IState = reactive({


      loading:true,
      dataSource:[],
      pageAbout:{},


      typeArr : [{
        value:'',
        text:'全部'
      }],
      roleArr : [{
        value:'',
        text:'全部'
      }],
      processArr : [{
        value:'',
        text:'全部'
      }],
      sceneArr : [{
        value:'',
        text:'全部'
      }],
      subjectArr : [{
        value:'',
        text:'全部'
      }],
    })



    const searchInput = (e:any) =>{
        params.search = e.target.value
    }

    const searchDataType = (value:string) =>{
        params.type = value
    }

    const searchSubject = (value:string) =>{
        params.subject = value
    }

    const searchProcess = (value:string) =>{
        params.process = value
    }

    const searchScene = (value:string) =>{
        params.scene = value
    }

    const searchRole = (value:string) =>{
        params.role = value
    }




    onMounted(() => {
      onlineList(params)
    })

    const onlineList = (params: Record<string, unknown>)=>{
      getOnlineList(params).then(res=>{
        if (res.status_code == 10000) {
          state.loading = false
          state.dataSource = res.data.data
          const { total, from, to, current_page } = res.data
          state.pageAbout = { total, from, to, current_page }

          console.log('state.pageAbout',state.pageAbout)
        }
      })
    }


    // 获取下拉列表数据
    getFilter().then(res => {
      if (res.status_code == 10000) {
        state.typeArr = state.typeArr.concat(res.data.TYPE_ALL)
        state.roleArr = state.roleArr.concat(res.data.ROLE)
        state.processArr = state.processArr.concat(res.data.TYPE_BUSIESS_PROCESS)
        state.sceneArr = state.sceneArr.concat(res.data.TYPE_BUSIESS_SCENARIO)
        state.subjectArr = state.subjectArr.concat(res.data.TYPE_THEME)
      }
    });

    const onSearch = ()=>{
      state.loading = true
      getOnlineList(params).then(res=>{
        if (res.status_code == 10000) {
          state.loading = false
          state.dataSource = res.data.data
        }
      })
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
      onlineList(params);
    };

    const onCheck = (id: string) => {
      const disabled = '1'
      router.push({path:'/dataSet/create', query :{ base_info_id:id , disabled }})
    };
    const onEdit = (id: string) => {
      const disabled = '0'
      router.push({path:'/dataSet/create', query :{ base_info_id:id , disabled }})
    };

    const onDelete = (base_info_id: string) => {
      delOnline({base_info_id,state:-1}).then(res=>{
        console.log('status',status)
        if(res.data.code){
          notification['success']({
            message: '数据删除成功',
          });
          // getDraftList(obj)
        }else{
           notification['error']({
            message: '数据删除失败',
          });
        }
      })
    };



    return{
      onSearch,
      columns,

      onCheck,
      onEdit,
      onDelete,

      searchInput,
      searchDataType,
      searchSubject,
      searchProcess,
      searchScene,
      searchRole,

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
  // display: flex;
  // justify-content: space-between;
  // width: 50vw;
  height: 35px;
  line-height: 35px;
  margin: 30px 0px;
  label{
    display:inline-block;
    width:70px
  }
}

.row-search input,select {
  width: 200px;
}
.table-operation a{
  margin:0 4px;
}
</style>
