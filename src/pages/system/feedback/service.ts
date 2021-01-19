import request from '@/utils/request';
import type { FeedbackTypes,FeedbackParams } from './data.d';


export const feedbackForm:FeedbackTypes = {
  user_name: '',
  create_time: '',
	image: '',
	content: '',
}

export const feedbackParams:FeedbackParams = {
  q:'',
  start_time:'', 
  end_time:'', 
  page:1,
  page_size:10,
}

export async function feedbackAdd(params: FeedbackTypes) {
  return request('/v1/feedback/add', {
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

export async function feedbackDelete(id: number) {
  return request('/v1/feedback/delete/'+id, {
    method: 'DELETE',
    data: {
      method: 'delete',
    },
  });
}

export async function feedbackItem(id: number) {
  return request('/v1/feedback/item/'+id, {
    method: 'GET',
  });
}

export async function feedbackList(params: FeedbackParams) {
  return request('/v1/feedback/list', {
    params,
  });
}


export async function feedbackUpdateStatus(id:number,status:number) {
  return request('/v1/feedback/update_status', {
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
