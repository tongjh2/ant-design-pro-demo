export type RabcRoleTypes = {
  id?: number; 
  name: string;  
  route_ids: string;
};

export type RabcRoleParams = {
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

export type RabcRolePagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type RabcRoleData = {
  list: RabcRoleTypes[];
  pagination: Partial<RabcRolePagination>;
};
