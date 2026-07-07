<template>
  <div class="panel">
    <div class="panel-head">
      <h2>Factures</h2>
      <div class="head-actions">
        <button class="refresh-btn" @click="load" :disabled="loading">↻ Actualiser</button>
        <button class="new-btn" @click="openNew">+ Nouvelle facture</button>
      </div>
    </div>

    <p class="state-msg" v-if="loading">Chargement…</p>
    <p class="state-msg error" v-else-if="loadError">{{ loadError }}</p>
    <p class="state-msg" v-else-if="invoices.length === 0">Aucune facture pour le moment.</p>

    <div class="cards" v-else>
      <div class="card" v-for="invoice in invoices" :key="invoice.id">
        <div class="card-main">
          <div class="card-number">{{ invoice.number }}</div>
          <div class="card-client">{{ invoice.client_name }}</div>
          <div class="card-date">{{ formatDate(invoice.issue_date) }}</div>
        </div>
        <div class="card-total">{{ formatEUR(invoiceTotal(invoice)) }}</div>
        <div class="card-actions">
          <select :value="invoice.status" @change="updateStatus(invoice, $event.target.value)" :class="'status-' + invoice.status">
            <option value="brouillon">Brouillon</option>
            <option value="envoyee">Envoyée</option>
            <option value="payee">Payée</option>
            <option value="annulee">Annulée</option>
          </select>
          <button class="text-btn" @click="openEdit(invoice)">Modifier</button>
          <button class="text-btn" @click="duplicate(invoice)">Dupliquer</button>
          <button class="delete-btn" @click="remove(invoice)" title="Supprimer">✕</button>
        </div>
      </div>
    </div>

    <InvoiceEditor v-if="showEditor" :invoice="editingInvoice" @close="showEditor = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase.js'
import InvoiceEditor from './InvoiceEditor.vue'

const invoices = ref([])
const loading = ref(false)
const loadError = ref(null)
const showEditor = ref(false)
const editingInvoice = ref(null)

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('fr-FR') : '—'
}

function formatEUR(n) {
  return `${(Number(n) || 0).toFixed(2).replace('.', ',')} €`
}

function invoiceTotal(invoice) {
  const subtotal = (invoice.items || []).reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0), 0)
  const vat = invoice.vat_enabled ? (subtotal * (Number(invoice.vat_rate) || 0)) / 100 : 0
  return subtotal + vat
}

async function load() {
  loading.value = true
  loadError.value = null

  const { data, error } = await supabase.from('invoices').select('*').order('issue_date', { ascending: false })

  loading.value = false

  if (error) {
    loadError.value = 'Impossible de charger les factures.'
    console.error('[admin] invoices', error)
    return
  }
  invoices.value = data
}

function openNew() {
  editingInvoice.value = null
  showEditor.value = true
}

function openEdit(invoice) {
  editingInvoice.value = invoice
  showEditor.value = true
}

function duplicate(invoice) {
  editingInvoice.value = {
    ...invoice,
    id: undefined,
    number: '',
    status: 'brouillon',
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: null,
    items: invoice.items.map((i) => ({ ...i })),
  }
  showEditor.value = true
}

function onSaved() {
  showEditor.value = false
  load()
}

async function updateStatus(invoice, status) {
  const previous = invoice.status
  invoice.status = status
  const { error } = await supabase.from('invoices').update({ status }).eq('id', invoice.id)
  if (error) {
    invoice.status = previous
    console.error('[admin] update invoice status', error)
  }
}

async function remove(invoice) {
  if (!confirm(`Supprimer la facture ${invoice.number} ?`)) return
  const { error } = await supabase.from('invoices').delete().eq('id', invoice.id)
  if (error) {
    console.error('[admin] delete invoice', error)
    return
  }
  invoices.value = invoices.value.filter((i) => i.id !== invoice.id)
}

onMounted(load)
</script>

<style scoped>
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-head h2 {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.head-actions {
  display: flex;
  gap: 10px;
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

.new-btn {
  padding: 8px 18px;
  border-radius: 50px;
  border: none;
  background: var(--ink);
  color: white;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.new-btn:hover { background: var(--accent); }

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
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.card-main {
  display: flex;
  gap: 20px;
  align-items: baseline;
  flex: 1;
  min-width: 260px;
}

.card-number {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
}

.card-client { font-size: 14px; color: var(--text); }
.card-date { font-size: 13px; color: var(--text2); }

.card-total {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 15px;
  min-width: 90px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-actions select {
  padding: 7px 10px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  font-size: 12px;
}

.card-actions select.status-payee { border-color: var(--green); color: var(--green); }
.card-actions select.status-envoyee { border-color: var(--accent); color: var(--accent); }
.card-actions select.status-annulee { border-color: #e24b4a; color: #e24b4a; }

.text-btn {
  padding: 7px 12px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.text-btn:hover { border-color: var(--accent); color: var(--accent); }

.delete-btn {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.delete-btn:hover { background: #e24b4a; color: white; border-color: #e24b4a; }
</style>
