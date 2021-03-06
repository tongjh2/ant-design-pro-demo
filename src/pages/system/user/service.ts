import request from '@/utils/request';
import type { UserParams, UserTypes } from './data.d';

export let userForm:UserTypes = {
  name: '',  
}

export async function userAdd(params: UserTypes) {
  return request('/v1/user/add', {
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

export async function userDelete(id: number) {
  return request('/v1/user/delete/'+id, {
    method: 'DELETE'
  });
}

export async function userItem(id: number) {
  return request('/v1/user/item/'+id);
}

export async function userList(params?: UserParams) {
  return request('/v1/user/list', {
    params,
  });
}

export async function userUpdateStatus(id:string, status:number) {
  return request('/v1/user/update_status', {
    method: 'PUT',
    data: {
      id,
      status,
      method: 'put',
    },
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}