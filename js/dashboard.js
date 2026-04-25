const API = "https://skillbridge-backend-1-xytc.onrender.com";

// ===== JOB ROLES =====
const jobRoles = {
  'data-scientist': {
    name: 'Data Scientist',
    skills: ['Python','Machine Learning','Statistics','SQL',
             'Deep Learning','Data Visualization','TensorFlow','Pandas']
  },
  'web-developer': {
    name: 'Web Developer',
    skills: ['HTML','CSS','JavaScript','React',
             'Node.js','REST APIs','Git','MongoDB']
  },
  'ai-engineer': {
    name: 'AI / ML Engineer',
    skills: ['Python','TensorFlow','PyTorch','NLP',
             'Deep Learning','MLOps','Docker','Cloud Platforms']
  },
  'cloud-engineer': {
    name: 'Cloud Engineer',
    skills: ['AWS','Azure','Docker','Kubernetes',
             'Terraform','Linux','Networking','CI/CD']
  },
  'data-analyst': {
    name: 'Data Analyst',
    skills: ['Excel','SQL','Python','Power BI',
             'Tableau','Statistics','Data Cleaning','Pandas']
  },
  'devops-engineer': {
    name: 'DevOps Engineer',
    skills: ['Docker','Kubernetes','Jenkins','Git',
             'Linux','AWS','CI/CD','Ansible']
  },
  'cybersecurity': {
    name: 'Cybersecurity Analyst',
    skills: ['Networking','Linux','Ethical Hacking','Firewalls',
             'Python','SIEM Tools','Cryptography','Risk Assessment']
  }
};

// ===== LOAD DATA FROM LOCALSTORAGE =====
const selectedRole  = localStorage.getItem('selectedRole');
const userSkills    = JSON.parse(localStorage.getItem('userSkills'))    || [];
const missingSkills = JSON.parse(localStorage.getItem('missingSkills')) || [];
const matchScore    = parseInt(localStorage.getItem('matchScore'))      || 0;

// ===== LOAD USER =====
let user = {};
try {
  user = JSON.parse(localStorage.getItem('user')) || {};
} catch (e) {
  user = {};
}

// ===== ON PAGE LOAD =====
window.onload = function () {
  updateWelcome();
  updateStatCards();
  renderChecklist();
  renderRadarChart();
  animateReadiness();
  loadAnalysisHistory();
};

// ===== WELCOME MESSAGE =====
function updateWelcome() {
  const name = user.name || user.email || 'there';
  document.getElementById('welcome-msg').textContent =
    `Welcome back, ${name}! 👋`;

  if (selectedRole && jobRoles[selectedRole]) {
    document.getElementById('role-msg').textContent =
      `Target role: ${jobRoles[selectedRole].name}`;
  } else {
    document.getElementById('role-msg').textContent =
      'No role selected yet — start an analysis!';
  }
}

// ===== STAT CARDS =====
function updateStatCards() {
  const role = selectedRole && jobRoles[selectedRole]
    ? jobRoles[selectedRole]
    : null;

  const totalRequired = role ? role.skills.length : 0;
  const matchedCount  = totalRequired - missingSkills.length;

  document.getElementById('stat-score').textContent =
    matchScore ? matchScore + '%' : '—';
  document.getElementById('stat-matched').textContent =
    matchedCount > 0 ? matchedCount : '—';
  document.getElementById('stat-missing').textContent =
    missingSkills.length > 0 ? missingSkills.length : '—';
  document.getElementById('stat-role').textContent =
    role ? role.name.split(' ')[0] : '—';
}

