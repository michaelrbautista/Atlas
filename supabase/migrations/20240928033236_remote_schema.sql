alter table "public"."purchased_programs" drop constraint "saved_workouts_program_id_fkey";

alter table "public"."workout_exercises" add column "other" text;

alter table "public"."purchased_programs" add constraint "purchased_programs_program_id_fkey" FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE not valid;

alter table "public"."purchased_programs" validate constraint "purchased_programs_program_id_fkey";


