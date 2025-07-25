export interface SportProvider {
  url: string;
  paging: Paging;
  pageInfo: PageInfo;
  groups: Group[];
  channels: any[];
  grid_columns: number;
}

interface Group {
  id: string;
  name: string;
  channels: Channel[];
  display: string;
  grid_number: number;
  enable_detail: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  display: string;
  image: Image;
  enable_detail: boolean;
  sources: Source[];
  label: null | string;
  share: Share;
  org_metadata: Orgmetadata;
}

interface Orgmetadata {
  image: string;
  title: string;
  description: string;
}

interface Share {
  url: string;
}

interface Source {
  id: string;
  name: string;
  contents: Content[];
}

interface Content {
  id: string;
  name: string;
  streams: Stream[];
}

interface Stream {
  id: string;
  name: string;
  stream_links: Streamlink[];
}

interface Streamlink {
  id: string;
  name: string;
  url: string;
  type: string;
  request_headers?: Requestheader[];
  comments: Comment[];
  default: boolean;
}

interface Comment {
  name: string;
  url: string;
  request_headers: Requestheader[];
}

interface Requestheader {
  key: string;
  value: string;
}

interface Image {
  type: string;
  url: string;
  width: number;
  height: number;
}

interface PageInfo {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

interface Paging {
  page_key: string;
  size_key: string;
}
