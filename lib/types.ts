export interface Space {
  id: string;
  owner_id: string;
  title: string;
  city: string;
  metro: string;
  price_per_hour: number;
  description: string | null;
  tags: string[];
  images: string[];
  phone: string | null;
  created_at: string;
  is_promoted: boolean;
}

export interface Review {
  id: string;
  space_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}
