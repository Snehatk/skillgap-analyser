
const API = "https://skillbridge-backend-1-xytc.onrender.com";

// ===== JOB ROLE SKILL DATABASE =====
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

// ===== USER'S SKILL LIST =====
let userSkills = [];

// ===== FILE UPLOAD HANDLERS =====
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) showFileSelected(file.name);
}

function handleDragOver(event) {
  event.preventDefault();
  document.getElementById('drop-zone').classList.add('dragover');
}

function handleDragLeave(event) {
  document.getElementById('drop-zone').classList.remove('dragover');
}

function handleDrop(event) {
  event.preventDefault();
  document.getElementById('drop-zone').classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file) showFileSelected(file.name);
}

function showFileSelected(name) {
  document.getElementById('drop-zone').classList.add('hidden');
  document.getElementById('file-selected').classList.remove('hidden');
  document.getElementById('file-name').textContent = name;
  localStorage.setItem('resumeFile', name);
}

function removeFile() {
  document.getElementById('drop-zone').classList.remove('hidden');
  document.getElementById('file-selected').classList.add('hidden');
  document.getElementById('resume-input').value = '';
  localStorage.removeItem('resumeFile');
}

// ===== JOB ROLE SELECTION =====
document.getElementById('job-role').addEventListener('change', function () {
  const role      = this.value;
  const preview   = document.getElementById('role-preview');
  const container = document.getElementById('required-skills-preview');

  if (!role) {
    preview.classList.add('hidden');
    return;
  }

  const skills = jobRoles[role].skills;
  container.innerHTML = skills
    .map(s => `<span class="tag tag-blue">${s}</span>`)
    .join('');

  preview.classList.remove('hidden');
  localStorage.setItem('selectedRole', role);
});

// ===== MANUAL SKILL INPUT =====
function handleSkillKeypress(event) {
  if (event.key === 'Enter') addSkill();
}

function addSkill() {
  const input = document.getElementById('skill-input');
  const skill = input.value.trim();

  if (!skill) return;
  if (userSkills.includes(skill)) {
    alert('Skill already added!');
    return;
  }

  userSkills.push(skill);
  input.value = '';
  renderSkillTags();
}

function removeSkill(skill) {
  userSkills = userSkills.filter(s => s !== skill);
  renderSkillTags();
}

function renderSkillTags() {
  const container = document.getElementById('skills-tags');
  container.innerHTML = userSkills
    .map(s => `
      <span class="tag tag-green">
        ${s}
        <button onclick="removeSkill('${s}')"
          style="background:none;border:none;color:#6ee7b7;
                 cursor:pointer;margin-left:6px;font-size:12px;">✕</button>
      </span>`)
    .join('');
  localStorage.setItem('userSkills', JSON.stringify(userSkills));
}

// ===== START ANALYSIS =====
async function startAnalysis() {
  const role = document.getElementById('job-role').value;

  if (!role) {
    alert('Please select a job role first!');
    return;
  }

  const btn = document.querySelector('.analyze-btn');
  btn.textContent = '⏳ Waking up server...';
  btn.disabled    = true;

  // ===== WAKE UP BACKEND FIRST =====
  try {
    await fetch(`${API}/`);
  } catch (e) {
    console.log('Waking up...');
  }

  btn.textContent = '⏳ Analyzing...';

  try {
    // ===== CASE 1: Resume uploaded =====
    const resumeInput = document.getElementById('resume-input');

    if (resumeInput.files.length > 0) {
      const formData = new FormData();
      formData.append('resume', resumeInput.files[0]);

      const res  = await fetch(`${API}/upload-resume`, {
        method: 'POST',
        body:   formData
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('userSkills', JSON.stringify(data.skills));
      }
    }

    // ===== CASE 2: Manual skills =====
    const skills = JSON.parse(localStorage.getItem('userSkills')) || [];

    if (skills.length === 0) {
      const dummy = ['python', 'sql', 'excel', 'html', 'css'];
      localStorage.setItem('userSkills', JSON.stringify(dummy));
    }

    // ===== SEND TO ANALYZE =====
    const finalSkills = JSON.parse(localStorage.getItem('userSkills'));

    const res2   = await fetch(`${API}/analyze`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        skills:   finalSkills,
        job_role: role
      })
    });

    const result = await res2.json();

    localStorage.setItem('matchScore',    result.score);
    localStorage.setItem('missingSkills', JSON.stringify(result.missing));
    localStorage.setItem('matchedSkills', JSON.stringify(result.matched));
    localStorage.setItem('selectedRole',  role);

    window.location.href = 'analysis.html';

  } catch (error) {
    console.error(error);
    alert('Server is waking up! Please wait 30 seconds and try again.');
    btn.textContent = '🔍 Analyze My Skill Gap';
    btn.disabled    = false;
  }

  try {
    // ===== CASE 1: Resume uploaded =====
    const resumeInput = document.getElementById('resume-input');

    if (resumeInput.files.length > 0) {
      const formData = new FormData();
      formData.append('resume', resumeInput.files[0]);

      const res  = await fetch(`${API}/upload-resume`, {
        method: 'POST',
        body:   formData
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('userSkills', JSON.stringify(data.skills));
      }
    }

    // ===== CASE 2: Manual skills =====
    const skills = JSON.parse(localStorage.getItem('userSkills')) || [];

    if (skills.length === 0) {
      const dummy = ['python', 'sql', 'excel', 'html', 'css'];
      localStorage.setItem('userSkills', JSON.stringify(dummy));
    }

    // ===== SEND TO ANALYZE =====
    const finalSkills = JSON.parse(localStorage.getItem('userSkills'));

    const res2   = await fetch(`${API}/analyze`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        skills:   finalSkills,
        job_role: role
      })
    });

    const result = await res2.json();

    localStorage.setItem('matchScore',    result.score);
    localStorage.setItem('missingSkills', JSON.stringify(result.missing));
    localStorage.setItem('matchedSkills', JSON.stringify(result.matched));
    localStorage.setItem('selectedRole',  role);

    window.location.href = 'analysis.html';
} catch (error) {
    console.error(error);
    alert('Server is waking up! Please wait 30 seconds and try again.');
    btn.textContent = '🔍 Analyze My Skill Gap';
    btn.disabled    = false;
  }
}