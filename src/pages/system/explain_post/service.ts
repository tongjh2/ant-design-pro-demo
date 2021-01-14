import request from '@/utils/request';
import type { ExplainPostTypes,ExplainPostParamsTypes } from './data.d';


export const explainPostForm:ExplainPostTypes = {
  title: '',
	images: '',
	author: '',
	explain_category_id: '',
	explain_kind: '',
	description: '',
	content: '',
}

export const explainPostParams:ExplainPostParamsTypes = {
  q:'',//标题
  explain_category_id:'', //讲解分类id
  explain_kind:'', //讲解种类 1 病理 2病因/病程 3 优势 4 案例
  explain_category_name:'',
  explain_kind_name:'',
  status:'',      //状态
  page:1,
  page_size:10,
}

export async function explainPostAdd(params: ExplainPostTypes) {
  return request('/v1/explain_post/add', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function explainPostDelete(id: number) {
  return request('/v1/explain_post/delete/'+id, {
    method: 'DELETE',
    data: {
      method: 'delete',
    },
  });
}

export async function explainPostItem(id: number) {
  return request('/v1/explain_post/item/'+id, {
    method: 'GET',
  });
}

export async function explainPostList(params: ExplainPostParamsTypes) {
  return request('/v1/explain_post/list', {
    params,
  });
}


export async function explainPostUpdateStatus(id:number,status:number) {
  return request('/v1/explain_post/update_status', {
    method: 'PUT',
    data: {
      id,
      status
    },
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
