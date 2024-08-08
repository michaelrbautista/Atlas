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
      exercises: {
        Row: {
          created_at: string
          created_by: string | null
          exercise_number: number | null
          id: string
          instructions: string | null
          name: string | null
          reps: string | null
          sets: string | null
          video_path: string | null
          video_url: string | null
          workout_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          exercise_number?: number | null
          id?: string
          instructions?: string | null
          name?: string | null
          reps?: string | null
          sets?: string | null
          video_path?: string | null
          video_url?: string | null
          workout_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          exercise_number?: number | null
          id?: string
          instructions?: string | null
          name?: string | null
          reps?: string | null
          sets?: string | null
          video_path?: string | null
          video_url?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          category: string
          created_at: string
          created_by: string
          currency: string
          description: string | null
          id: string
          image_path: string | null
          image_url: string | null
          is_free: boolean
          price: string
          title: string
          weeks: number
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          is_free?: boolean
          price: string
          title: string
          weeks?: number
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          is_free?: boolean
          price?: string
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
          {
            foreignKeyName: "saved_workouts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      sign_ups: {
        Row: {
          created_at: string
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          details_submitted: boolean
          email: string
          full_name: string
          id: string
          profile_picture_path: string | null
          profile_picture_url: string | null
          stripe_account_id: string | null
          username: string
        }
        Insert: {
          created_at?: string
          details_submitted?: boolean
          email: string
          full_name: string
          id?: string
          profile_picture_path?: string | null
          profile_picture_url?: string | null
          stripe_account_id?: string | null
          username: string
        }
        Update: {
          created_at?: string
          details_submitted?: boolean
          email?: string
          full_name?: string
          id?: string
          profile_picture_path?: string | null
          profile_picture_url?: string | null
          stripe_account_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string
          created_by: string
          day: string
          description: string | null
          id: string
          is_free: boolean
          program_id: string
          title: string
          week_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          day: string
          description?: string | null
          id?: string
          is_free?: boolean
          program_id: string
          title: string
          week_number: number
        }
        Update: {
          created_at?: string
          created_by?: string
          day?: string
          description?: string | null
          id?: string
          is_free?: boolean
          program_id?: string
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "workouts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
