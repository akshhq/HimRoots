// =============================================================================
// HIMROOTS WELLNESS — SUPABASE DATABASE TYPES
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type EmailStatus = 'pending' | 'sent' | 'failed';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'received' | 'packed';
export type InquiryStatus = 'unread' | 'read' | 'responded' | 'archived';

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tagline: string | null;
          script_quote: string | null;
          description: string;
          price: number;
          original_price: number | null;
          volume: string | null;
          images: string[];
          category: string;
          ingredients: string[];
          detailed_ingredients: Json;
          benefits: string[];
          certifications: string[];
          directions: string[];
          packaging_feature: string | null;
          stock_status: StockStatus;
          stock_quantity: number;
          rating: number;
          reviews_count: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          tagline?: string | null;
          script_quote?: string | null;
          description: string;
          price: number;
          original_price?: number | null;
          volume?: string | null;
          images?: string[];
          category: string;
          ingredients?: string[];
          detailed_ingredients?: Json;
          benefits?: string[];
          certifications?: string[];
          directions?: string[];
          packaging_feature?: string | null;
          stock_status?: StockStatus;
          stock_quantity?: number;
          rating?: number;
          reviews_count?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          tagline?: string | null;
          script_quote?: string | null;
          description?: string;
          price?: number;
          original_price?: number | null;
          volume?: string | null;
          images?: string[];
          category?: string;
          ingredients?: string[];
          detailed_ingredients?: Json;
          benefits?: string[];
          certifications?: string[];
          directions?: string[];
          packaging_feature?: string | null;
          stock_status?: StockStatus;
          stock_quantity?: number;
          rating?: number;
          reviews_count?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          email: string;
          phone: string;
          shipping_address: string;
          city: string;
          state: string;
          pincode: string;
          country: string;
          subtotal: number;
          shipping_fee: number;
          discount: number;
          total: number;
          payment_status: PaymentStatus;
          order_status: OrderStatus;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          email_status: EmailStatus;
          email_error: string | null;
          notes: string | null;
          paid_at: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_name: string;
          email: string;
          phone: string;
          shipping_address: string;
          city: string;
          state: string;
          pincode: string;
          country?: string;
          subtotal: number;
          shipping_fee?: number;
          discount?: number;
          total: number;
          payment_status?: PaymentStatus;
          order_status?: OrderStatus;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          email_status?: EmailStatus;
          email_error?: string | null;
          notes?: string | null;
          paid_at?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          email?: string;
          phone?: string;
          shipping_address?: string;
          city?: string;
          state?: string;
          pincode?: string;
          country?: string;
          subtotal?: number;
          shipping_fee?: number;
          discount?: number;
          total?: number;
          payment_status?: PaymentStatus;
          order_status?: OrderStatus;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          email_status?: EmailStatus;
          email_error?: string | null;
          notes?: string | null;
          paid_at?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          price: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          price: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          price?: number;
          subtotal?: number;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          name: string;
          phone: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          pincode: string;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          name: string;
          phone: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          pincode: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          name?: string;
          phone?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          pincode?: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_carts: {
        Row: {
          id: string;
          user_id: string;
          items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          items?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          items?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          order_id: string | null;
          category: string;
          subject: string;
          message: string;
          status: InquiryStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          order_id?: string | null;
          category?: string;
          subject?: string;
          message: string;
          status?: InquiryStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          order_id?: string | null;
          category?: string;
          subject?: string;
          message?: string;
          status?: InquiryStatus;
          created_at?: string;
        };
      };
    };
  };
}

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type AddressRow = Database['public']['Tables']['addresses']['Row'];
export type AddressInsert = Database['public']['Tables']['addresses']['Insert'];
export type AddressUpdate = Database['public']['Tables']['addresses']['Update'];

export type UserCartRow = Database['public']['Tables']['user_carts']['Row'];
export type UserCartInsert = Database['public']['Tables']['user_carts']['Insert'];
export type UserCartUpdate = Database['public']['Tables']['user_carts']['Update'];

export type ContactInquiryRow = Database['public']['Tables']['contact_inquiries']['Row'];
export type ContactInquiryInsert = Database['public']['Tables']['contact_inquiries']['Insert'];
