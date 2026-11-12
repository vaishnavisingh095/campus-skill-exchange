-- Reset the Campus Skill Exchange seed tables without deleting the table schema.
-- Run this only when you need to remove existing seed/demo rows, then run
-- database/02_seed_data.sql once.

begin;

truncate table
  public.notifications,
  public.reviews,
  public.sessions,
  public.skill_exchanges,
  public.exchange_requests,
  public.wanted_skills,
  public.student_skills,
  public.skills,
  public.skill_categories,
  public.students
restart identity cascade;

commit;
