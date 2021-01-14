import request from '@/utils/request';
import type { CommDataParams, ProductInfoItem } from './data.d';

export async function commDataList(params?: CommDataParams) {
  return request('/v1/comm_data/list', {
    params,
  });
}

export async function adDelete(id: number) {
  return request('/v1/ad/delete/'+id, {
    method: 'DELETE'
  });
}

export async function addAd(params: ProductInfoItem) {
  return request('/v1/ad/add', {
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