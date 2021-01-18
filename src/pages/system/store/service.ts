import request from '@/utils/request';
import type { StoreParams, StoreTypes } from './data.d';

export let storeForm:StoreTypes = {
  name: '',  
  route_ids: '',  
}

export async function storeAdd(params: StoreTypes) {
  return request('/v1/store/add', {
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

export async function storeDelete(id: number) {
  return request('/v1/store/delete/'+id, {
    method: 'DELETE'
  });
}

export async function storeItem(id: number) {
  return request('/v1/store/item/'+id);
}

export async function storeList(params?: StoreParams) {
  return request('/v1/store/list', {
    params,
  });
}