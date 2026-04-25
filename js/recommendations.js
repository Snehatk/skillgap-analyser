// ===== COURSE DATABASE =====
const courseDB = {
  'Python': {
    icon: '🐍',
    level: 'Beginner',
    resources: [
      {
        title: 'Python for Everybody — University of Michigan',
        type: 'course',
        platform: 'Coursera',
        free: true,
        url: 'https://www.coursera.org/specializations/python'
      },
      {
        title: 'Python Tutorial for Beginners',
        type: 'video',
        platform: 'YouTube — Programming with Mosh',
        free: true,
        url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc'
      },
      {
        title: 'Official Python Documentation',
        type: 'docs',
        platform: 'python.org',
        free: true,
        url: 'https://docs.python.org/3/tutorial/'
      },
      {
        title: 'Build a CLI project using Python',
        type: 'project',
        platform: 'Practice project',
        free: true,
        url: '#'
      }
    ]
  },
  'Machine Learning': {
    icon: '🤖',
    level: 'Intermediate',
    resources: [
      {
        title: 'Machine Learning Specialization — Andrew Ng',
        type: 'course',
        platform: 'Coursera',
        free: false,
        url: 'https://www.coursera.org/specializations/machine-learning-introduction'
      },
      {
        title: 'Machine Learning Crash Course',
        type: 'course',
        platform: 'Google',
        free: true,
        url: 'https://developers.google.com/machine-learning/crash-course'
      },
      {
        title: 'Scikit-learn Tutorial',
        type: 'docs',
        platform: 'scikit-learn.org',
        free: true,
        url: 'https://scikit-learn.org/stable/tutorial/'
      },
      {
        title: 'Titanic Survival Prediction',
        type: 'project',
        platform: 'Kaggle',
        free: true,
        url: 'https://www.kaggle.com/competitions/titanic'
      }
    ]
  },
  'SQL': {
    icon: '🗄️',
    level: 'Beginner',
    resources: [
      {
        title: 'SQL for Data Science',
        type: 'course',
        platform: 'Coursera — UC Davis',
        free: false,
        url: 'https://www.coursera.org/learn/sql-for-data-science'
      },
      {
        title: 'SQL Tutorial — Full Database Course',
        type: 'video',
        platform: 'YouTube — freeCodeCamp',
        free: true,
        url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY'
      },
      {
        title: 'SQLZoo Interactive Practice',
        type: 'docs',
        platform: 'sqlzoo.net',
        free: true,
        url: 'https://sqlzoo.net/'
      }
    ]
  },
  'Deep Learning': {
    icon: '🧠',
    level: 'Advanced',
    resources: [
      {
        title: 'Deep Learning Specialization — Andrew Ng',
        type: 'course',
        platform: 'Coursera',
        free: false,
        url: 'https://www.coursera.org/specializations/deep-learning'
      },
      {
        title: 'Fast.ai Practical Deep Learning',
        type: 'course',
        platform: 'fast.ai',
        free: true,
        url: 'https://course.fast.ai/'
      },
      {
        title: 'Build a Neural Network from Scratch',
        type: 'project',
        platform: 'Practice project',
        free: true,
        url: '#'
      }
    ]
  },
  'Statistics': {
    icon: '📐',
    level: 'Intermediate',
    resources: [
      {
        title: 'Statistics with Python Specialization',
        type: 'course',
        platform: 'Coursera — UMich',
        free: false,
        url: 'https://www.coursera.org/specializations/statistics-with-python'
      },
      {
        title: 'Khan Academy Statistics',
        type: 'video',
        platform: 'Khan Academy',
        free: true,
        url: 'https://www.khanacademy.org/math/statistics-probability'
      }
    ]
  },
  'React': {
    icon: '⚛️',
    level: 'Intermediate',
    resources: [
      {
        title: 'React Official Tutorial',
        type: 'docs',
        platform: 'react.dev',
        free: true,
        url: 'https://react.dev/learn'
      },
      {
        title: 'React Full Course for Beginners',
        type: 'video',
        platform: 'YouTube — freeCodeCamp',
        free: true,
        url: 'https://www.youtube.com/watch?v=bMknfKXIFA8'
      }
    ]
  },
  'Docker': {
    icon: '🐳',
    level: 'Intermediate',
    resources: [
      {
        title: 'Docker Getting Started Guide',
        type: 'docs',
        platform: 'docs.docker.com',
        free: true,
        url: 'https://docs.docker.com/get-started/'
      },
      {
        title: 'Docker Full Course',
        type: 'video',
        platform: 'YouTube — TechWorld with Nana',
        free: true,
        url: 'https://www.youtube.com/watch?v=3c-iBn73dDE'
      }
    ]
  },
  'default': {
    icon: '📖',
    level: 'Beginner',
    resources: [
      {
        title: 'Search this skill on Coursera',
        type: 'course',
        platform: 'Coursera',
        free: false,
        url: 'https://www.coursera.org/search?query='
      },
      {
        title: 'Search this skill on YouTube',
        type: 'video',
        platform: 'YouTube',
        free: true,
        url: 'https://www.youtube.com/results?search_query='
      }
    ]
  }
};

