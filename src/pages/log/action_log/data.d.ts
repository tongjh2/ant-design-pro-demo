export type ActionLogTypes = {
  id?: number;
  user_name: string;
  image: string;
  content: string;
  create_time: string;
};

export type ActionLogParams = {
  q?:string;
  start_time?:number|string;
  end_time?:string;
  page:number;
  page_size:number;
};


export type ActionLogPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type ActionLogData = {
  list: ActionLogTypes[];
  pagination: Partial<ActionLogPagination>;
};