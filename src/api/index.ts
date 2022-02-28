import { send } from '@/util/request'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

//数据集-下拉列表
export const getFilter = () => {
  return send({method:'GET',url:'/service_manage/get_filter'})
};



//用户信息
export const getUserInfo = (query:any) => {
  return send({method:'GET',url:`/get_user_info?code=${query}`})
};


/**
 * 数据集-列表
 * @param：{page}
 * @param：{page_size}
 * @param：{search} 关键字
 * @param：{data_type} 类型
 * @param：{subject} 主题
 * @param：{process} 业务过程
 * @param：{scene} 主题
 * @param：{process} 业务场景
 * @param：{role} 角色
**/
export const getOnlineList = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/service_manage/get_online_list',params:params})
};


/**
 * 数据集-详情
 * @param：{base_info_id} 数据集ID（正式环境）
**/
export const getOnlineInfo = ( query: any) => {
  return send({method:'GET',url:`/service_manage/get_online_detail?base_info_id=${query}`})
};


/**
 * 删除
 * @param：{id}
 * @param：{state}  -1:删除，0：驳回，2：通过，3:发布
**/
export const delOnline = ( params: Record<string, unknown> ) => {
  return send({method:'POST',url:'/service_manage/online_delete',params:params})
};




/**
 * 数据集-版本列表
 * @param：{page}
 * @param：{page_size}
 * @param：{base_info_id} 数据集ID（正式环境）
 * @param：{editor} 修改人
 * @param：{start} 开始时间
 * @param：{end} 结束时间
**/
export const getVersionList = ( params: Record<string, unknown>) => {
  return send({method:'POST',url:'/service_manage/history_version',params:params})
};

/**
 * 数据集基本信息-保存
 * @param：{data_name} 数据名称
 * @param：{data_type} 数据类型
 * @param：{demander} 是需求方
 * @param：{engineer} 是需求对接人（工程师）
 * @param：{developer} 是数据开发
 * @param：{role} 是归属角色
 * @param：{scene} 是业务场景
 * @param：{subject} 是归属主题
 * @param：{process} 是业务过程
 * @param：{remark} 否详细描述
**/
export const saveBasisInfo = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/service_manage/save_info',params:params})
};


/**
 * 子数据列表模糊搜素
 * @param：{query} 搜索字段
**/
export const getColumnInfo = ( query:string ) => {
  return send({method:'GET',url:`/service_manage/get_column_info?query=${query}`})
};


/**
 * 子需求单独-保存
 * @param：{parent_id} 数据基本信息id
 * @param：{id} 子需求id前端生成
 * @param：{data_id} 数据id
 * @param：{demand_link} 需求链接
 * @param：{demand_name} 子需求名称
 * @param：{demand_remark} 子需求描述
 * @param：{sql} sql
 * @param：{column_name} 字段列表
**/
export const saveDemandInfo = (params:Record<string, unknown>) => {
  return send({method:'POST',url:`/service_manage/save_demand`,params:params})
};

/**
 * 草稿箱-列表
 * @param：{page}
 * @param：{page_size}
 * @param：{search} 搜索传值
**/
export const getDraftList = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/service_manage/get_draft_list',params:params})
};


/**
 * 服务审核-列表
 * @param：{page}
 * @param：{page_size}
 * @param：{search} 搜索传值
 * @param：{state} 状态
**/
export const getAuditList = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/service_manage/get_audit_list',params:params})
};

/**
 * 草稿箱/服务审核-详情
**/
export const getDraftInfo = ( query: any) => {
  return send({method:'GET',url:`/service_manage/get_detail?id=${query}`})
};

/**
 * 服务审核-审核
 * @param：{id}
 * @param：{state}  -1:删除，0：驳回，2：通过，3:发布
**/
export const serviceState = (params:Record<string, unknown>) => {
  return send({method:'POST',url:'/service_manage/audit',params:params})
};


