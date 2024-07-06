/* eslint-disable max-lines */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      api_brain_definition: {
        Row: {
          brain_id: string;
          jq_instructions: string;
          method: string | null;
          params: Json | null;
          raw: boolean;
          search_params: Json | null;
          secrets: Json | null;
          url: string | null;
        };
        Insert: {
          brain_id: string;
          jq_instructions?: string;
          method?: string | null;
          params?: Json | null;
          raw?: boolean;
          search_params?: Json | null;
          secrets?: Json | null;
          url?: string | null;
        };
        Update: {
          brain_id?: string;
          jq_instructions?: string;
          method?: string | null;
          params?: Json | null;
          raw?: boolean;
          search_params?: Json | null;
          secrets?: Json | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "api_brain_definition_brain_id_fkey";
            columns: ["brain_id"];
            isOneToOne: true;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          }
        ];
      };
      api_keys: {
        Row: {
          api_key: string | null;
          creation_time: string | null;
          days: number | null;
          deleted_time: string | null;
          is_active: boolean | null;
          key_id: string;
          name: string | null;
          only_chat: boolean | null;
          user_id: string | null;
        };
        Insert: {
          api_key?: string | null;
          creation_time?: string | null;
          days?: number | null;
          deleted_time?: string | null;
          is_active?: boolean | null;
          key_id?: string;
          name?: string | null;
          only_chat?: boolean | null;
          user_id?: string | null;
        };
        Update: {
          api_key?: string | null;
          creation_time?: string | null;
          days?: number | null;
          deleted_time?: string | null;
          is_active?: boolean | null;
          key_id?: string;
          name?: string | null;
          only_chat?: boolean | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      assistants: {
        Row: {
          brain_id_required: boolean;
          file_1_required: boolean;
          id: string;
          name: string | null;
          url_required: boolean | null;
        };
        Insert: {
          brain_id_required?: boolean;
          file_1_required?: boolean;
          id?: string;
          name?: string | null;
          url_required?: boolean | null;
        };
        Update: {
          brain_id_required?: boolean;
          file_1_required?: boolean;
          id?: string;
          name?: string | null;
          url_required?: boolean | null;
        };
        Relationships: [];
      };
      brain_subscription_invitations: {
        Row: {
          brain_id: string;
          email: string;
          rights: string | null;
        };
        Insert: {
          brain_id: string;
          email: string;
          rights?: string | null;
        };
        Update: {
          brain_id?: string;
          email?: string;
          rights?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "brain_subscription_invitations_brain_id_fkey";
            columns: ["brain_id"];
            isOneToOne: false;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          }
        ];
      };
      brains: {
        Row: {
          brain_id: string;
          brain_type: Database["public"]["Enums"]["brain_type_enum"] | null;
          description: string;
          last_update: string | null;
          max_tokens: number | null;
          meaning: string | null;
          model: string | null;
          name: string | null;
          openai_api_key: string | null;
          prompt_id: string | null;
          status: string | null;
          tags: Database["public"]["Enums"]["tags"][] | null;
          temperature: number | null;
        };
        Insert: {
          brain_id?: string;
          brain_type?: Database["public"]["Enums"]["brain_type_enum"] | null;
          description?: string;
          last_update?: string | null;
          max_tokens?: number | null;
          meaning?: string | null;
          model?: string | null;
          name?: string | null;
          openai_api_key?: string | null;
          prompt_id?: string | null;
          status?: string | null;
          tags?: Database["public"]["Enums"]["tags"][] | null;
          temperature?: number | null;
        };
        Update: {
          brain_id?: string;
          brain_type?: Database["public"]["Enums"]["brain_type_enum"] | null;
          description?: string;
          last_update?: string | null;
          max_tokens?: number | null;
          meaning?: string | null;
          model?: string | null;
          name?: string | null;
          openai_api_key?: string | null;
          prompt_id?: string | null;
          status?: string | null;
          tags?: Database["public"]["Enums"]["tags"][] | null;
          temperature?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "brains_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          }
        ];
      };
      brains_users: {
        Row: {
          brain_id: string;
          default_brain: boolean | null;
          rights: string | null;
          user_id: string | null;
        };
        Insert: {
          brain_id: string;
          default_brain?: boolean | null;
          rights?: string | null;
          user_id?: string | null;
        };
        Update: {
          brain_id?: string;
          default_brain?: boolean | null;
          rights?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "brains_users_brain_id_fkey";
            columns: ["brain_id"];
            isOneToOne: false;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          },
          {
            foreignKeyName: "brains_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      brains_vectors: {
        Row: {
          brain_id: string;
          file_sha1: string | null;
          id: string;
          vector_id: string;
        };
        Insert: {
          brain_id: string;
          file_sha1?: string | null;
          id?: string;
          vector_id: string;
        };
        Update: {
          brain_id?: string;
          file_sha1?: string | null;
          id?: string;
          vector_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "brains_vectors_brain_id_fkey";
            columns: ["brain_id"];
            isOneToOne: false;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          },
          {
            foreignKeyName: "brains_vectors_vector_id_fkey";
            columns: ["vector_id"];
            isOneToOne: false;
            referencedRelation: "vectors";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_history: {
        Row: {
          assistant: string | null;
          brain_id: string | null;
          chat_id: string;
          message_id: string;
          message_time: string | null;
          metadata: Json | null;
          prompt_id: string | null;
          thumbs: boolean | null;
          user_message: string | null;
        };
        Insert: {
          assistant?: string | null;
          brain_id?: string | null;
          chat_id: string;
          message_id?: string;
          message_time?: string | null;
          metadata?: Json | null;
          prompt_id?: string | null;
          thumbs?: boolean | null;
          user_message?: string | null;
        };
        Update: {
          assistant?: string | null;
          brain_id?: string | null;
          chat_id?: string;
          message_id?: string;
          message_time?: string | null;
          metadata?: Json | null;
          prompt_id?: string | null;
          thumbs?: boolean | null;
          user_message?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_history_brain_id_fkey";
            columns: ["brain_id"];
            isOneToOne: false;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          },
          {
            foreignKeyName: "chat_history_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["chat_id"];
          },
          {
            foreignKeyName: "chat_history_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          }
        ];
      };
      chats: {
        Row: {
          chat_id: string;
          chat_name: string | null;
          creation_time: string | null;
          history: Json | null;
          user_id: string | null;
        };
        Insert: {
          chat_id?: string;
          chat_name?: string | null;
          creation_time?: string | null;
          history?: Json | null;
          user_id?: string | null;
        };
        Update: {
          chat_id?: string;
          chat_name?: string | null;
          creation_time?: string | null;
          history?: Json | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      composite_brain_connections: {
        Row: {
          composite_brain_id: string;
          connected_brain_id: string;
        };
        Insert: {
          composite_brain_id: string;
          connected_brain_id: string;
        };
        Update: {
          composite_brain_id?: string;
          connected_brain_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "composite_brain_connections_composite_brain_id_fkey";
            columns: ["composite_brain_id"];
            isOneToOne: false;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          },
          {
            foreignKeyName: "composite_brain_connections_connected_brain_id_fkey";
            columns: ["connected_brain_id"];
            isOneToOne: false;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          }
        ];
      };
      integrations: {
        Row: {
          allow_model_change: boolean;
          connection_settings: Json | null;
          created_at: string;
          description: string;
          id: string;
          information: string | null;
          integration_display_name: string;
          integration_logo_url: string | null;
          integration_name: string;
          integration_type: Database["public"]["Enums"]["integration_type"];
          max_files: number;
          onboarding_brain: boolean | null;
          tags: Database["public"]["Enums"]["brain_tags"][] | null;
        };
        Insert: {
          allow_model_change?: boolean;
          connection_settings?: Json | null;
          created_at?: string;
          description?: string;
          id?: string;
          information?: string | null;
          integration_display_name?: string;
          integration_logo_url?: string | null;
          integration_name: string;
          integration_type?: Database["public"]["Enums"]["integration_type"];
          max_files?: number;
          onboarding_brain?: boolean | null;
          tags?: Database["public"]["Enums"]["brain_tags"][] | null;
        };
        Update: {
          allow_model_change?: boolean;
          connection_settings?: Json | null;
          created_at?: string;
          description?: string;
          id?: string;
          information?: string | null;
          integration_display_name?: string;
          integration_logo_url?: string | null;
          integration_name?: string;
          integration_type?: Database["public"]["Enums"]["integration_type"];
          max_files?: number;
          onboarding_brain?: boolean | null;
          tags?: Database["public"]["Enums"]["brain_tags"][] | null;
        };
        Relationships: [];
      };
      integrations_user: {
        Row: {
          brain_id: string | null;
          created_at: string;
          credentials: Json | null;
          id: number;
          integration_id: string | null;
          last_synced: string | null;
          settings: Json | null;
          user_id: string;
        };
        Insert: {
          brain_id?: string | null;
          created_at?: string;
          credentials?: Json | null;
          id?: number;
          integration_id?: string | null;
          last_synced?: string | null;
          settings?: Json | null;
          user_id: string;
        };
        Update: {
          brain_id?: string | null;
          created_at?: string;
          credentials?: Json | null;
          id?: number;
          integration_id?: string | null;
          last_synced?: string | null;
          settings?: Json | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "integrations_user_brain_id_fkey";
            columns: ["brain_id"];
            isOneToOne: false;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          },
          {
            foreignKeyName: "integrations_user_integration_id_fkey";
            columns: ["integration_id"];
            isOneToOne: false;
            referencedRelation: "integrations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "integrations_user_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      knowledge: {
        Row: {
          brain_id: string;
          extension: string;
          file_name: string | null;
          id: string;
          integration: string | null;
          integration_link: string | null;
          url: string | null;
        };
        Insert: {
          brain_id: string;
          extension: string;
          file_name?: string | null;
          id?: string;
          integration?: string | null;
          integration_link?: string | null;
          url?: string | null;
        };
        Update: {
          brain_id?: string;
          extension?: string;
          file_name?: string | null;
          id?: string;
          integration?: string | null;
          integration_link?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "knowledge_brain_id_fkey";
            columns: ["brain_id"];
            isOneToOne: false;
            referencedRelation: "brains";
            referencedColumns: ["brain_id"];
          }
        ];
      };
      models: {
        Row: {
          max_input: number | null;
          max_output: number | null;
          name: string;
          price: number | null;
        };
        Insert: {
          max_input?: number | null;
          max_output?: number | null;
          name: string;
          price?: number | null;
        };
        Update: {
          max_input?: number | null;
          max_output?: number | null;
          name?: string;
          price?: number | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          archived: boolean;
          datetime: string | null;
          description: string | null;
          id: string;
          read: boolean;
          status: Database["public"]["Enums"]["status"];
          title: string;
          user_id: string;
        };
        Insert: {
          archived?: boolean;
          datetime?: string | null;
          description?: string | null;
          id?: string;
          read?: boolean;
          status?: Database["public"]["Enums"]["status"];
          title: string;
          user_id: string;
        };
        Update: {
          archived?: boolean;
          datetime?: string | null;
          description?: string | null;
          id?: string;
          read?: boolean;
          status?: Database["public"]["Enums"]["status"];
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      onboardings: {
        Row: {
          creation_time: string | null;
          onboarding_a: boolean;
          onboarding_b1: boolean;
          onboarding_b2: boolean;
          onboarding_b3: boolean;
          user_id: string;
        };
        Insert: {
          creation_time?: string | null;
          onboarding_a?: boolean;
          onboarding_b1?: boolean;
          onboarding_b2?: boolean;
          onboarding_b3?: boolean;
          user_id: string;
        };
        Update: {
          creation_time?: string | null;
          onboarding_a?: boolean;
          onboarding_b1?: boolean;
          onboarding_b2?: boolean;
          onboarding_b3?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboardings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      prompts: {
        Row: {
          content: string | null;
          id: string;
          status: string | null;
          title: string | null;
        };
        Insert: {
          content?: string | null;
          id?: string;
          status?: string | null;
          title?: string | null;
        };
        Update: {
          content?: string | null;
          id?: string;
          status?: string | null;
          title?: string | null;
        };
        Relationships: [];
      };
      user_identity: {
        Row: {
          company: string | null;
          company_size:
            | Database["public"]["Enums"]["user_identity_company_size"]
            | null;
          onboarded: boolean;
          openai_api_key: string | null;
          usage_purpose: string | null;
          user_id: string;
          username: string | null;
        };
        Insert: {
          company?: string | null;
          company_size?:
            | Database["public"]["Enums"]["user_identity_company_size"]
            | null;
          onboarded?: boolean;
          openai_api_key?: string | null;
          usage_purpose?: string | null;
          user_id: string;
          username?: string | null;
        };
        Update: {
          company?: string | null;
          company_size?:
            | Database["public"]["Enums"]["user_identity_company_size"]
            | null;
          onboarded?: boolean;
          openai_api_key?: string | null;
          usage_purpose?: string | null;
          user_id?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_user_identity_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_settings: {
        Row: {
          api_access: boolean;
          is_premium: boolean;
          max_brain_size: number;
          max_brains: number | null;
          models: Json | null;
          monthly_chat_credit: number | null;
          user_id: string;
        };
        Insert: {
          api_access?: boolean;
          is_premium?: boolean;
          max_brain_size?: number;
          max_brains?: number | null;
          models?: Json | null;
          monthly_chat_credit?: number | null;
          user_id: string;
        };
        Update: {
          api_access?: boolean;
          is_premium?: boolean;
          max_brain_size?: number;
          max_brains?: number | null;
          models?: Json | null;
          monthly_chat_credit?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          email: string | null;
          id: string;
          onboarded: boolean;
        };
        Insert: {
          email?: string | null;
          id: string;
          onboarded?: boolean;
        };
        Update: {
          email?: string | null;
          id?: string;
          onboarded?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      vectors: {
        Row: {
          content: string | null;
          embedding: string | null;
          file_sha1: string | null;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          file_sha1?: string | null;
          id: string;
          metadata?: Json | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          file_sha1?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      wrappers_fdw_stats: {
        Row: {
          bytes_in: number | null;
          bytes_out: number | null;
          create_times: number | null;
          created_at: string;
          fdw_name: string;
          metadata: Json | null;
          rows_in: number | null;
          rows_out: number | null;
          updated_at: string;
        };
        Insert: {
          bytes_in?: number | null;
          bytes_out?: number | null;
          create_times?: number | null;
          created_at?: string;
          fdw_name: string;
          metadata?: Json | null;
          rows_in?: number | null;
          rows_out?: number | null;
          updated_at?: string;
        };
        Update: {
          bytes_in?: number | null;
          bytes_out?: number | null;
          create_times?: number | null;
          created_at?: string;
          fdw_name?: string;
          metadata?: Json | null;
          rows_in?: number | null;
          rows_out?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      airtable_fdw_handler: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      airtable_fdw_meta: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          version: string;
          author: string;
          website: string;
        }[];
      };
      airtable_fdw_validator: {
        Args: {
          options: string[];
          catalog: unknown;
        };
        Returns: undefined;
      };
      big_query_fdw_handler: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      big_query_fdw_meta: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          version: string;
          author: string;
          website: string;
        }[];
      };
      big_query_fdw_validator: {
        Args: {
          options: string[];
          catalog: unknown;
        };
        Returns: undefined;
      };
      click_house_fdw_handler: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      click_house_fdw_meta: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          version: string;
          author: string;
          website: string;
        }[];
      };
      click_house_fdw_validator: {
        Args: {
          options: string[];
          catalog: unknown;
        };
        Returns: undefined;
      };
      delete_secret: {
        Args: {
          secret_name: string;
        };
        Returns: string;
      };
      firebase_fdw_handler: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      firebase_fdw_meta: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          version: string;
          author: string;
          website: string;
        }[];
      };
      firebase_fdw_validator: {
        Args: {
          options: string[];
          catalog: unknown;
        };
        Returns: undefined;
      };
      get_user_email_by_user_id: {
        Args: {
          user_id: string;
        };
        Returns: {
          email: string;
        }[];
      };
      get_user_id_by_user_email: {
        Args: {
          user_email: string;
        };
        Returns: {
          user_id: string;
        }[];
      };
      hnswhandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      insert_secret: {
        Args: {
          name: string;
          secret: string;
        };
        Returns: string;
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      logflare_fdw_handler: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      logflare_fdw_meta: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          version: string;
          author: string;
          website: string;
        }[];
      };
      logflare_fdw_validator: {
        Args: {
          options: string[];
          catalog: unknown;
        };
        Returns: undefined;
      };
      match_brain: {
        Args: {
          query_embedding: string;
          match_count: number;
          p_user_id: string;
        };
        Returns: {
          id: string;
          name: string;
          similarity: number;
        }[];
      };
      match_vectors: {
        Args: {
          query_embedding: string;
          p_brain_id: string;
          max_chunk_sum: number;
        };
        Returns: {
          id: string;
          brain_id: string;
          content: string;
          metadata: Json;
          embedding: string;
          similarity: number;
        }[];
      };
      read_secret: {
        Args: {
          secret_name: string;
        };
        Returns: string;
      };
      s3_fdw_handler: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      s3_fdw_meta: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          version: string;
          author: string;
          website: string;
        }[];
      };
      s3_fdw_validator: {
        Args: {
          options: string[];
          catalog: unknown;
        };
        Returns: undefined;
      };
      stripe_fdw_handler: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      stripe_fdw_meta: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          version: string;
          author: string;
          website: string;
        }[];
      };
      stripe_fdw_validator: {
        Args: {
          options: string[];
          catalog: unknown;
        };
        Returns: undefined;
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      brain_tags:
        | "new"
        | "recommended"
        | "most_popular"
        | "premium"
        | "coming_soon"
        | "community"
        | "deprecated";
      brain_type_enum: "doc" | "api" | "composite" | "integration";
      integration_type: "custom" | "sync" | "doc";
      status: "info" | "warning" | "success" | "error";
      tags:
        | "Finance"
        | "Legal"
        | "Health"
        | "Technology"
        | "Education"
        | "Resources"
        | "Marketing"
        | "Strategy"
        | "Operations"
        | "Compliance"
        | "Research"
        | "Innovation"
        | "Sustainability"
        | "Management"
        | "Communication"
        | "Data"
        | "Quality"
        | "Logistics"
        | "Policy"
        | "Design"
        | "Safety"
        | "Customer"
        | "Development"
        | "Reporting"
        | "Collaboration";
      thumbs: "up" | "down";
      user_identity_company_size:
        | "1-10"
        | "10-25"
        | "25-50"
        | "50-100"
        | "100-250"
        | "250-500"
        | "500-1000"
        | "1000-5000"
        | "+5000";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
