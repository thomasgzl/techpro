<template>
  <div class="admin">
    <header class="admin-header">
      <div class="admin-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        TechPro <span>Back office</span>
      </div>
      <div class="admin-header-actions">
        <router-link to="/" class="site-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          Voir le site
        </router-link>
        <button class="logout-btn" @click="logout">Déconnexion</button>
      </div>
    </header>

    <nav class="admin-tabs">
      <button :class="{ active: tab === 'reservations' }" @click="tab = 'reservations'">
        Réservations
        <span class="badge" v-if="newBookingsCount">{{ newBookingsCount }}</span>
      </button>
      <button :class="{ active: tab === 'messages' }" @click="tab = 'messages'">
        Messages
        <span class="badge" v-if="unreadMessagesCount">{{ unreadMessagesCount }}</span>
      </button>
      <button :class="{ active: tab === 'invoices' }" @click="tab = 'invoices'">Factures</button>
    </nav>

    <main class="admin-content">
      <ReservationsPanel v-if="tab === 'reservations'" @count="newBookingsCount = $event" />
      <MessagesPanel v-else-if="tab === 'messages'" @count="unreadMessagesCount = $event" />
      <InvoicesPanel v-else />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import ReservationsPanel from '../../components/admin/ReservationsPanel.vue'
import MessagesPanel from '../../components/admin/MessagesPanel.vue'
import InvoicesPanel from '../../components/admin/InvoicesPanel.vue'

const router = useRouter()
const { signOut } = useAuth()

const tab = ref('reservations')
const newBookingsCount = ref(0)
const unreadMessagesCount = ref(0)

async function logout() {
  await signOut()
  router.replace({ name: 'admin-login' })
}
</script>

<style scoped>
.admin {
  min-height: 100vh;
  background: var(--bg);
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  border-bottom: 1px solid var(--border2);
  flex-wrap: wrap;
  gap: 12px;
}

.admin-logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-logo span {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  font-size: 13px;
  color: var(--text2);
  margin-left: 2px;
}

.logo-icon {
  width: 30px; height: 30px;
  background: var(--accent);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

.logo-icon svg { width: 16px; height: 16px; }

.admin-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.site-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font-size: 13px;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.site-link:hover { background: var(--accent-soft); color: var(--accent); border-color: var(--accent); }

.logout-btn {
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.logout-btn:hover { background: var(--ink); color: white; border-color: var(--ink); }

.admin-tabs {
  display: flex;
  gap: 8px;
  padding: 20px 32px 0;
}

.admin-tabs button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-tabs button.active { background: var(--ink); color: white; border-color: var(--ink); }

.badge {
  background: var(--accent);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 50px;
}

.admin-tabs button.active .badge { background: var(--accent); }

.admin-content {
  padding: 24px 32px 64px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .admin-header, .admin-tabs, .admin-content { padding-left: 16px; padding-right: 16px; }
}
</style>
