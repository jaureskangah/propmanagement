export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      document_history: {
        Row: {
          category: string | null
          content: string
          created_at: string
          document_type: string | null
          file_url: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          document_type?: string | null
          file_url: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          document_type?: string | null
          file_url?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          category: string
          content: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          vendor_id: string | null
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
          vendor_id?: string | null
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
          vendor_id?: string | null
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
          {
            foreignKeyName: "maintenance_expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
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
          tenant_feedback: string | null
          tenant_id: string | null
          tenant_notified: boolean | null
          tenant_rating: number | null
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
          tenant_feedback?: string | null
          tenant_id?: string | null
          tenant_notified?: boolean | null
          tenant_rating?: number | null
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
          tenant_feedback?: string | null
          tenant_id?: string | null
          tenant_notified?: boolean | null
          tenant_rating?: number | null
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
          has_reminder: boolean | null
          id: string
          is_recurring: boolean | null
          photos: string[] | null
          position: number | null
          priority: string | null
          property_id: string | null
          recurrence_pattern: Json | null
          reminder_date: string | null
          reminder_method: string | null
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
          has_reminder?: boolean | null
          id?: string
          is_recurring?: boolean | null
          photos?: string[] | null
          position?: number | null
          priority?: string | null
          property_id?: string | null
          recurrence_pattern?: Json | null
          reminder_date?: string | null
          reminder_method?: string | null
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
          has_reminder?: boolean | null
          id?: string
          is_recurring?: boolean | null
          photos?: string[] | null
          position?: number | null
          priority?: string | null
          property_id?: string | null
          recurrence_pattern?: Json | null
          reminder_date?: string | null
          reminder_method?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string
          email_updates: boolean | null
          first_name: string | null
          id: string
          is_tenant_user: boolean | null
          last_name: string | null
          phone: string | null
          position: string | null
          push_notifications: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email: string
          email_updates?: boolean | null
          first_name?: string | null
          id: string
          is_tenant_user?: boolean | null
          last_name?: string | null
          phone?: string | null
          position?: string | null
          push_notifications?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string
          email_updates?: boolean | null
          first_name?: string | null
          id?: string
          is_tenant_user?: boolean | null
          last_name?: string | null
          phone?: string | null
          position?: string | null
          push_notifications?: boolean | null
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
      rent_payment_reminders: {
        Row: {
          created_at: string
          email_sent: boolean | null
          id: string
          reminder_date: string
          reminder_type: string
          sent_at: string
          status: string
          target_month: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_sent?: boolean | null
          id?: string
          reminder_date: string
          reminder_type?: string
          sent_at?: string
          status?: string
          target_month: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_sent?: boolean | null
          id?: string
          reminder_date?: string
          reminder_type?: string
          sent_at?: string
          status?: string
          target_month?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_payment_reminders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          category: string | null
          created_at: string
          document_type: string | null
          file_url: string | null
          id: string
          name: string
          tenant_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          document_type?: string | null
          file_url?: string | null
          id?: string
          name: string
          tenant_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          document_type?: string | null
          file_url?: string | null
          id?: string
          name?: string
          tenant_id?: string | null
          uploaded_by?: string | null
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
          disable_reminders: boolean | null
          email: string
          id: string
          lease_end: string
          lease_start: string
          name: string
          notes: string | null
          phone: string | null
          property_id: string | null
          rent_amount: number
          security_deposit: number | null
          tenant_profile_id: string | null
          unit_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disable_reminders?: boolean | null
          email: string
          id?: string
          lease_end: string
          lease_start: string
          name: string
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          rent_amount: number
          security_deposit?: number | null
          tenant_profile_id?: string | null
          unit_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          disable_reminders?: boolean | null
          email?: string
          id?: string
          lease_end?: string
          lease_start?: string
          name?: string
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          rent_amount?: number
          security_deposit?: number | null
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      get_user_tenant_data: {
        Args: { p_user_id: string }
        Returns: {
          tenant_id: string
          tenant_name: string
          tenant_email: string
          property_name: string
          is_tenant: boolean
        }[]
      }
      has_role: {
        Args: { role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      link_tenant_profile: {
        Args: { p_tenant_id: string; p_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
