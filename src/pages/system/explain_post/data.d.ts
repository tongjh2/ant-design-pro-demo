export type ExplainPostItem = {
  id?: number;
  title: string;
  images: string;
  author: string;
  explain_category_id: number;
  explain_kind: number;
  description: string;
  content: string;
};

export type ExplainPostPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type ExplainPostData = {
  list: ExplainPostItem[];
  pagination: Partial<ExplainPostPagination>;
};

export type ExplainPostParams = {
  q?:string;
  explain_category_id?:number|string;
  explain_kind?:string;
  explain_category_name?:string;
  explain_kind_name?:string;
  status?:number|string;
  page:number;
  page_size:number;
};
