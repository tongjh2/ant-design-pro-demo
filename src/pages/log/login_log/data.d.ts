export type LoginLogTypes = {
  id?: number;
  user_name: string;
  image: string;
  content: string;
  create_time: string;
};

export type LoginLogParams = {
  q?:string;
  start_time?:number|string;
  end_time?:string;
  page:number;
  page_size:number;
};


export type LoginLogPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type LoginLogData = {
  list: LoginLogTypes[];
  pagination: Partial<LoginLogPagination>;
};