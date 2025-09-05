export interface LiveRespone {
  status: number;
  message: string;
  data: Daum[];
  token: string;
  size: number;
  hasNextPage: boolean;
}

export interface Daum {
  id: string;
  title: string;
  description: string;
  gender: string;
  tags: string;
  tagList: any;
  sexualOrientation: string;
  category_id: number;
  category_name: string;
  status: string;
  cover_image_url: string;
  user_id: string;
  nick_name: string;
  avatar_url: string;
  viewer_count: number;
  start_stream_time: string;
  rtc: boolean;
  play_back_url: string;
  subscribers: number;
}
