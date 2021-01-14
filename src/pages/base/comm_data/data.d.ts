export type AdItem = {
  id?: number;
  name: string;
  type: number;
  position: string;
  sort: number;
  status: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
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
