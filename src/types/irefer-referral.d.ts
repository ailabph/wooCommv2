export interface IReferReferral {
  title: string;
  product_title: string;
  product_id: string;
  product_image: string;
  product_referal_url: string;
  store_url: string;
  ireferal_code: string;
  product_description?: string;
  user_id: string;
  rec_id?: string;
  vendor_id: string;
  custom_image?: string;
  custom_video?: string;
  custom_description?: string;
  created_at?: string;
  updated_at?: string;
  referral_origin_url: string;
  referral_shorten_url?: string;
  total_click?: number;
  total_impression_click?: number;
}
