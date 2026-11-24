(function () {
  const showMessage = function (message, type) {
    const el = document.getElementById('app-message');
    if (!el) return;
    el.textContent = message;
    el.className = 'app-message ' + (type || 'info') + ' show';
    setTimeout(() => el.classList.remove('show'), 2600);
  };

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      if (!email || !password) {
        showMessage('Please enter both email and password.', 'error');
        return;
      }

      if (window.FINDIT && window.FINDIT.auth) {
        const result = await window.FINDIT.auth.signIn(email, password);

        if (result && result.ok) {
          showMessage('Login successful. Redirecting to your dashboard.', 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 900);
          return;
        }

        if (result && result.demo) {
          showMessage(result.message, 'info');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 900);
          return;
        }

        showMessage(result && result.message ? result.message : 'Login failed.', 'error');
        return;
      }

      showMessage('Authentication is unavailable right now.', 'error');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value.trim();
      const role = document.getElementById('register-role').value;

      if (!name || !email || password.length < 6) {
        showMessage('Please fill in all required fields and provide a valid password.', 'error');
        return;
      }

      if (window.FINDIT && window.FINDIT.auth) {
        const result = await window.FINDIT.auth.signUp({ full_name: name, email, password, role });

        if (result && result.ok) {
          showMessage('Registration successful. Redirecting to your dashboard.', 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 900);
          return;
        }

        if (result && result.demo) {
          showMessage(result.message, 'info');
          localStorage.setItem('findit-demo-user', JSON.stringify({ full_name: name, email, role }));
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 900);
          return;
        }

        showMessage(result && result.message ? result.message : 'Registration failed.', 'error');
        return;
      }

      showMessage('Registration is unavailable right now.', 'error');
    });
  }
})();
