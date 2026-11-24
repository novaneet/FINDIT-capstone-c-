(function () {
  const config = window.FINDIT_CONFIG || {};
  const url = String(config.SUPABASE_URL || '').trim();
  const key = String(config.SUPABASE_ANON_KEY || '').trim();
  const isPlaceholder = !url || !key || url.includes('your-project-id') || key.includes('your-anon-key');

  window.FINDIT = window.FINDIT || {};
  window.FINDIT.config = config;
  window.FINDIT.demo = {
    active: Boolean(config.DEMO_MODE) || isPlaceholder
  };
  window.FINDIT.ready = false;
  window.FINDIT.supabase = null;

  if (typeof window.supabase !== 'undefined' && url && key && !isPlaceholder) {
    try {
      window.FINDIT.supabase = window.supabase.createClient(url, key);
      window.FINDIT.ready = true;
    } catch (error) {
      console.warn('Supabase client failed to initialize:', error);
      window.FINDIT.ready = false;
      window.FINDIT.supabase = null;
    }
  }

  window.FINDIT.utils = {
    getDemoItems: function () {
      return (config.DEMO_ITEMS || []).slice();
    },
    note: function (message, type) {
      const placeholder = document.getElementById('app-message');
      if (!placeholder) return;
      placeholder.textContent = message;
      placeholder.className = 'app-message ' + (type || 'info');
    }
  };

  window.FINDIT.auth = {
    async signIn(email, password) {
      if (window.FINDIT.demo.active || !window.FINDIT.ready || !window.FINDIT.supabase) {
        return {
          ok: false,
          demo: true,
          message: 'Demo mode active. Connect Supabase credentials to enable real authentication.'
        };
      }

      try {
        const { data, error } = await window.FINDIT.supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { ok: false, message: error.message };
        }

        return { ok: true, user: data.user };
      } catch (error) {
        return { ok: false, message: 'Login failed. Please try again.' };
      }
    },

    async signUp({ full_name, email, password, role = 'student' }) {
      if (window.FINDIT.demo.active || !window.FINDIT.ready || !window.FINDIT.supabase) {
        localStorage.setItem('findit-demo-user', JSON.stringify({ full_name, email, role }));
        return {
          ok: false,
          demo: true,
          message: 'Demo mode active. Add Supabase project credentials to begin real registration.'
        };
      }

      try {
        const { data, error } = await window.FINDIT.supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name, role }
          }
        });

        if (error) {
          return { ok: false, message: error.message };
        }

        if (data.user) {
          await window.FINDIT.supabase.from('profiles').upsert({
            id: data.user.id,
            full_name,
            email,
            role
          }, { onConflict: 'id' });
        }

        return { ok: true, user: data.user };
      } catch (error) {
        return { ok: false, message: 'Registration failed. Please try again.' };
      }
    },

    async signOut() {
      if (window.FINDIT.ready && window.FINDIT.supabase) {
        const { error } = await window.FINDIT.supabase.auth.signOut();
        if (error) {
          return { ok: false, message: error.message };
        }
      }

      localStorage.removeItem('findit-demo-user');
      return { ok: true };
    }
  };
})();
