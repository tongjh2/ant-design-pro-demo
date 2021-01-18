export type CommDataTypes = {
  id?: number;
  sign: string;
  pid: number;
  name: string;
  sort: number;
  status: number;
  content1: string;
  content2: string;
  content3: string;
};

export type CommDataPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type CommDataData = {
  list: CommDataTypes[];
  pagination: Partial<CommDataPagination>;
};

export type CommDataParams = {
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
