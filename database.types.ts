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
      articles: {
        Row: {
          collection_id: string
          content: string
          created_at: string
          created_by: string
          free: boolean
          id: string
          image_path: string | null
          image_url: string | null
          title: string
        }
        Insert: {
          collection_id?: string
          content: string
          created_at?: string
          created_by?: string
          free?: boolean
          id?: string
          image_path?: string | null
          image_url?: string | null
          title: string
        }
        Update: {
          collection_id?: string
          content?: string
          created_at?: string
          created_by?: string
          free?: boolean
          id?: string
          image_path?: string | null
          image_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          created_by: string
          id: string
          instructions: string | null
          title: string
          video_path: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          instructions?: string | null
          title: string
          video_path?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          instructions?: string | null
          title?: string
          video_path?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      program_workouts: {
        Row: {
          created_at: string
          created_by: string
          day: string
          description: string | null
          id: string
          program_id: string
          title: string
          week: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          day: string
          description?: string | null
          id?: string
          program_id?: string
          title: string
          week: number
        }
        Update: {
          created_at?: string
          created_by?: string
          day?: string
          description?: string | null
          id?: string
          program_id?: string
          title?: string
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_workouts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_workouts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          description: string | null
          free: boolean
          id: string
          image_path: string | null
          image_url: string | null
          price: number
          private: boolean
          title: string
          weeks: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          free?: boolean
          id?: string
          image_path?: string | null
          image_url?: string | null
          price?: number
          private?: boolean
          title: string
          weeks?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          free?: boolean
          id?: string
          image_path?: string | null
          image_url?: string | null
          price?: number
          private?: boolean
          title?: string
          weeks?: number
        }
        Relationships: [
          {
            foreignKeyName: "programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchased_programs: {
        Row: {
          created_at: string
          created_by: string
          id: string
          program_id: string
          purchased_by: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          program_id?: string
          purchased_by?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          program_id?: string
          purchased_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchased_programs_purchased_by_fkey"
            columns: ["purchased_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_workouts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string
          subscribed_to: string
          subscriber: string
          tier: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id: string
          subscribed_to?: string
          subscriber?: string
          tier?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string
          subscribed_to?: string
          subscriber?: string
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_subscribed_to_fkey"
            columns: ["subscribed_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_subscriber_fkey"
            columns: ["subscriber"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          payments_enabled: boolean
          profile_picture_path: string | null
          profile_picture_url: string | null
          stripe_account_id: string | null
          stripe_price_id: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          payments_enabled?: boolean
          profile_picture_path?: string | null
          profile_picture_url?: string | null
          stripe_account_id?: string | null
          stripe_price_id?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          payments_enabled?: boolean
          profile_picture_path?: string | null
          profile_picture_url?: string | null
          stripe_account_id?: string | null
          stripe_price_id?: string | null
          username?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string
          created_by: string
          exercise_id: string
          exercise_number: number
          id: string
          other: string | null
          program_workout_id: string | null
          reps: number | null
          sets: number | null
          time: string | null
          workout_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          exercise_id?: string
          exercise_number: number
          id?: string
          other?: string | null
          program_workout_id?: string | null
          reps?: number | null
          sets?: number | null
          time?: string | null
          workout_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          exercise_id?: string
          exercise_number?: number
          id?: string
          other?: string | null
          program_workout_id?: string | null
          reps?: number | null
          sets?: number | null
          time?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_program_workout_id_fkey"
            columns: ["program_workout_id"]
            isOneToOne: false
            referencedRelation: "program_workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_library_workout_exercises: {
        Args: {
          workout_id_input: string
          deleted_exercise_number: number
        }
        Returns: undefined
      }
      decrement_program_workout_exercises: {
        Args: {
          program_workout_id_input: string
          deleted_exercise_number: number
        }
        Returns: undefined
      }
      delete_user:
        | {
            Args: Record<PropertyKey, never>
            Returns: undefined
          }
        | {
            Args: {
              user_id: string
            }
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
