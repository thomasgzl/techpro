<template>
  <div class="panel">
    <div class="panel-head">
      <h2>Messages</h2>
      <button class="refresh-btn" @click="load" :disabled="loading">↻ Actualiser</button>
    </div>

    <p class="state-msg" v-if="loading">Chargement…</p>
    <p class="state-msg error" v-else-if="loadError">{{ loadError }}</p>
    <p class="state-msg" v-else-if="messages.length === 0">Aucun message pour le moment.</p>

    <div class="cards" v-else>
      <div class="card" :class="{ unread: !message.read }" v-for="message in messages" :key="message.id">
        <div class="card-main">
          <div class="card-head">
            <strong>{{ message.prenom }} {{ message.nom }}</strong>
            <span class="card-date">{{ formatDate(message.created_at) }}</span>
          </div>
          <div class="card-meta">{{ message.email }} · {{ message.sujet }}</div>
          <p class="card-body">{{ message.message }}</p>
        </div>
        <div class="card-actions">
          <button class="toggle-btn" @click="toggleRead(message)">
            {{ message.read ? 'Marquer non lu' : 'Marquer lu' }}
          </button>
          <button class="delete-btn" @click="remove(message)" title="Supprimer">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase.js'

const emit = defineEmits(['count'])

const messages = ref([])
const loading = ref(false)
const loadError = ref(null)

function formatDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

async function load() {
  loading.value = true
  loadError.value = null

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  loading.value = false

  if (error) {
    loadError.value = 'Impossible de charger les messages.'
    console.error('[admin] messages', error)
    return
  }

  messages.value = data
  emit('count', data.filter((m) => !m.read).length)
}

async function toggleRead(message) {
  const previous = message.read
  message.read = !message.read
  const { error } = await supabase.from('contact_messages').update({ read: message.read }).eq('id', message.id)
  if (error) {
    message.read = previous
    console.error('[admin] toggle message read', error)
    return
  }
  emit('count', messages.value.filter((m) => !m.read).length)
}

async function remove(message) {
  if (!confirm(`Supprimer le message de ${message.prenom} ${message.nom} ?`)) return
  const { error } = await supabase.from('contact_messages').delete().eq('id', message.id)
  if (error) {
    console.error('[admin] delete message', error)
    return
  }
  messages.value = messages.value.filter((m) => m.id !== message.id)
  emit('count', messages.value.filter((m) => !m.read).length)
}

onMounted(load)
</script>

<style scoped>
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.panel-head h2 {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.refresh-btn {
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
}

.refresh-btn:hover { border-color: var(--accent); color: var(--accent); }

.state-msg {
  color: var(--text2);
  font-size: 14px;
  padding: 24px 0;
}

.state-msg.error { color: #e24b4a; }

.cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.card.unread { border-color: var(--accent); }

.card-main { flex: 1; min-width: 260px; }

.card-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 4px;
}

.card-head strong { font-family: 'Syne', sans-serif; font-size: 15px; }

.card-date { font-size: 12px; color: var(--text2); }

.card-meta {
  font-size: 13px;
  color: var(--accent);
  margin-bottom: 8px;
}

.card-body {
  font-size: 14px;
  color: var(--text2);
  line-height: 1.6;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.toggle-btn {
  padding: 8px 14px;
  border-radius: 50px;
  border: 1.5px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.toggle-btn:hover { border-color: var(--accent); color: var(--accent); }

.delete-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover { background: #e24b4a; color: white; border-color: #e24b4a; }
</style>
