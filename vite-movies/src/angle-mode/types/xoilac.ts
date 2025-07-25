export interface XoiLac {
  id: string;
  name: string;
  color: string;
  url: string;
  description: string;
  image: Image;
  groups: Group2[];
  sorts: Sort[];
  org_metadata: Orgmetadata;
}

export interface Sort {
  type: string;
  text: string;
  url?: string;
}

interface Group2 {
  id: string;
  name: string;
  channels?: Channel[];
  display: string;
  grid_number?: number;
  enable_detail?: boolean;
  remote_data?: Remotedata;
  groups?: Group[];
}

interface Group {
  id: string;
  name: string;
  display: string;
  content_display: string;
  image: Image2;
  href?: string;
}

interface Remotedata {
  url: string;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  display: string;
  image: Image2;
  enable_detail?: boolean;
  sources: Source[];
  label: null | null | string | string;
  org_metadata?: Orgmetadata;
}

interface Orgmetadata {
  image: string;
  title: string;
  description: string;
}

export interface Source {
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
  comments?: Comment[];
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

interface Image2 {
  type: string;
  url: string;
  width: number;
  height: number;
}

interface Image {
  type: string;
  url: string;
}
