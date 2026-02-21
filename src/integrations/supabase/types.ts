export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          approved: boolean | null
          author_email: string | null
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          approved?: boolean | null
          author_email?: string | null
          author_name: string
          content: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          approved?: boolean | null
          author_email?: string | null
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          images: Json | null
          published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          videos: Json | null
          view_count: number
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          images?: Json | null
          published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          videos?: Json | null
          view_count?: number
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          images?: Json | null
          published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          videos?: Json | null
          view_count?: number
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string | null
          display_order: number | null
          hidden: boolean
          icon_emoji: string
          id: string
          image_url: string | null
          issuer: string
          link_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          hidden?: boolean
          icon_emoji?: string
          id?: string
          image_url?: string | null
          issuer: string
          link_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          hidden?: boolean
          icon_emoji?: string
          id?: string
          image_url?: string | null
          issuer?: string
          link_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_content: {
        Row: {
          created_at: string | null
          description: string
          email: string | null
          heading: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          email?: string | null
          heading?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          email?: string | null
          heading?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          degree: string
          duration: string
          id: string
          image_url: string | null
          institution: string
          link_url: string | null
          logo_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          degree: string
          duration: string
          id?: string
          image_url?: string | null
          institution: string
          link_url?: string | null
          logo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          degree?: string
          duration?: string
          id?: string
          image_url?: string | null
          institution?: string
          link_url?: string | null
          logo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          caption: string | null
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          images: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          images?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          images?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string | null
          description: string
          display_order: number | null
          duration: string
          icon_name: string
          id: string
          image_url: string | null
          link_url: string | null
          logo_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          description: string
          display_order?: number | null
          duration: string
          icon_name?: string
          id?: string
          image_url?: string | null
          link_url?: string | null
          logo_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string
          display_order?: number | null
          duration?: string
          icon_name?: string
          id?: string
          image_url?: string | null
          link_url?: string | null
          logo_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      extracurricular_activities: {
        Row: {
          color_gradient: string
          created_at: string
          display_order: number | null
          icon_name: string
          id: string
          image_url: string | null
          logo_url: string | null
          organization: string
          title: string
          updated_at: string
        }
        Insert: {
          color_gradient?: string
          created_at?: string
          display_order?: number | null
          icon_name?: string
          id?: string
          image_url?: string | null
          logo_url?: string | null
          organization: string
          title: string
          updated_at?: string
        }
        Update: {
          color_gradient?: string
          created_at?: string
          display_order?: number | null
          icon_name?: string
          id?: string
          image_url?: string | null
          logo_url?: string | null
          organization?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      extracurricular_content: {
        Row: {
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      footer_content: {
        Row: {
          copyright_text: string
          created_at: string | null
          id: string
          show_year: boolean | null
          updated_at: string | null
        }
        Insert: {
          copyright_text?: string
          created_at?: string | null
          id?: string
          show_year?: boolean | null
          updated_at?: string | null
        }
        Update: {
          copyright_text?: string
          created_at?: string | null
          id?: string
          show_year?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          created_at: string | null
          facebook_url: string | null
          github_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          name: string
          profile_image_url: string | null
          resume_url: string | null
          site_title: string | null
          tagline: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          facebook_url?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name: string
          profile_image_url?: string | null
          resume_url?: string | null
          site_title?: string | null
          tagline: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          facebook_url?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          profile_image_url?: string | null
          resume_url?: string | null
          site_title?: string | null
          tagline?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_social_links: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_name: string
          id: string
          label: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string
          id?: string
          label: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string
          id?: string
          label?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          display_order: number | null
          href: string
          id: string
          is_route: boolean
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          href: string
          id?: string
          is_route?: boolean
          label: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          href?: string
          id?: string
          is_route?: boolean
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          icon_name: string
          id: string
          image_url: string | null
          images: Json | null
          link_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          icon_name?: string
          id?: string
          image_url?: string | null
          images?: Json | null
          link_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          icon_name?: string
          id?: string
          image_url?: string | null
          images?: Json | null
          link_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      running_ads: {
        Row: {
          active: boolean | null
          created_at: string
          description: string
          display_order: number | null
          id: string
          image_url: string | null
          link_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          created_at: string
          id: string
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          page_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          page_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          page_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          color_gradient: string
          created_at: string | null
          display_order: number | null
          icon_name: string
          id: string
          image_url: string | null
          link_url: string | null
          skill_name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          color_gradient?: string
          created_at?: string | null
          display_order?: number | null
          icon_name?: string
          id?: string
          image_url?: string | null
          link_url?: string | null
          skill_name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          color_gradient?: string
          created_at?: string | null
          display_order?: number | null
          icon_name?: string
          id?: string
          image_url?: string | null
          link_url?: string | null
          skill_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
