const matches = [
  { name: 'Rahul Sharma', course: 'Computer Science · Year 3', initials: 'RS', colors: 'mint', teaches: 'UI/UX Design', learns: 'Python', score: '98% match' },
  { name: 'Priya Menon', course: 'Information Tech · Year 2', initials: 'PM', colors: 'peach', teaches: 'Data Visualization', learns: 'SQL', score: '92% match' },
  { name: 'Kabir Patel', course: 'Computer Science · Year 4', initials: 'KP', colors: 'lavender', teaches: 'React', learns: 'Python', score: '86% match' },
  { name: 'Ananya Das', course: 'Design · Year 2', initials: 'AD', colors: 'blueish', teaches: 'Figma', learns: 'SQL', score: '81% match' },
];

const list = document.querySelector('#matchList');
list.innerHTML = matches.map((person) => `
  <div class="match-row">
    <div class="match-avatar ${person.colors}">${person.initials}</div>
    <div class="match-detail"><strong>${person.name}</strong><small>${person.course}</small>
      <div class="tags"><span class="tag">Teaches ${person.teaches}</span><span class="tag wants">Wants ${person.learns}</span></div>
    </div><span class="match-score">${person.score}</span>
    <button class="connect" data-name="${person.name}">Connect</button>
  </div>`).join('');

list.addEventListener('click', (event) => {
  const button = event.target.closest('.connect');
  if (button) window.alert(`Demo preview: you could send ${button.dataset.name} an exchange request here.`);
});
document.querySelector('#addSkill').addEventListener('click', () => {
  window.alert('Skill editing will be added when the app is connected to its database.');
});