// ===== LOAD DATA =====
const missingSkills = JSON.parse(localStorage.getItem('missingSkills')) || [];
const matchScore    = localStorage.getItem('matchScore') || '0';

// ===== ON PAGE LOAD =====
window.onload = function () {

  // Show match score banner
  document.getElementById('banner-score').textContent = matchScore + '%';

  if (missingSkills.length === 0) {
    document.getElementById('no-gaps').classList.remove('hidden');
    document.getElementById('learning-summary').style.display = 'none';
    return;
  }

  renderRecommendations();
  renderLearningPath();
};

// ===== RENDER RECOMMENDATION CARDS =====
function renderRecommendations() {
  const container = document.getElementById('recommendations-list');

  container.innerHTML = missingSkills.map((skill, index) => {
    const data = courseDB[skill] || {
      ...courseDB['default'],
      resources: courseDB['default'].resources.map(r => ({
        ...r,
        url: r.url + encodeURIComponent(skill)
      }))
    };

    const resources = data.resources.map(r => `
      <a class="resource-item" href="${r.url}" target="_blank">
        <span class="resource-type-badge badge-${r.type}">${r.type}</span>
        <div class="resource-info">
          <div class="resource-title">${r.title}</div>
          <div class="resource-meta">${r.platform}</div>
        </div>
        <span class="resource-free">${r.free ? 'FREE' : 'PAID'}</span>
      </a>`).join('');

    return `
      <div class="rec-card">
        <div class="rec-card-header" onclick="toggleCard(${index})">
          <div class="rec-skill-name">
            <span class="rec-skill-icon">${data.icon}</span>
            <div>
              <div class="rec-skill-title">${skill}</div>
              <div class="rec-skill-sub">Level: ${data.level}
                · ${data.resources.length} resources</div>
            </div>
          </div>
          <span class="rec-toggle" id="toggle-${index}">▾</span>
        </div>
        <div class="rec-card-body" id="body-${index}">
          ${resources}
        </div>
      </div>`;
  }).join('');
}

// ===== TOGGLE ACCORDION =====
function toggleCard(index) {
  const body   = document.getElementById('body-' + index);
  const toggle = document.getElementById('toggle-' + index);
  body.classList.toggle('open');
  toggle.classList.toggle('open');
}

// ===== RENDER LEARNING PATH =====
function renderLearningPath() {
  const container = document.getElementById('learning-path');

  // Priority order for learning
  const priorityOrder = [
    'Python', 'SQL', 'Statistics', 'Machine Learning',
    'Deep Learning', 'TensorFlow', 'NLP', 'Docker',
    'React', 'Node.js', 'MongoDB', 'AWS'
  ];

  // Sort missing skills by priority
  const sorted = [...missingSkills].sort((a, b) => {
    const ai = priorityOrder.indexOf(a);
    const bi = priorityOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  container.innerHTML = `<div class="path-steps">` +
    sorted.map((skill, i) => `
      <div class="path-step">
        <div class="path-step-number">${i + 1}</div>
        <span class="path-step-name">${skill}</span>
      </div>
      ${i < sorted.length - 1 ? '<span class="path-arrow">→</span>' : ''}
    `).join('') +
  `</div>`;
}