// ===== SKILL CHECKLIST =====
function renderChecklist() {
  const container = document.getElementById('skill-checklist');

  if (!selectedRole || !jobRoles[selectedRole]) {
    container.innerHTML =
      '<p style="color:var(--muted);font-size:14px;">No analysis found. ' +
      '<a href="upload.html" style="color:var(--primary)">Start one →</a></p>';
    return;
  }

  const allSkills = jobRoles[selectedRole].skills;
  const userLower = userSkills.map(s => s.toLowerCase());
  const saved     = JSON.parse(localStorage.getItem('checkedSkills') || '{}');

  container.innerHTML = allSkills.map(skill => {
    const have    = userLower.includes(skill.toLowerCase());
    const checked = have || saved[skill] || false;

    return `
      <div class="checklist-item" onclick="toggleCheck('${skill}')">
        <input type="checkbox" id="chk-${skill}"
               ${checked ? 'checked' : ''}
               onclick="event.stopPropagation(); toggleCheck('${skill}')"/>
        <span class="checklist-label ${checked ? 'done' : ''}"
              id="lbl-${skill}">
          ${skill}
        </span>
        <span class="checklist-status"
              style="color:${have ? 'var(--success)' : 'var(--muted)'}">
          ${have ? '✅ Have it' : '📚 Learn'}
        </span>
      </div>`;
  }).join('');
}

// ===== TOGGLE CHECKBOX =====
function toggleCheck(skill) {
  const chk   = document.getElementById('chk-' + skill);
  const label = document.getElementById('lbl-' + skill);

  chk.checked = !chk.checked;
  label.classList.toggle('done', chk.checked);

  const saved  = JSON.parse(localStorage.getItem('checkedSkills') || '{}');
  saved[skill] = chk.checked;
  localStorage.setItem('checkedSkills', JSON.stringify(saved));

  if (user.email) {
    fetch(`${API}/save-progress`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        email:     user.email,
        skill:     skill,
        completed: chk.checked
      })
    }).catch(err => console.log('Progress save error:', err));
  }

  updateReadiness();
}

// ===== READINESS BAR =====
function animateReadiness() {
  setTimeout(() => updateReadiness(), 400);
}

function updateReadiness() {
  if (!selectedRole || !jobRoles[selectedRole]) return;

  const allSkills = jobRoles[selectedRole].skills;
  const saved     = JSON.parse(localStorage.getItem('checkedSkills') || '{}');
  const userLower = userSkills.map(s => s.toLowerCase());

  const doneCount = allSkills.filter(skill =>
    userLower.includes(skill.toLowerCase()) || saved[skill]
  ).length;

  const pct = Math.round((doneCount / allSkills.length) * 100);

  document.getElementById('readiness-bar').style.width = pct + '%';
  document.getElementById('readiness-pct').textContent = pct + '%';
  document.getElementById('readiness-msg').textContent =
    pct === 100 ? '🎉 You are fully job-ready!'
    : pct >= 70  ? '🔥 Almost there! Keep going.'
    : pct >= 40  ? '📈 Good progress! Stay consistent.'
    :              '💪 Just getting started. Follow the roadmap!';
}

// ===== RADAR CHART =====
function renderRadarChart() {
  if (!selectedRole || !jobRoles[selectedRole]) return;

  const role      = jobRoles[selectedRole];
  const userLower = userSkills.map(s => s.toLowerCase());
  const labels    = role.skills;
  const data      = role.skills.map(s =>
    userLower.includes(s.toLowerCase()) ? 1 : 0
  );

  const ctx = document.getElementById('radarChart').getContext('2d');

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Your Skills',
        data:  data,
        backgroundColor:      'rgba(79, 70, 229, 0.2)',
        borderColor:          '#4f46e5',
        pointBackgroundColor: data.map(d =>
          d === 1 ? '#10b981' : '#ef4444'
        ),
        pointRadius: 6,
        borderWidth: 2
      }]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 1,
          ticks: { display: false },
          grid:  { color: '#334155' },
          pointLabels: { color: '#94a3b8', font: { size: 11 } }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// ===== LOAD ANALYSIS HISTORY =====
async function loadAnalysisHistory() {
  if (!user.email) return;

  try {
    const res  = await fetch(`${API}/history/${user.email}`);
    const data = await res.json();

    if (data.history && data.history.length > 0) {
      const latest = data.history[0];
      document.getElementById('stat-score').textContent = latest.score + '%';
    }
  } catch (err) {
    console.log('Could not load history:', err);
  }
}