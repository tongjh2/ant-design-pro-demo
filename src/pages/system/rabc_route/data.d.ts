export type RabcRouteTypes = {
  id?: number;
  pid: number;   
  name: string;  
  content1: string;  
  content2: string;  
  content3: string;  
  sort: number;  
};

export type RabcRouteParams = {
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

export type RabcRoutePagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type RabcRouteData = {
  list: RabcRouteTypes[];
  pagination: Partial<RabcRoutePagination>;
};
