import request from '@/utils/request';
import type { TableListParams, ProductInfoItem } from './data.d';

export async function productInfoList(params?: TableListParams) {
  return request('/jeeapp/a/m/product/productInfo/list', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function saveProductInfo(params: ProductInfoItem) {
  return request('/jeeapp/a/m/product/productInfo/save', {
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

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
