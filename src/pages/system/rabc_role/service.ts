import request from '@/utils/request';
import type { RabcRoleParams, RabcRoleTypes } from './data.d';

export let rabcRoleForm:RabcRoleTypes = {
  name: '',  
  route_ids: '',  
}

export async function rabcRoleAdd(params: RabcRoleTypes) {
  return request('/v1/rabc_role/add', {
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

export async function rabcRoleDelete(id: number) {
  return request('/v1/rabc_role/delete/'+id, {
    method: 'DELETE'
  });
}

export async function rabcRoleItem(id: number) {
  return request('/v1/rabc_role/item/'+id);
}

export async function rabcRoleList(params?: RabcRoleParams) {
  return request('/v1/rabc_role/list', {
    params,
  });
}

export async function rabcRoleEffective() {
  return request('/v1/rabc_role/effective');
}