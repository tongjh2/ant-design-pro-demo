import request from '@/utils/request';
import type { ExplainPostParams, ExplainPostItem } from './data.d';

export async function explainPostAdd(params: ExplainPostItem) {
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

export async function explainPostList(params: ExplainPostParams) {
  return request('/v1/explain_post/list', {
    params,
  });
}


export async function explainPostUpdateStatus(params: ExplainPostParams) {
  return request('/v1/explain_post/update_status', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}
