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
          category: string | null
          created_at: string
          created_by: string
          id: string
          instructions: string | null
          title: string
          video_path: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string
          id?: string
          instructions?: string | null
          title: string
          video_path?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
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
      joined_teams: {
        Row: {
          created_at: string
          id: string
          team_id: string
          tier: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_id?: string
          tier: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          team_id?: string
          tier?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "joined_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "joined_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          team_id: string
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
          team_id: string
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
          team_id?: string
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
          {
            foreignKeyName: "programs_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
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
      teams: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          image_path: string | null
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          payments_enabled: boolean
          profile_picture_path: string | null
          profile_picture_url: string | null
          stripe_account_id: string | null
          team_id: string | null
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          payments_enabled?: boolean
          profile_picture_path?: string | null
          profile_picture_url?: string | null
          stripe_account_id?: string | null
          team_id?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          payments_enabled?: boolean
          profile_picture_path?: string | null
          profile_picture_url?: string | null
          stripe_account_id?: string | null
          team_id?: string | null
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
          {
            foreignKeyName: "users_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          created_at: string
          created_by: string
          exercise_id: string
          exercise_number: number
          id: string
          other: string | null
          reps: number
          sets: number
          title: string
          workout_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          exercise_id?: string
          exercise_number?: number
          id?: string
          other?: string | null
          reps?: number
          sets?: number
          title: string
          workout_id?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          exercise_id?: string
          exercise_number?: number
          id?: string
          other?: string | null
          reps?: number
          sets?: number
          title?: string
          workout_id?: string
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
          day: string
          description: string | null
          id: string
          is_free: boolean
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
          is_free?: boolean
          program_id: string
          title: string
          week: number
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
          week?: number
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
