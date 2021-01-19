import request from '@/utils/request';
import type { ActionLogTypes,ActionLogParams } from './data.d';


export const actionLogForm:ActionLogTypes = {
  user_name: '',
  create_time: '',
	image: '',
	content: '',
}

export const actionLogParams:ActionLogParams = {
  q:'',
  start_time:'', 
  end_time:'', 
  page:1,
  page_size:10,
}

export async function actionLogAdd(params: ActionLogTypes) {
  return request('/v1/action_log/add', {
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

export async function actionLogDelete(id: number) {
  return request('/v1/action_log/delete/'+id, {
    method: 'DELETE',
    data: {
      method: 'delete',
    },
  });
}

export async function actionLogItem(id: number) {
  return request('/v1/action_log/item/'+id, {
    method: 'GET',
  });
}

export async function actionLogList(params: ActionLogParams) {
  return request('/v1/action_log/list', {
    params,
  });
}


export async function actionLogUpdateStatus(id:number,status:number) {
  return request('/v1/action_log/update_status', {
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
