<template>
    <div class="create-title">数据基本信息</div>
    <div class="block-line"></div>
    <a-spin :spinning="spinning">
      <a-form
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >


        <a-row>
          <a-col :span="12">
            <a-form-item label="数据名称"  v-bind="validateInfos.data_name">
              <a-input
                :disabled="disabled"
                v-model:value="formState.data_name"
                placeholder="请输入数据名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="数据类型"  v-bind="validateInfos.data_type">
              <a-select
                showArrow
                :disabled="disabled"
                v-model:value="formState.data_type"
                placeholder="请选择数据类型"
              >
                <a-select-option

                  v-for="i in typeArr"
                  :value="i.value"
                  :key="i.text">
                  {{ i.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="需求方"  v-bind="validateInfos.demander">
              <a-input
                :disabled="disabled"
                v-model:value="formState.demander"
                placeholder="请输入需求方"
              />
            </a-form-item>
          </a-col>
          <!-- 多选 -->
          <a-col :span="12">
            <a-form-item label="需求对接人"  v-bind="validateInfos.engineer">
              <a-select
                showArrow
                showSearch
                mode="multiple"
                :disabled="disabled"
                v-model:value="formState.engineer"
                :optionFilterProp="value"
              >
                <a-select-option :value="i.text" v-for="i in engineerArr" :key="i.value">
                  {{ i.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <!-- 多选 -->
          <a-col :span="12">
            <a-form-item label="数据开发"  v-bind="validateInfos.developer">
              <a-select
                showArrow
                mode="multiple"
                :disabled="disabled"
                placeholder="请选择数据开发人员"
                :optionFilterProp="value"
                v-model:value="formState.developer"
              >
                <a-select-option v-for="i in developerArr" :value="i.text" :key="i.value">
                  {{ i.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <div class="block-line"></div>
        <a-row>
          <!-- 多选 -->
          <a-col :span="12">
            <a-form-item label="归属角色"  v-bind="validateInfos.role">
              <a-select
                showArrow
                mode="multiple"
                :size="size"
                :disabled="disabled"
                placeholder="请选择归属角色"
                v-model:value="formState.role"
                :optionFilterProp="value"
              >
                <a-select-option :value="i.text" v-for="i in roleArr" :key="i.value">
                  {{ i.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="业务场景"  v-bind="validateInfos.scene">
              <a-select
                showArrow
                :disabled="disabled"
                v-model:value="formState.scene"
                placeholder="请选择业务场景"
              >
                <a-select-option :value="i.value" v-for="i in sceneArr" :key="i.value">
                  {{ i.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="业务主题"  v-bind="validateInfos.subject">
              <a-select
                showArrow
                :disabled="disabled"
                v-model:value="formState.subject"
                placeholder="请选择业务主题"
              >
                <a-select-option :value="i.value" :data_name="i.text" v-for="i in subjectArr" :key="i.value">
                  {{ i.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 多选 -->
          <a-col :span="12">
            <a-form-item label="业务过程"  v-bind="validateInfos.process">
              <a-select
                showArrow
                mode="multiple"
                :size="size"
                :disabled="disabled"
                placeholder="请选择业务进程"
                v-model:value="formState.process"
                :optionFilterProp="value"
              >
                <a-select-option :value="i.text" v-for="i in processArr" :key="i.value">
                  {{ i.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item  :wrapper-col="{ span: 18 }" label="详细描述"  v-bind="validateInfos.remark">
              <a-textarea
                :disabled="disabled"
                v-model:value="formState.remark"
                :auto-size="{ minRows: 5 }"
                placeholder="请输入数据服务的详细描述，包括但不限于：需求方、背景、内容、特别备注等"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-if="disabled">
          <a-button v-if="demand_info===null" :disabled="disabled">查看子需求</a-button>
          <a-button v-else type="primary" @click="checkChild()">查看子需求</a-button>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-else>
          <a-button :disabled="disabled" type="primary" @click="onConfim()">保存</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
</template>
<script lang="ts">
import { createVNode, defineComponent, reactive, UnwrapRef, toRefs ,onMounted} from "vue";

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal,notification } from 'ant-design-vue';
import { getFilter,saveBasisInfo,getDraftInfo,getOnlineInfo } from "@/api/index";

import { useForm } from "@ant-design-vue/use";
import { Router,useRoute,useRouter } from "vue-router";


interface IFormState {
  data_name: string; //input
  data_type: string | undefined; //select
  demander: string; //input
  engineer: string[];//select-tags mode=number
  developer: string[];//select-tags mode=number
  role: string[];//select-tags mode=number
  scene: string | undefined; //select
  subject: string | undefined; //select
  process: string[];//select-tags mode=number
  remark: string;
}

interface IArray {
    text: string;
    value: string;
}

interface IState {
  typeArr : IArray[];
  developerArr : IArray[];
  engineerArr : IArray[];
  roleArr : IArray[];
  processArr : IArray[];
  sceneArr : IArray[];
  subjectArr : IArray[];

  demand_info:string[];
  spinning:boolean
}


export default defineComponent({
  name: "BaseInfo",
  setup: () => {
    const router:Router = useRouter();
    const route = useRoute();

    const disabled:boolean = route.query.disabled == '1' ? true :false
    const formState: UnwrapRef<IFormState> = reactive({
      data_name: "",
      data_type: undefined,
      demander: "",
      engineer: [],
      developer: [],
      role: [],
      scene: undefined,
      subject:undefined,
      process: [],
      remark: "",
    });

    const state:IState = reactive({
      typeArr : [],
      developerArr : [],
      engineerArr : [],
      roleArr : [],
      processArr : [],
      sceneArr : [],
      subjectArr : [],
      demand_info: [],

      spinning:false
    })

    // 验证
    const rulesRef = reactive({
      data_name: [
        {

          required: true,
          message: "请输入数据名称",
        }
      ],
      data_type: [
        {
          required: true,
          message: "请选择数据类型",

        }
      ],
      demander: [
        {
          required: true,
          message: "请输入需求方",
          trigger: 'blur'
        }
      ],
      //多选
      engineer: [
        {
          type:'array',
          required: true,
          message: "请选择需求对接人",

        }
      ],
      //多选
      developer: [
        {
          type:'array',
          required: true,
          message: "请选择数据开发人员",

        }
      ],
      //多选
      role: [
        {
          type:'array',
          required: true,
          message: "请选择归属角色",

        }
      ],
      scene: [
        {
          required: true,
          message: "请选择业务场景",

        }
      ],
      subject: [
        {
          required: true,
          message: "请选择业务主题",

        }
      ],
      //多选
      process: [
        {
          type:'array',
          required: true,
          message: "请选择业务进程",

        }
      ],
      remark: [
        {
          required: true,
          message: "请输入数据服务的详细描述",

        }
      ],
    });
    const { validate, validateInfos } = useForm(formState, rulesRef);


    const draftInfo = () => {
      const id = route.query && route.query.id
      const base_info_id = route.query && route.query.base_info_id
      if(id !== undefined){
          state.spinning = true
          getDraftInfo(id).then(res=>{
          if (res.status_code == 10000) {
            const data = res.data
            formState.data_name = data.data_name

            state.typeArr.map((item:IArray)=>{
              if(item.value == data.data_type){
                  formState.data_type = item.text
                }
            })

            state.engineerArr.map((item:IArray)=>{
              const engineer = data.engineer.split(',')
              engineer.map((k:string)=>{
                if(item.value == k){
                  formState.engineer.push(item.text)
                }
              })
            })

            state.developerArr.map((item:IArray)=>{
              const developer = data.developer.split(',')
              developer.map((k:string)=>{
                if(item.value == k){
                  formState.developer.push(item.text)
                }
              })
            })

            state.roleArr.map((item:IArray)=>{
              const role = data.role.split(',')
              role.map((k:string)=>{
                if(item.value == k){
                  formState.role.push(item.text)
                }
              })
            })

            state.processArr.map((item:IArray)=>{
              const processArr = data.process.split(',')
              processArr.map((k:string)=>{
                if(item.value == k){
                  formState.process.push(item.text)
                }
              })
            })

            formState.demander = data.demander

            state.sceneArr.map((item:IArray)=>{
              if(item.value == data.scene){
                  formState.scene = item.text
                }
            })

            state.subjectArr.map((item:IArray)=>{
              if(item.value == data.subject){
                  formState.subject = item.text
                }
            })

            formState.remark = data.remark

            //子需求信息
            state.demand_info = data.demand_info
            state.spinning = false
          }
        })
      }else if(base_info_id !== undefined){
          state.spinning = true
          getOnlineInfo(base_info_id).then(res=>{
          if (res.status_code == 10000) {
            const data = res.data
            formState.data_name = data.data_name

            state.typeArr.map((item:IArray)=>{
              if(item.value == data.data_type){
                  formState.data_type = item.text
                }
            })

            state.engineerArr.map((item:IArray)=>{
              const engineer = data.engineer.split(',')
              engineer.map((k:string)=>{
                if(item.value == k){
                  formState.engineer.push(item.text)
                }
              })
            })

            state.developerArr.map((item:IArray)=>{
              const developer = data.developer.split(',')
              developer.map((k:string)=>{
                if(item.value == k){
                  formState.developer.push(item.text)
                }
              })
            })

            state.roleArr.map((item:IArray)=>{
              const role = data.role.split(',')
              role.map((k:string)=>{
                if(item.value == k){
                  formState.role.push(item.text)
                }
              })
            })

            state.processArr.map((item:IArray)=>{
              const processArr = data.process.split(',')
              processArr.map((k:string)=>{
                if(item.value == k){
                  formState.process.push(item.text)
                }
              })
            })

            formState.demander = data.demander

            state.sceneArr.map((item:IArray)=>{
              if(item.value == data.scene){
                  formState.scene = item.text
                }
            })

            state.subjectArr.map((item:IArray)=>{
              if(item.value == data.subject){
                  formState.subject = item.text
                }
            })
            formState.remark = data.remark

            //子需求信息
            state.demand_info = data.demand_info
            state.spinning = false
          }
        })
      }

    }

    // 获取下拉列表数据
    getFilter().then(res => {
      if (res.status_code == 10000) {
        state.typeArr = res.data.TYPE_ALL
        state.developerArr = res.data.DEVELOPER
        state.engineerArr = res.data.ENGINEER
        state.roleArr = res.data.ROLE
        state.processArr = res.data.TYPE_BUSIESS_PROCESS
        state.sceneArr = res.data.TYPE_BUSIESS_SCENARIO
        state.subjectArr = res.data.TYPE_THEME

        draftInfo()
      }
    });




    const onConfim = () => {
      validate().then(() => {
        Modal.confirm({
          title: '您是否确定保存数据基本信息？',
          icon: createVNode(ExclamationCircleOutlined),
          okText:'确定',
          cancelText:"取消",
          onOk() {
            onSubmit()
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      })
      .catch((res: Record<string, unknown>) => {
        console.log('error',res)
      });
    };
    const onSubmit = () => {
      const id = route.query && route.query.id
      const base_info_id = route.query && route.query.base_info_id

      validate().then((record: IFormState) => {

        let data_type:string = ""
        state.typeArr.map((item:IArray)=>{
          if(item.text == record.data_type || item.value == record.data_type){
              data_type = item.value
            }
        })

        let engineerList:string[] = []
        state.engineerArr.map((item:IArray)=>{
          record.engineer.map((k:string)=>{
            if(item.text == k || item.value == k){
              engineerList.push(item.value)
            }
          })
        })
        let engineer:string= engineerList.toString()


        let developerList:string[] = []
        state.developerArr.map((item:IArray)=>{
          record.developer.map((k:string)=>{
            if(item.text == k || item.value == k){
              developerList.push(item.value)
            }
          })
        })
        let developer:string= developerList.toString()

        let roleList:string[] = []
        state.roleArr.map((item:IArray)=>{
          record.role.map((k:string)=>{
            if(item.text == k || item.value == k){
              roleList.push(item.value)
            }
          })
        })
        let role:string= roleList.toString()

        let processList:string[] = []
        state.processArr.map((item:IArray)=>{
          record.process.map((k:string)=>{
            if(item.text == k || item.value == k){
              processList.push(item.value)
            }
          })
        })
        let process:string= processList.toString()


        let scene:string = ""
        state.sceneArr.map((item:IArray)=>{
          if(item.text == record.scene || item.value == record.scene){
              scene = item.value
            }
        })

        let subject:string = ""
        state.subjectArr.map((item:IArray)=>{
          if(item.text == record.subject || item.value == record.subject){
              subject = item.value
            }
        })

        let params:Record<string, unknown> = {
          data_name:record.data_name,
          data_type,
          demander:record.demander,
          engineer,
          developer,
          role,
          scene,
          subject,
          process,
          remark:record.remark,
        }

        if(id !== undefined){
          params.id = id
        }else if(base_info_id !==undefined){
          params.base_info_id = base_info_id
        }

        saveBasisInfo(params).then(res=>{

          if (res.status_code == 10000) {
            notification['success']({
              message: '数据基本信息保存成功',
            });
            if(id !== undefined){
              router.push({
                path:'/dataSet/create/details',
                query:{ id,parent_id:res.data.id,disabled:0 }
              })
            }else if(base_info_id !== undefined){
              router.push({
                path:'/dataSet/create/details',
                query:{ base_info_id,parent_id:res.data.id, }
              })
            }else{
              router.push({
                path:'/dataSet/create/details',
                query:{
                  parent_id:res.data.id,
                  action:'create'
                }
              })
            }

          }else{
            notification['error']({
              message: '数据基本信息保存失败',
            });
          }
        })
      })

    };

    const checkChild = ()=>{
        const id = route.query && route.query.id
        const base_info_id = route.query && route.query.base_info_id

        if(id !== undefined){
          router.push({
            path:'/dataSet/create/details',
            query:{ id,disabled:1 }
          })
        }else if(base_info_id !== undefined){
          router.push({
            path:'/dataSet/create/details',
            query:{ base_info_id,disabled:1 }
          })
        }
    }


    return {
      disabled,


      labelCol: { span: 6 },
      wrapperCol: { span: 12 },

      formState,
      ...toRefs(state),
      validate,
      validateInfos,

      onConfim,
      onSubmit,
      checkChild,

    };
  },
});
</script>
<style lang="less" scoped>
.create-title {
  font-size: 16px;
  font-weight: 600;
}
.block-children{
  padding:34px;
  border-top:20px solid #f3f5f4;
}
.block-line {
  height: 1px;
  background-color: #f0f0f0;
  margin-bottom: 24px;
  margin-top: 24px;
}
</style>
