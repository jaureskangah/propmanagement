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
      admin_metrics: {
        Row: {
          active_users: number
          created_at: string
          id: string
          metric_date: string
          total_properties: number
          total_revenue: number
          total_tenants: number
          total_users: number
          updated_at: string
        }
        Insert: {
          active_users?: number
          created_at?: string
          id?: string
          metric_date?: string
          total_properties?: number
          total_revenue?: number
          total_tenants?: number
          total_users?: number
          updated_at?: string
        }
        Update: {
          active_users?: number
          created_at?: string
          id?: string
          metric_date?: string
          total_properties?: number
          total_revenue?: number
          total_tenants?: number
          total_users?: number
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      dashboard_preferences: {
        Row: {
          created_at: string
          custom_filters: Json | null
          hidden_sections: string[] | null
          id: string
          updated_at: string
          user_id: string
          widget_order: string[] | null
        }
        Insert: {
          created_at?: string
          custom_filters?: Json | null
          hidden_sections?: string[] | null
          id?: string
          updated_at?: string
          user_id: string
          widget_order?: string[] | null
        }
        Update: {
          created_at?: string
          custom_filters?: Json | null
          hidden_sections?: string[] | null
          id?: string
          updated_at?: string
          user_id?: string
          widget_order?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_budgets: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          property_id: string | null
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          property_id?: string | null
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          property_id?: string | null
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_budgets_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_expenses: {
        Row: {
          amount: number
          budget_id: string | null
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          property_id: string | null
          unit_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          budget_id?: string | null
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          property_id?: string | null
          unit_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          budget_id?: string | null
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          property_id?: string | null
          unit_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_expenses_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "maintenance_budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          created_at: string
          deadline: string | null
          description: string
          id: string
          is_from_tenant: boolean | null
          issue: string
          notification_sent: boolean | null
          photos: string[] | null
          priority: string
          status: string
          tenant_id: string | null
          tenant_notified: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          is_from_tenant?: boolean | null
          issue: string
          notification_sent?: boolean | null
          photos?: string[] | null
          priority?: string
          status?: string
          tenant_id?: string | null
          tenant_notified?: boolean | null
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          is_from_tenant?: boolean | null
          issue?: string
          notification_sent?: boolean | null
          photos?: string[] | null
          priority?: string
          status?: string
          tenant_id?: string | null
          tenant_notified?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_task_templates: {
        Row: {
          created_at: string
          id: string
          priority: string | null
          recurrence_pattern: Json
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          priority?: string | null
          recurrence_pattern: Json
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          priority?: string | null
          recurrence_pattern?: Json
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      maintenance_tasks: {
        Row: {
          completed: boolean | null
          created_at: string
          date: string
          id: string
          is_recurring: boolean | null
          photos: string[] | null
          position: number | null
          priority: string | null
          recurrence_pattern: Json | null
          status: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          date: string
          id?: string
          is_recurring?: boolean | null
          photos?: string[] | null
          position?: number | null
          priority?: string | null
          recurrence_pattern?: Json | null
          status?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          date?: string
          id?: string
          is_recurring?: boolean | null
          photos?: string[] | null
          position?: number | null
          priority?: string | null
          recurrence_pattern?: Json | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_tenant_user: boolean | null
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_tenant_user?: boolean | null
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_tenant_user?: boolean | null
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          type: string
          units: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          type: string
          units?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          type?: string
          units?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_communications: {
        Row: {
          attachments: string[] | null
          category: string
          content: string | null
          created_at: string
          id: string
          is_from_tenant: boolean | null
          parent_id: string | null
          resolved_at: string | null
          status: string
          subject: string
          tenant_id: string | null
          tenant_notified: boolean | null
          type: string
        }
        Insert: {
          attachments?: string[] | null
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          is_from_tenant?: boolean | null
          parent_id?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          tenant_id?: string | null
          tenant_notified?: boolean | null
          type: string
        }
        Update: {
          attachments?: string[] | null
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          is_from_tenant?: boolean | null
          parent_id?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          tenant_id?: string | null
          tenant_notified?: boolean | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_communications_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tenant_communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_communications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_documents: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          name: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          name: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          name?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          status: string
          tenant_id: string | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          status?: string
          tenant_id?: string | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          status?: string
          tenant_id?: string | null
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_date: string
          status: string
          tenant_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_date: string
          status: string
          tenant_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_date?: string
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          email: string
          id: string
          lease_end: string
          lease_start: string
          name: string
          phone: string | null
          property_id: string | null
          rent_amount: number
          tenant_profile_id: string | null
          unit_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          lease_end: string
          lease_start: string
          name: string
          phone?: string | null
          property_id?: string | null
          rent_amount: number
          tenant_profile_id?: string | null
          unit_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          lease_end?: string
          lease_start?: string
          name?: string
          phone?: string | null
          property_id?: string | null
          rent_amount?: number
          tenant_profile_id?: string | null
          unit_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_tenant_profile_id_fkey"
            columns: ["tenant_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_documents: {
        Row: {
          created_at: string
          file_url: string
          id: string
          name: string
          type: string
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          name: string
          type: string
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          name?: string
          type?: string
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_interventions: {
        Row: {
          cost: number | null
          created_at: string
          date: string
          description: string
          id: string
          photos: string[] | null
          priority: string
          property_id: string | null
          status: string
          title: string
          unit_number: string | null
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string
          date: string
          description: string
          id?: string
          photos?: string[] | null
          priority?: string
          property_id?: string | null
          status?: string
          title: string
          unit_number?: string | null
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          photos?: string[] | null
          priority?: string
          property_id?: string | null
          status?: string
          title?: string
          unit_number?: string | null
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_interventions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_interventions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_interventions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          price_rating: number | null
          punctuality_rating: number | null
          quality_rating: number | null
          rating: number
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          price_rating?: number | null
          punctuality_rating?: number | null
          quality_rating?: number | null
          rating: number
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          price_rating?: number | null
          punctuality_rating?: number | null
          quality_rating?: number | null
          rating?: number
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          created_at: string
          email: string
          emergency_contact: boolean | null
          id: string
          name: string
          phone: string
          photos: string[] | null
          rating: number | null
          specialty: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          emergency_contact?: boolean | null
          id?: string
          name: string
          phone: string
          photos?: string[] | null
          rating?: number | null
          specialty: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          emergency_contact?: boolean | null
          id?: string
          name?: string
          phone?: string
          photos?: string[] | null
          rating?: number | null
          specialty?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_and_insert_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
