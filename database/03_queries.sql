-- Basic verification and demonstration queries for Supabase SQL Editor.

-- 1. Show all students
select * from public.students order by full_name;

-- 2. Show all available skills
select s.skill_id, s.skill_name, c.category_name
from public.skills s join public.skill_categories c using (category_id)
order by c.category_name, s.skill_name;

-- 3. Skills a particular student can teach (replace email)
select s.skill_name, ss.proficiency_level, ss.experience_years
from public.student_skills ss join public.skills s using (skill_id)
join public.students st using (student_id)
where st.email = 'arjun.kumar@campus.edu';

-- 4. Skills a particular student wants to learn (replace email)
select s.skill_name, ws.target_level, ws.priority
from public.wanted_skills ws join public.skills s using (skill_id)
join public.students st using (student_id)
where st.email = 'arjun.kumar@campus.edu';

-- 5. Students who can teach a particular skill (replace skill name)
select st.student_id, st.full_name, st.department, ss.proficiency_level
from public.student_skills ss join public.students st using (student_id)
join public.skills s using (skill_id)
where lower(s.skill_name) = lower('Python') and st.account_status = 'active';

-- 6. Pending exchange requests
select r.request_id, a.full_name as sender, b.full_name as receiver,
       offered.skill_name as offered_skill, wanted.skill_name as requested_skill, r.requested_at
from public.exchange_requests r
join public.students a on a.student_id = r.sender_id
join public.students b on b.student_id = r.receiver_id
join public.skills offered on offered.skill_id = r.offered_skill_id
join public.skills wanted on wanted.skill_id = r.requested_skill_id
where r.status = 'pending' order by r.requested_at desc;

-- 7. Accepted exchanges
select e.exchange_id, a.full_name as student_one, b.full_name as student_two,
       e.exchange_status, e.start_date
from public.skill_exchanges e
join public.students a on a.student_id = e.student_one_id
join public.students b on b.student_id = e.student_two_id
where e.exchange_status in ('active','completed') order by e.start_date desc;

-- 8. Completed learning sessions
select se.session_id, se.session_date, mentor.full_name as mentor,
       learner.full_name as learner, sk.skill_name, se.topic
from public.sessions se
join public.students mentor on mentor.student_id = se.mentor_id
join public.students learner on learner.student_id = se.learner_id
join public.skills sk on sk.skill_id = se.skill_id
where se.session_status = 'completed' order by se.session_date desc;

-- 9. Student ratings
select st.student_id, st.full_name, round(avg(r.rating)::numeric, 2) as average_rating,
       count(r.review_id) as review_count
from public.students st left join public.reviews r on r.reviewed_student_id = st.student_id
group by st.student_id, st.full_name order by average_rating desc nulls last;

-- 10. Reciprocal matches: each student teaches a skill the other wants.
select distinct a.student_id as student_a_id, a.full_name as student_a,
       b.student_id as student_b_id, b.full_name as student_b,
       teach_a.skill_name as a_teaches, teach_b.skill_name as b_teaches
from public.students a
join public.student_skills a_teaches on a_teaches.student_id = a.student_id
join public.skills teach_a on teach_a.skill_id = a_teaches.skill_id
join public.wanted_skills b_wants on b_wants.skill_id = teach_a.skill_id
join public.students b on b.student_id = b_wants.student_id and b.student_id <> a.student_id
join public.student_skills b_teaches on b_teaches.student_id = b.student_id
join public.skills teach_b on teach_b.skill_id = b_teaches.skill_id
join public.wanted_skills a_wants on a_wants.student_id = a.student_id and a_wants.skill_id = teach_b.skill_id
where a.account_status = 'active' and b.account_status = 'active'
  and a.student_id < b.student_id
order by student_a, student_b;
