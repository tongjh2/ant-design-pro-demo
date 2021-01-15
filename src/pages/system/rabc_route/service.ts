import request from '@/utils/request';
import type { RabcRouteParams, RabcRouteTypes } from './data.d';

export let rabcRouteForm:RabcRouteTypes = {
  pid: '',   
  name: '',  
  content1: '',  
  content2: '',  
  content3: '',  
  sort: '',  
}

export async function rabcRouteAdd(params: RabcRouteTypes) {
  return request('/v1/rabc_route/add', {
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

export async function rabcRouteDelete(id: number) {
  return request('/v1/rabc_route/delete/'+id, {
    method: 'DELETE'
  });
}

export async function rabcRouteItem(id: number) {
  return request('/v1/rabc_route/item/'+id);
}

export async function rabcRouteList(params?: RabcRouteParams) {
  return request('/v1/rabc_route/list', {
    params,
  });
}