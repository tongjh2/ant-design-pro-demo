export type UserTypes = {
  id?: number; 
  name: string;  
  username: string;
  password: string;
  age: string;
  sex: string;
  face: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  store_id: string;
  store_name: string;
  role: string;
  status: string;

};

export type UserParams = {
  store_id?:number;
  q?:string;
  phone?:string;
  role?:number;
  status?:number;
  start_time?:string;
  end_time?:string;
  page?: number; 
  page_size?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export type UserPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type UserData = {
  list: UserTypes[];
  pagination: Partial<UserPagination>;
};
