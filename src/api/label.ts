import { send } from '@/util/request'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'



/**
 * 业务标签-列表
 * @param：{page}
 * @param：{page_size}
 * @param：{lable_type} TYPE_THEME，TYPE_ALL ，TYPE_BUSIESS_PROCESS，TYPE_BUSIESS_SCENARIO
**/
export const getLabelList = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/business_label/list',params:params})
};


/**
 * 业务标签-添加
 * @param：{cn_name}
 * @param：{en_name}
 * @param：{lable_type}
 * @param：{subject_id}
**/
export const addLabel = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/business_label/add',params:params})
};


/**
 * 业务标签-编辑
 * @param：{cn_name}
 * @param：{en_name}
 * @param：{lable_type}
 * @param：{subject_id}
 * @param：{id}
**/
export const editLabel = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/business_label/edit',params:params})
};


/**
 * 业务标签-删除
 * @param：{id}
**/
export const delteLabel = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/business_label/del',params})
};
