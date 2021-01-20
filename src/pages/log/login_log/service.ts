import request from '@/utils/request';
import type { LoginLogTypes,LoginLogParams } from './data.d';


export const loginLogForm:LoginLogTypes = {
  user_name: '',
  create_time: '',
	image: '',
	content: '',
}

export const loginLogParams:LoginLogParams = {
  user_name:'',
  type:'',
  source_ip:'',
  start_time:'', 
  end_time:'', 
  page:1,
  page_size:10,
}

export async function loginLogAdd(params: LoginLogTypes) {
  return request('/v1/login_log/add', {
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

export async function loginLogDelete(id: number) {
  return request('/v1/login_log/delete/'+id, {
    method: 'DELETE',
    data: {
      method: 'delete',
    },
  });
}

export async function loginLogItem(id: number) {
  return request('/v1/login_log/item/'+id, {
    method: 'GET',
  });
}

export async function loginLogList(params: LoginLogParams) {
  return request('/v1/login_log/list', {
    params,
  });
}


export async function loginLogUpdateStatus(id:number,status:number) {
  return request('/v1/login_log/update_status', {
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
