import request from '@/utils/request';
import type { CommDataParams, CommDataTypes } from './data.d';

export let commDataForm:CommDataTypes = {
  sign: '',
  pid: 0,
  name: '',
  sort: 0,
  status: 0,
  content1: '',
  content2: '',
  content3: '',
}

export async function commDataList(params?: CommDataParams) {
  return request('/v1/comm_data/list', {
    params,
  });
}

export async function commDataDelete(id: number) {
  return request('/v1/comm_data/delete/'+id, {
    method: 'DELETE'
  });
}

export async function commDatadAdd(params: CommDataTypes) {
  return request('/v1/comm_data/add', {
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