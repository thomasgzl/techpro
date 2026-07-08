<template>
  <div class="panel">
    <div class="panel-head">
      <h2>Réservations</h2>
      <button class="refresh-btn" @click="load" :disabled="loading">↻ Actualiser</button>
    </div>

    <p class="state-msg" v-if="loading">Chargement…</p>
    <p class="state-msg error" v-else-if="loadError">{{ loadError }}</p>
    <p class="state-msg" v-else-if="bookings.length === 0">Aucune réservation pour le moment.</p>

    <div class="cards" v-else>
      <div class="card" v-for="booking in bookings" :key="booking.id">
        <div class="card-main">
          <div class="card-date">
            <strong>{{ booking.booking_day }} {{ MONTHS_FR[booking.booking_month - 1] }} {{ booking.booking_year }}</strong>
            <span>{{ booking.slot }}</span>
          </div>
          <div class="card-info">
            <div class="card-service">{{ booking.service }}</div>
            <div class="card-client">{{ booking.name }} · {{ booking.phone }} · {{ booking.email }}</div>
            <p class="card-desc" v-if="booking.description">{{ booking.description }}</p>
          </div>
        </div>
        <div class="card-actions">
          <select :value="booking.status" @change="updateStatus(booking, $event.target.value)">
            <option value="nouveau">Nouveau</option>
            <option value="confirme">Confirmé</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
          <button class="delete-btn" @click="remove(booking)" title="Supprimer">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase.js'

// The back office always stays French regardless of the public site's language toggle.
const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const emit = defineEmits(['count'])

const bookings = ref([])
const loading = ref(false)
const loadError = ref(null)

async function load() {
  loading.value = true
  loadError.value = null

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('booking_year', { ascending: true })
    .order('booking_month', { ascending: true })
    .order('booking_day', { ascending: true })
    .order('slot', { ascending: true })

  loading.value = false

  if (error) {
    loadError.value = "Impossible de charger les réservations."
    console.error('[admin] reservations', error)
    return
  }

  bookings.value = data
  emit('count', data.filter((b) => b.status === 'nouveau').length)
}

async function updateStatus(booking, status) {
  const previous = booking.status
  booking.status = status
  const { error } = await supabase.from('bookings').update({ status }).eq('id', booking.id)
  if (error) {
    booking.status = previous
    console.error('[admin] update booking status', error)
    return
  }
  emit('count', bookings.value.filter((b) => b.status === 'nouveau').length)
}

async function remove(booking) {
  if (!confirm(`Supprimer la réservation de ${booking.name} ?`)) return
  const { error } = await supabase.from('bookings').delete().eq('id', booking.id)
  if (error) {
    console.error('[admin] delete booking', error)
    return
  }
  bookings.value = bookings.value.filter((b) => b.id !== booking.id)
  emit('count', bookings.value.filter((b) => b.status === 'nouveau').length)
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
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.card-main {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex: 1;
  min-width: 260px;
}

.card-date {
  display: flex;
  flex-direction: column;
  min-width: 130px;
}

.card-date strong {
  font-family: 'Syne', sans-serif;
  font-size: 14px;
}

.card-date span {
  color: var(--accent);
  font-weight: 600;
  font-size: 13px;
}

.card-service {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
}

.card-client {
  font-size: 13px;
  color: var(--text2);
}

.card-desc {
  font-size: 13px;
  color: var(--text2);
  margin-top: 6px;
  font-style: italic;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-actions select {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  font-size: 13px;
}

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
