export type FeedbackTypes = {
  id?: number;
  user_name: string;
  image: string;
  content: string;
  create_time: string;
};

export type FeedbackParams = {
  q?:string;
  start_time?:number|string;
  end_time?:string;
  page:number;
  page_size:number;
};


export type FeedbackPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type FeedbackData = {
  list: FeedbackTypes[];
  pagination: Partial<FeedbackPagination>;
};