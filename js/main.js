const API = "https://skillbridge-backend-1-xytc.onrender.com";

// ===== TAB SWITCHER =====
function switchTab(tab) {
  const loginForm  = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const tabs       = document.querySelectorAll('.tab-btn');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    tabs[1].classList.add('active');
    tabs[0].classList.remove('active');
  }
}

// ===== LOGIN =====
async function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) {
    alert('Please fill in all fields!');
    return;
  }

  const btn = document.querySelector('#login-form .btn-primary');
  btn.textContent = '⏳ Logging in...';
  btn.disabled    = true;

  try {
    const res  = await fetch(`${API}/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('user', JSON.stringify({
        name:  data.user.name,
        email: data.user.email
      }));
      showSuccess();
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    } else {
      alert(data.message || 'Invalid email or password!');
      btn.textContent = 'Login →';
      btn.disabled    = false;
    }

  } catch (err) {
    console.error('Login error:', err);
    alert('Cannot connect to server!');
    btn.textContent = 'Login →';
    btn.disabled    = false;
  }
}

// ===== SIGNUP =====
async function handleSignup() {
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  if (!name || !email || !password) {
    alert('Please fill in all fields!');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters!');
    return;
  }

  const btn = document.querySelector('#signup-form .btn-primary');
  btn.textContent = '⏳ Creating account...';
  btn.disabled    = true;

  try {
    const res  = await fetch(`${API}/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('user', JSON.stringify({ name, email }));
      showSuccess();
      setTimeout(() => { window.location.href = 'upload.html'; }, 2000);
    } else {
      alert(data.message || 'Signup failed!');
      btn.textContent = 'Create Account →';
      btn.disabled    = false;
    }

  } catch (err) {
    console.error('Signup error:', err);
    alert('Cannot connect to server!');
    btn.textContent = 'Create Account →';
    btn.disabled    = false;
  }
}

// ===== SHOW SUCCESS =====
function showSuccess() {
  const loginForm  = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const success    = document.getElementById('auth-success');
  const tabs       = document.querySelector('.auth-tabs');

  if (loginForm)  loginForm.classList.add('hidden');
  if (signupForm) signupForm.classList.add('hidden');
  if (tabs)       tabs.classList.add('hidden');
  if (success)    success.classList.remove('hidden');
}