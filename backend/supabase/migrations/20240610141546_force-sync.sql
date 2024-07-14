alter table "public"."syncs_active" add column "force_sync" boolean not null default false;

alter table "public"."notifications" add column "bulk_id" uuid;

alter table "public"."knowledge" add column "status" text not null default 'UPLOADED'::text;

CREATE UNIQUE INDEX knowledge_pkey ON public.knowledge USING btree (id);

alter table "public"."knowledge" add constraint "knowledge_pkey" PRIMARY KEY using index "knowledge_pkey";

alter table "public"."notifications" add column "brain_id" uuid;

alter table "public"."notifications" add column "category" text;