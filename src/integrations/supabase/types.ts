export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appellations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string | null
          id: string
          organic: boolean | null
          product_id: string | null
          vegan: boolean | null
          vegetarian: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organic?: boolean | null
          product_id?: string | null
          vegan?: boolean | null
          vegetarian?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organic?: boolean | null
          product_id?: string | null
          vegan?: boolean | null
          vegetarian?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      food_business_operator: {
        Row: {
          additional_information: string | null
          address: string | null
          created_at: string | null
          id: string
          name: string | null
          product_id: string | null
          type: string | null
        }
        Insert: {
          additional_information?: string | null
          address?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          product_id?: string | null
          type?: string | null
        }
        Update: {
          additional_information?: string | null
          address?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          product_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_business_operator_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          allergen: string | null
          category: string
          created_at: string | null
          e_number: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          allergen?: string | null
          category?: string
          created_at?: string | null
          e_number?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          allergen?: string | null
          category?: string
          created_at?: string | null
          e_number?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nutrition_info: {
        Row: {
          carbohydrate: number | null
          created_at: string | null
          energy_kcal: number | null
          energy_kj: number | null
          fat: number | null
          id: string
          product_id: string | null
          protein: number | null
          salt: number | null
          saturates: number | null
          sugars: number | null
        }
        Insert: {
          carbohydrate?: number | null
          created_at?: string | null
          energy_kcal?: number | null
          energy_kj?: number | null
          fat?: number | null
          id?: string
          product_id?: string | null
          protein?: number | null
          salt?: number | null
          saturates?: number | null
          sugars?: number | null
        }
        Update: {
          carbohydrate?: number | null
          created_at?: string | null
          energy_kcal?: number | null
          energy_kj?: number | null
          fat?: number | null
          id?: string
          product_id?: string | null
          protein?: number | null
          salt?: number | null
          saturates?: number | null
          sugars?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_info_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ingredients: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string | null
          order_number: number
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          order_number?: number
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          order_number?: number
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          alcohol: string | null
          appellation_id: string | null
          brand: string | null
          country_of_origin: string | null
          created_at: string | null
          ean_gtin: string | null
          external_short_link: string | null
          id: string
          image_url: string | null
          name: string
          net_volume: string | null
          qr_code_url: string | null
          redirect_link: string | null
          sku_code: string | null
          sugar_content: string | null
          type: string | null
          updated_at: string | null
          user_id: string
          vintage: string | null
        }
        Insert: {
          alcohol?: string | null
          appellation_id?: string | null
          brand?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          ean_gtin?: string | null
          external_short_link?: string | null
          id?: string
          image_url?: string | null
          name: string
          net_volume?: string | null
          qr_code_url?: string | null
          redirect_link?: string | null
          sku_code?: string | null
          sugar_content?: string | null
          type?: string | null
          updated_at?: string | null
          user_id: string
          vintage?: string | null
        }
        Update: {
          alcohol?: string | null
          appellation_id?: string | null
          brand?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          ean_gtin?: string | null
          external_short_link?: string | null
          id?: string
          image_url?: string | null
          name?: string
          net_volume?: string | null
          qr_code_url?: string | null
          redirect_link?: string | null
          sku_code?: string | null
          sugar_content?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
          vintage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_appellation_id_fkey"
            columns: ["appellation_id"]
            isOneToOne: false
            referencedRelation: "appellations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      responsible_consumption: {
        Row: {
          age_warning: boolean | null
          created_at: string | null
          driving_warning: boolean | null
          id: string
          pregnancy_warning: boolean | null
          product_id: string | null
        }
        Insert: {
          age_warning?: boolean | null
          created_at?: string | null
          driving_warning?: boolean | null
          id?: string
          pregnancy_warning?: boolean | null
          product_id?: string | null
        }
        Update: {
          age_warning?: boolean | null
          created_at?: string | null
          driving_warning?: boolean | null
          id?: string
          pregnancy_warning?: boolean | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responsible_consumption_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
