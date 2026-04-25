const API = "https://skillbridge-backend-1-xytc.onrender.com";
// ===== FETCH CAREER MATCHES FROM BACKEND =====
async function fetchCareerMatches(skills) {
  try {
    const res  = await fetch(`${API}/career-matches`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ skills })
    });
    const data = await res.json();
    return data.matches || [];
  } catch {
    return null;
  }
}

// ===== JOB ROLES DATABASE =====
const jobRoles = {
  'data-scientist': {
    name: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'Statistics', 'SQL',
             'Deep Learning', 'Data Visualization', 'TensorFlow', 'Pandas']
  },
  'web-developer': {
    name: 'Web Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'React',
             'Node.js', 'REST APIs', 'Git', 'MongoDB']
  },
  'ai-engineer': {
    name: 'AI / ML Engineer',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP',
             'Deep Learning', 'MLOps', 'Docker', 'Cloud Platforms']
  },
  'cloud-engineer': {
    name: 'Cloud Engineer',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes',
             'Terraform', 'Linux', 'Networking', 'CI/CD']
  },
  'data-analyst': {
    name: 'Data Analyst',
    skills: ['Excel', 'SQL', 'Python', 'Power BI',
             'Tableau', 'Statistics', 'Data Cleaning', 'Pandas']
  },
  'devops-engineer': {
    name: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'Git',
             'Linux', 'AWS', 'CI/CD', 'Ansible']
  },
  'cybersecurity': {
    name: 'Cybersecurity Analyst',
    skills: ['Networking', 'Linux', 'Ethical Hacking', 'Firewalls',
             'Python', 'SIEM Tools', 'Cryptography', 'Risk Assessment']
  }
};

// ===== LOAD DATA FROM LOCALSTORAGE =====
const selectedRole = localStorage.getItem('selectedRole');
const userSkills   = JSON.parse(localStorage.getItem('userSkills')) || [];

// ===== RUN ANALYSIS ON PAGE LOAD =====
window.onload = async function () {
  if (!selectedRole) {
    document.getElementById('role-subtitle').textContent =
      'No role selected. Go back and select a job role.';
    return;
  }

  const role           = jobRoles[selectedRole];
  const requiredSkills = role.skills;
  const userLower      = userSkills.map(s => s.toLowerCase());

  const matched = requiredSkills.filter(s => userLower.includes(s.toLowerCase()));
  const missing = requiredSkills.filter(s => !userLower.includes(s.toLowerCase()));
  const score   = Math.round((matched.length / requiredSkills.length) * 100);

  localStorage.setItem('missingSkills', JSON.stringify(missing));
  localStorage.setItem('matchScore',    score);

  updateSubtitle(role.name);
  updateScoreCircle(score);
  updateBreakdownBars(matched.length, missing.length, requiredSkills.length);
  renderMatchedSkills(matched);
  renderMissingSkills(missing);

  const apiMatches = await fetchCareerMatches(userSkills);
  if (apiMatches) {
    renderCareerMatchesFromAPI(apiMatches);
  } else {
    renderCareerMatches(userSkills);
  }
};

// ===== UPDATE SUBTITLE =====
function updateSubtitle(roleName) {
  document.getElementById('role-subtitle').textContent =
    `Skill gap analysis for: ${roleName}`;
}

// ===== SCORE CIRCLE =====
function updateScoreCircle(score) {
  const circle = document.getElementById('score-circle');
  const number = document.getElementById('score-number');
  const desc   = document.getElementById('score-desc');

  let count = 0;
  const interval = setInterval(() => {
    count += 2;
    if (count >= score) { count = score; clearInterval(interval); }
    number.textContent = count + '%';
  }, 20);

  if (score >= 70) {
    circle.classList.add('high');
    desc.textContent = '🎉 Strong match! Polish a few skills and you\'re ready.';
  } else if (score >= 40) {
    circle.classList.add('mid');
    desc.textContent = '📈 Good start! Focus on the missing skills below.';
  } else {
    circle.classList.add('low');
    desc.textContent = '💪 Keep going! Follow the learning roadmap below.';
  }
}

// ===== BREAKDOWN BARS =====
function updateBreakdownBars(matchedCount, missingCount, total) {
  document.getElementById('matched-count').textContent = matchedCount;
  document.getElementById('missing-count').textContent = missingCount;

  setTimeout(() => {
    document.getElementById('matched-bar').style.width =
      ((matchedCount / total) * 100) + '%';
    document.getElementById('missing-bar').style.width =
      ((missingCount / total) * 100) + '%';
  }, 300);
}

// ===== RENDER MATCHED SKILLS =====
function renderMatchedSkills(skills) {
  const container = document.getElementById('matched-skills');
  if (skills.length === 0) {
    container.innerHTML =
      '<p style="color:var(--muted);font-size:14px;">No matching skills found.</p>';
    return;
  }
  container.innerHTML = skills
    .map(s => `<span class="tag tag-green">✓ ${s}</span>`)
    .join('');
}

// ===== RENDER MISSING SKILLS =====
function renderMissingSkills(skills) {
  const container = document.getElementById('missing-skills');
  if (skills.length === 0) {
    container.innerHTML =
      '<p style="color:var(--success);font-size:14px;">🎉 You have all required skills!</p>';
    return;
  }
  container.innerHTML = skills
    .map(s => `<span class="tag tag-red">✗ ${s}</span>`)
    .join('');
}

// ===== CAREER MATCHES (local fallback) =====
function renderCareerMatches(userSkills) {
  const container = document.getElementById('career-matches');
  const userLower = userSkills.map(s => s.toLowerCase());

  const matches = Object.entries(jobRoles).map(([key, role]) => {
    const matched = role.skills.filter(s => userLower.includes(s.toLowerCase()));
    const pct     = Math.round((matched.length / role.skills.length) * 100);
    return { name: role.name, pct };
  });

  matches.sort((a, b) => b.pct - a.pct);

  container.innerHTML = matches.map(m => {
    const color = m.pct >= 70 ? 'var(--success)'
                : m.pct >= 40 ? 'var(--warning)'
                :               'var(--danger)';
    return `
      <div class="career-match-item">
        <div class="career-match-header">
          <span class="career-match-name">${m.name}</span>
          <span class="career-match-pct">${m.pct}% match</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"
               style="width:${m.pct}%;background:${color};
                      transition:width 0.8s ease;">
          </div>
        </div>
      </div>`;
  }).join('');
}

// ===== CAREER MATCHES (from backend API) =====
function renderCareerMatchesFromAPI(matches) {
  const container = document.getElementById('career-matches');

  container.innerHTML = matches.map(m => {
    const color = m.score >= 70 ? 'var(--success)'
                : m.score >= 40 ? 'var(--warning)'
                :                 'var(--danger)';
    return `
      <div class="career-match-item">
        <div class="career-match-header">
          <span class="career-match-name">${m.role}</span>
          <span class="career-match-pct">${m.score}% match</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"
               style="width:${m.score}%;background:${color};
                      transition:width 0.8s ease;">
          </div>
        </div>
      </div>`;
  }).join('');
}