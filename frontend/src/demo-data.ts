// Small, read-only preview adapted from the workbook-backed SQL seed data.
export const demoSnapshot = {
  students: [
    { student_id: 1, full_name: 'Arjun Kumar', email: 'arjun.kumar@campus.edu', department: 'Computer Science Engineering', year_of_study: 3, section: 'A', bio: 'Interested in backend development and databases.', availability: 'weekdays', credits: 14, account_status: 'active' },
    { student_id: 2, full_name: 'Rahul Sharma', email: 'rahul.sharma@campus.edu', department: 'Computer Science Engineering', year_of_study: 3, section: 'A', bio: 'UI/UX enthusiast who enjoys designing student applications.', availability: 'evenings', credits: 12, account_status: 'active' },
    { student_id: 3, full_name: 'Priya Nair', email: 'priya.nair@campus.edu', department: 'Electronics and Communication Engineering', year_of_study: 2, section: 'B', bio: 'Interested in embedded systems and technical communication.', availability: 'weekends', credits: 10, account_status: 'active' },
    { student_id: 8, full_name: 'Aditya Menon', email: 'aditya.menon@campus.edu', department: 'Electrical and Electronics Engineering', year_of_study: 2, section: 'A', bio: 'Interested in electronics, Excel and public speaking.', availability: 'flexible', credits: 8, account_status: 'active' },
  ],
  skills: [
    { skill_id: 1, category_id: 1, skill_name: 'Python', description: 'Python programming for applications and automation' },
    { skill_id: 5, category_id: 1, skill_name: 'SQL', description: 'Relational database querying and management' },
    { skill_id: 8, category_id: 1, skill_name: 'Git & GitHub', description: 'Version control and collaborative development' },
    { skill_id: 13, category_id: 3, skill_name: 'UI/UX Design', description: 'User interface and user experience design' },
    { skill_id: 14, category_id: 3, skill_name: 'Figma', description: 'Interface prototyping and collaborative design' },
    { skill_id: 16, category_id: 3, skill_name: 'Canva', description: 'Social media and presentation design' },
    { skill_id: 17, category_id: 4, skill_name: 'Public Speaking', description: 'Presentation and audience communication' },
    { skill_id: 21, category_id: 5, skill_name: 'Video Editing', description: 'Video editing and production' },
    { skill_id: 24, category_id: 6, skill_name: 'Machine Learning', description: 'Machine learning concepts and models' },
    { skill_id: 30, category_id: 8, skill_name: 'AutoCAD', description: '2D engineering drawing and CAD' },
    { skill_id: 31, category_id: 8, skill_name: 'Arduino', description: 'Microcontroller programming and prototyping' },
  ],
  categories: [
    { category_id: 1, category_name: 'Programming' }, { category_id: 3, category_name: 'Design' },
    { category_id: 4, category_name: 'Communication' }, { category_id: 5, category_name: 'Media & Content' },
    { category_id: 6, category_name: 'Artificial Intelligence' }, { category_id: 8, category_name: 'Engineering Tools' },
  ],
  teaching: [
    { student_skill_id: 1, student_id: 1, skill_id: 1, proficiency_level: 'advanced', experience_years: 2.5 },
    { student_skill_id: 2, student_id: 1, skill_id: 5, proficiency_level: 'advanced', experience_years: 2 },
    { student_skill_id: 3, student_id: 1, skill_id: 8, proficiency_level: 'intermediate', experience_years: 1.5 },
    { student_skill_id: 4, student_id: 2, skill_id: 13, proficiency_level: 'advanced', experience_years: 2 },
    { student_skill_id: 5, student_id: 2, skill_id: 14, proficiency_level: 'advanced', experience_years: 2 },
    { student_skill_id: 6, student_id: 2, skill_id: 16, proficiency_level: 'advanced', experience_years: 2.5 },
    { student_skill_id: 7, student_id: 3, skill_id: 30, proficiency_level: 'intermediate', experience_years: 1.5 },
    { student_skill_id: 8, student_id: 3, skill_id: 31, proficiency_level: 'intermediate', experience_years: 1 },
    { student_skill_id: 9, student_id: 3, skill_id: 17, proficiency_level: 'intermediate', experience_years: 1 },
    { student_skill_id: 10, student_id: 8, skill_id: 17, proficiency_level: 'advanced', experience_years: 2 },
  ],
  wanted: [
    { wanted_skill_id: 1, student_id: 1, skill_id: 21, target_level: 'intermediate', priority: 5, learning_goal: 'Learn video editing' },
    { wanted_skill_id: 2, student_id: 1, skill_id: 13, target_level: 'intermediate', priority: 3, learning_goal: 'Learn UI/UX fundamentals' },
    { wanted_skill_id: 3, student_id: 2, skill_id: 1, target_level: 'intermediate', priority: 5, learning_goal: 'Learn Python' },
    { wanted_skill_id: 4, student_id: 3, skill_id: 5, target_level: 'intermediate', priority: 4, learning_goal: 'Learn SQL' },
    { wanted_skill_id: 5, student_id: 8, skill_id: 1, target_level: 'beginner', priority: 3, learning_goal: 'Learn Python basics' },
  ],
  requests: [
    { request_id: 1, sender_id: 1, receiver_id: 2, offered_skill_id: 1, requested_skill_id: 13, request_message: 'I can teach Python if you can help me learn UI/UX basics.', requested_at: '2026-09-01T10:00:00Z', status: 'accepted' },
    { request_id: 7, sender_id: 8, receiver_id: 1, offered_skill_id: 17, requested_skill_id: 1, request_message: 'I can help with presentations and would like Python lessons.', requested_at: '2026-09-06T09:15:00Z', status: 'pending' },
  ],
  exchanges: [
    { exchange_id: 1, request_id: 1, student_one_id: 1, student_two_id: 2, skill_one_id: 1, skill_two_id: 13, start_date: '2026-09-03', end_date: '2026-09-20', exchange_status: 'completed' },
  ],
  sessions: [
    { session_id: 1, exchange_id: 1, mentor_id: 1, learner_id: 2, skill_id: 1, session_date: '2026-10-02T16:30:00Z', duration_minutes: 60, topic: 'Python Fundamentals', meeting_mode: 'online', session_status: 'scheduled' },
  ],
  reviews: [{ review_id: 1, reviewed_student_id: 1, rating: 5 }],
  notices: [{ notification_id: 1, student_id: 1, title: 'New skill exchange request', message: 'Aditya Menon wants to exchange presentation skills for Python.', is_read: false, created_at: '2026-09-06T09:20:00Z' }],
}
