<template>
  <div class="admin-login">
    <div class="login-card glass">
      <div class="login-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        TechPro
      </div>
      <h1>Back office</h1>
      <p class="subtitle">Connectez-vous pour gérer les réservations et les messages.</p>

      <div v-if="!isSupabaseConfigured" class="notice">
        Supabase n'est pas encore configuré : copiez <code>.env.example</code> vers <code>.env</code> et renseignez votre projet.
      </div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" autocomplete="username" required>
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" autocomplete="current-password" required>
        </div>
        <p class="form-error" v-if="error">{{ error }}</p>
        <button class="btn-full dark" type="submit" :disabled="loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, authReady } from '../../composables/useAuth.js'
import { isSupabaseConfigured } from '../../lib/supabase.js'

const router = useRouter()
const { session, signIn } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  await authReady()
  if (session.value) router.replace({ name: 'admin' })
})

async function submit() {
  loading.value = true
  error.value = null
  const signInError = await signIn(email.value.trim(), password.value)
  loading.value = false

  if (signInError) {
    error.value = 'Email ou mot de passe incorrect.'
    return
  }
  router.replace({ name: 'admin' })
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg);
}

.login-card {
  width: 100%;
  max-width: 380px;
  border-radius: var(--radius);
  padding: 40px;
}

.login-logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.logo-icon {
  width: 32px; height: 32px;
  background: var(--accent);
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
}

.logo-icon svg { width: 18px; height: 18px; }

h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text2);
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 24px;
}

.notice {
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 13px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
}

.notice code {
  background: rgba(0,0,0,0.1);
  padding: 1px 5px;
  border-radius: 4px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text2);
}

.form-group input {
  padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  color: var(--text);
  background: var(--bg);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.form-group input:focus {
  border-color: var(--accent);
  background: var(--bg2);
}

.form-error {
  color: #e24b4a;
  font-size: 13px;
  margin-bottom: 12px;
}

.btn-full:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
