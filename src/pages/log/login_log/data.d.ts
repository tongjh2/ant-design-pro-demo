export type LoginLogTypes = {
  id?: number;
  user_name: string;
  image: string;
  content: string;
  create_time: string;
};

export type LoginLogParams = {
  user_name?:string;
  type?:string;
  source_ip?:string;
  start_time?:string;
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