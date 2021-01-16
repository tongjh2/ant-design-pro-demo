export type UserTypes = {
  id?: number; 
  name: string;  
  route_ids: string;

  id: string;
  username: string;
  password: string;
  name: string;
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
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageNo?: number; 
  pageSize?: number;
  currentPage?: number;
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
