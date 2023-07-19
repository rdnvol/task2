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

export interface FeaturedImageType extends PreviewImageType {
  alt: string | null;
  url: string | null;
}

export interface MediaType extends PreviewImageType {
  alt: string | null;
  id: number;
  media_type: string;
  position: number;
  preview_image: PreviewImageType;
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
  position?: number;
  values?: string[] | [];
  value?: string | null;
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
  published_at: (string | boolean)[];
  requires_selling_plan: boolean | null;
  selected_or_first_available_selling_plan_allocation: object | null;
  selected_or_first_available_variant: VariantType;
  selected_selling_plan: string | null;
  selected_selling_plan_allocation: string | null;
  selected_variant: VariantType | null;
  selling_plan_groups: string[] | [];
  tags: string[];
  template_suffix: string | null;
  title: string;
  type: string;
  url: string;
  variants: VariantType[];
  vendor: any;
  metafields?: any;
}

export interface ImageType {
  src?: string;
  sizes: string[];
  mediaWidth?: number[];
  alt?: string;
  ratio?: number;
  lazyload?: boolean;
}

export interface ButtonType {
  type: JSX.IntrinsicElements['button']['type'];
  text: string;
  className?: string;
  name?: string;
  onClick?: () => void;
  disabled?: boolean;
  other?: any;
  data_attribute?: string;
}

export interface CartItem {
  discounted_price: number;
  discounts: any[];
  featured_image: FeaturedImageType;
  final_line_price: number | null;
  final_price: number | null;
  gift_card: boolean;
  grams: number;
  handle: string;
  id: number;
  image: string;
  key: string;
  line_level_discount_allocations: any[];
  line_level_total_discount: number;
  line_price: number;
  options_with_values: OptionWithValuesType[];
  original_line_price: number;
  original_price: number;
  price: number;
  product_description: string;
  product_has_only_default_variant: boolean;
  product_id: number;
  product_title: string | null;
  product_type: string | null;
  properties: { [key: string]: string };
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: number;
  url: string | null;
  variant_id: number;
  variant_options: string[];
  variant_title: string | null;
  vendor: string;
}

export interface CartType {
  attributes?: string | null;
  cart_level_discount_applications?: any;
  currency?: string | null;
  discount_applications?: any;
  item_count: number;
  items: CartItem[] | [];
  items_subtotal_price: number;
  note: string | null;
  original_total_price: number;
  taxes_included: boolean;
  total_discount: number;
  total_price: number;
  total_weight: number;
}

export type AddItemType = (id: string, options: { quantity?: number; properties?: object }) => Promise<any>;
