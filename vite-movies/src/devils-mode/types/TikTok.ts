export interface RootTiktok {
  code: number;
  data: Data;
  msg: string;
  status: boolean;
}

export interface Data {
  total: number;
  list: List[];
}

export interface List {
  title: string;
  short_video_url: string;
  duration: string;
  status: number;
  locale: string;
  video_type: string;
  price: number;
  updated_at: string;
  created_at: string;
  sexual_orientation: string;
  is_long: number;
  need_vip: number;
  username: string;
  nickname: string;
  sex: number;
  is_auth: boolean;
  id: number;
  user_id: number;
  category_id: number;
  like_num: number;
  share_num: number;
  view_num: number;
  comment_num: number;
  collect_num: number;
  vip_end_time: number;
  tags: Tag[];
  is_vip: number;
  slug: string;
  is_follow: number;
  is_like: number;
  is_bought: number;
  avatar: string;
  thumb: string;
  video_url: string;
}

export interface Tag {
  id: number;
  slug: string;
  name: string;
}
