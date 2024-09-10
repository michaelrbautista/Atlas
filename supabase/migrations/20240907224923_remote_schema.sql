create policy "Enable insert for authenticated users only"
on "storage"."buckets"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for authenticated users only"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (true);


create policy "Give users authenticated access to folder 1aogckf_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'exercise_videos'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1aogckf_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'exercise_videos'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1aogckf_2"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'exercise_videos'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1aogckf_3"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'exercise_videos'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1m6uob7_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'program_images'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1m6uob7_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'program_images'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1m6uob7_2"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'program_images'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1m6uob7_3"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'program_images'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1pmf6kr_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'profile_pictures'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1pmf6kr_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'profile_pictures'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1pmf6kr_2"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'profile_pictures'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1pmf6kr_3"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'profile_pictures'::text) AND (auth.role() = 'authenticated'::text)));



