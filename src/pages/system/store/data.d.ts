export type StoreTypes = {
  id?: number; 
  name: string;        //门店名称
  small_name: string;  //门店简称	
  phone: string;       //联系电话
  phone2: string;       //门店电话
  store_manager: string;//门店经理
  store_subject_id: string;//门店主体
  base_location_nam: string;//门店主体
  address: string;     //地址
  remark: string;      //备注
  status: string;      //状态 0 开启 1 禁用
  province_id: number; //地区
  province_name: string;//地区名称
  city_id: number;     //地区
  city_name: string;   //地区名称
};

export type StoreParams = {
  page?: number; 
  page_size?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export type StorePagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type StoreData = {
  list: StoreTypes[];
  pagination: Partial<StorePagination>;
};
