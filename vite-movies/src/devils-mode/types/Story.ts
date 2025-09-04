export interface Stories {
  grid_number: number;
  channels: Channel[];
  load_more: LoadMore;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  image: any;
  label: any;
  display: string;
  type: string;
  enable_detail: boolean;
  related: Related;
  share: Share;
  remote_data: RemoteData;
}

export interface Related {
  url: string;
  request_headers: any[];
}

export interface Share {
  url: string;
}

export interface RemoteData {
  url: string;
}

export interface LoadMore {
  pageInfo: PageInfo;
  paging: Paging;
  remote_data: RemoteData2;
}

export interface PageInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paging {
  page_key: string;
  size_key: string;
}

export interface RemoteData2 {
  url: string;
}
