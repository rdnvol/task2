export interface CollectionType {
  body_html: string | null;
  handle: string;
  id: number;
  published_at: string;
  published_scope: string;
  sort_order: string;
  template_suffix: string | null;
  title: string;
  updated_at: string;
}

export interface PreviewImageType {
  aspect_ratio: number;
  height: number;
  src: string;
  width: number;
}

export interface MediaType {
  alt: string | null;
  aspect_ratio: number;
  height: number;
  id: number;
  media_type: string;
  position: number;
  preview_image: PreviewImageType;
  src: string;
  width: number;
}

export interface VariantType {
  available: boolean;
  barcode: string;
  compare_at_price: number;
  featured_image: string | null;
  id: number;
  inventory_management: string;
  name: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  options: string[] | null;
  price: number;
  public_title: string | null;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  weight: number;
}

export interface OptionWithValuesType {
  name: string;
  position: number;
  values: string[] | [];
  selected_value?: string | null;
}

export interface ProductType {
  available: true;
  collections: CollectionType[];
  compare_at_price: number;
  compare_at_price_max: number;
  compare_at_price_min: number;
  compare_at_price_varies: boolean;
  description: string;
  featured_image: string | null;
  featured_media: MediaType;
  first_available_variant: VariantType;
  gift_card: boolean | null;
  handle: string;
  has_only_default_variant: boolean | null;
  id: number;
  images: string[];
  media: MediaType[];
  options: string[];
  options_by_name: any;
  options_with_values: OptionWithValuesType[];
  price: number;
  price_max: number;
  price_min: number;
  price_varies: boolean;
  published_at: (string | boolean | string)[];
  requires_selling_plan: boolean | null;
  selected_or_first_available_selling_plan_allocation: object | null;
  selected_or_first_available_variant: VariantType;
  selected_selling_plan: string | null;
  selected_selling_plan_allocation: string | null;
  selected_variant: VariantType | null;
  selling_plan_groups: string[] | [];
  tags: string[] | [];
  template_suffix: string | null;
  title: string;
  type: string;
  url: string;
  variants: VariantType[];
  vendor: any;
}

export interface ImageType {
  src?: string;
  sizes: string[];
  alt?: string;
  ratio?: number;
}

export interface ButtonType {
  type: string;
  text: string;
  className?: string;
  name?: string;
  onClick?: () => void;
  disabled?: boolean;
  other?: any;
  data_attribute?: string;
}

export type AddItemType = (
  id: string,
  options: { quantity?: number; properties?: object }
) => Promise<any>;
