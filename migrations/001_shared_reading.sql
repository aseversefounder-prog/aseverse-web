begin;
create table public.reader_stories (
  id uuid primary key,
  author_id uuid not null default auth.uid() references auth.users on delete cascade,
  byline text not null check (length(trim(byline)) between 1 and 64),
  title text not null check (length(trim(title)) between 1 and 120),
  summary text not null check (length(summary) <= 4000),
  genre text not null check (length(genre) <= 100),
  age_rating text not null check (length(age_rating) <= 50),
  content_notes text not null check (length(content_notes) <= 2000),
  cover text not null check (length(cover) <= 1500000 and cover ~ '^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$'),
  chapter_title text not null check (length(trim(chapter_title)) between 1 and 200),
  chapter_body text not null check (length(trim(chapter_body)) between 1 and 120000),
  published_at timestamptz not null default now()
);
create index reader_stories_publication on public.reader_stories (published_at desc,id);
create table public.reader_saves (
  reader_id uuid not null default auth.uid() references auth.users on delete cascade,
  story_id uuid not null references public.reader_stories on delete cascade,
  primary key(reader_id,story_id)
);
alter table public.reader_stories enable row level security;
alter table public.reader_saves enable row level security;
revoke all on public.reader_stories, public.reader_saves from public, anon, authenticated;
grant select on public.reader_stories to anon, authenticated;
grant insert(id,byline,title,summary,genre,age_rating,content_notes,cover,chapter_title,chapter_body),
      update(id,byline,title,summary,genre,age_rating,content_notes,cover,chapter_title,chapter_body),
      delete on public.reader_stories to authenticated;
grant select,delete,insert(story_id) on public.reader_saves to authenticated;
create policy public_catalog on public.reader_stories for select using (true);
create policy author_publish on public.reader_stories for insert to authenticated with check(author_id=(select auth.uid()));
create policy author_edit on public.reader_stories for update to authenticated using(author_id=(select auth.uid())) with check(author_id=(select auth.uid()));
create policy author_remove on public.reader_stories for delete to authenticated using(author_id=(select auth.uid()));
create policy own_shelf on public.reader_saves for all to authenticated using(reader_id=(select auth.uid())) with check(reader_id=(select auth.uid()));
commit;
