<template>
  <div class="editor-backdrop" @click.self="$emit('close')">
    <div class="editor-panel">
      <header class="editor-header">
        <h2>{{ isNew ? 'Nouvelle facture' : `Facture ${form.number}` }}</h2>
        <button class="icon-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="editor-body">
        <!-- ===== FORM ===== -->
        <div class="editor-form">
          <div class="field-row" v-if="recentBookings.length">
            <label>Pré-remplir depuis une réservation</label>
            <select @change="applyBooking($event.target.value)">
              <option value="">— Choisir —</option>
              <option v-for="b in recentBookings" :key="b.id" :value="b.id">
                {{ b.booking_day }}/{{ b.booking_month }}/{{ b.booking_year }} · {{ b.name }} · {{ b.service }}
              </option>
            </select>
          </div>

          <div class="field-grid">
            <div class="field-row">
              <label>Numéro</label>
              <input type="text" v-model="form.number">
            </div>
            <div class="field-row">
              <label>Statut</label>
              <select v-model="form.status">
                <option value="brouillon">Brouillon</option>
                <option value="envoyee">Envoyée</option>
                <option value="payee">Payée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
            <div class="field-row">
              <label>Date d'émission</label>
              <input type="date" v-model="form.issue_date">
            </div>
            <div class="field-row">
              <label>Date d'échéance</label>
              <input type="date" v-model="form.due_date">
            </div>
          </div>

          <h3 class="section-title">Client</h3>
          <div class="field-row">
            <label>Nom</label>
            <input type="text" v-model="form.client_name" placeholder="Jean Dupont">
          </div>
          <div class="field-grid">
            <div class="field-row">
              <label>Email</label>
              <input type="email" v-model="form.client_email">
            </div>
            <div class="field-row">
              <label>Adresse</label>
              <input type="text" v-model="form.client_address">
            </div>
          </div>

          <h3 class="section-title">Prestations</h3>
          <div class="items-editor">
            <div class="item-row" v-for="(item, index) in items" :key="index">
              <input type="text" class="item-desc" placeholder="Description" v-model="item.description">
              <input type="number" min="0" step="1" class="item-qty" v-model.number="item.quantity">
              <input type="number" min="0" step="0.01" class="item-price" v-model.number="item.unit_price">
              <span class="item-total">{{ formatEUR(lineTotal(item)) }}</span>
              <button class="remove-btn" @click="items.splice(index, 1)" :disabled="items.length === 1">✕</button>
            </div>
          </div>
          <button class="add-item-btn" @click="items.push({ description: '', quantity: 1, unit_price: 0 })">+ Ajouter une ligne</button>

          <div class="field-row vat-row">
            <label><input type="checkbox" v-model="form.vat_enabled"> TVA applicable</label>
            <input type="number" v-if="form.vat_enabled" min="0" step="0.1" class="vat-rate" v-model.number="form.vat_rate">
            <span v-if="form.vat_enabled">%</span>
          </div>

          <div class="field-row">
            <label>Notes / conditions de paiement</label>
            <textarea v-model="form.notes" placeholder="Ex : paiement à réception, RIB, garantie…"></textarea>
          </div>

          <p class="form-error" v-if="error">{{ error }}</p>

          <div class="editor-actions">
            <button class="btn-full" style="margin-top:0" @click="print">🖨️ Imprimer / PDF</button>
            <button class="btn-full dark" style="margin-top:0" :disabled="saving" @click="save">
              {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>
        </div>

        <!-- ===== LIVE PREVIEW ===== -->
        <div class="editor-preview">
          <div class="invoice-print-root">
            <div class="invoice-doc">
              <div class="invoice-doc-head">
                <div>
                  <div class="doc-company">{{ companyInfo.name }}</div>
                  <div class="doc-muted">{{ companyInfo.address }}</div>
                  <div class="doc-muted">{{ companyInfo.phone }} · {{ companyInfo.email }}</div>
                  <div class="doc-muted">{{ companyInfo.siret }}</div>
                </div>
                <div class="doc-invoice-meta">
                  <div class="doc-title">FACTURE</div>
                  <div>N° {{ form.number || '—' }}</div>
                  <div>Émise le {{ formatDate(form.issue_date) }}</div>
                  <div v-if="form.due_date">Échéance le {{ formatDate(form.due_date) }}</div>
                </div>
              </div>

              <div class="doc-client">
                <div class="doc-label">Facturé à</div>
                <div class="doc-client-name">{{ form.client_name || '—' }}</div>
                <div class="doc-muted" v-if="form.client_address">{{ form.client_address }}</div>
                <div class="doc-muted" v-if="form.client_email">{{ form.client_email }}</div>
              </div>

              <table class="doc-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qté</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{ item.description || '—' }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatEUR(item.unit_price) }}</td>
                    <td>{{ formatEUR(lineTotal(item)) }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="doc-totals">
                <div class="doc-totals-row"><span>Sous-total</span><span>{{ formatEUR(subtotal) }}</span></div>
                <div class="doc-totals-row" v-if="form.vat_enabled"><span>TVA ({{ form.vat_rate }}%)</span><span>{{ formatEUR(vatAmount) }}</span></div>
                <div class="doc-totals-row doc-total-final"><span>Total</span><span>{{ formatEUR(total) }}</span></div>
              </div>

              <p class="doc-vat-mention" v-if="!form.vat_enabled">{{ companyInfo.vatMention }}</p>
              <p class="doc-notes" v-if="form.notes">{{ form.notes }}</p>
              <p class="doc-muted doc-iban">{{ companyInfo.iban }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase.js'
import { companyInfo } from '../../data/companyInfo.js'

const props = defineProps({
  invoice: { type: Object, default: null },
})
const emit = defineEmits(['close', 'saved'])

// No id yet (either a blank invoice, or a duplicate of another one) counts as "new":
// it still gets its own freshly generated number and is saved via insert, not update.
const isNew = !props.invoice?.id
const saving = ref(false)
const error = ref(null)
const recentBookings = ref([])

const form = reactive({
  number: props.invoice?.number ?? '',
  status: props.invoice?.status ?? 'brouillon',
  client_name: props.invoice?.client_name ?? '',
  client_email: props.invoice?.client_email ?? '',
  client_address: props.invoice?.client_address ?? '',
  issue_date: props.invoice?.issue_date ?? new Date().toISOString().slice(0, 10),
  due_date: props.invoice?.due_date ?? '',
  vat_enabled: props.invoice?.vat_enabled ?? false,
  vat_rate: props.invoice?.vat_rate ?? 20,
  notes: props.invoice?.notes ?? '',
  booking_id: props.invoice?.booking_id ?? null,
})

const items = reactive(
  props.invoice?.items?.length ? props.invoice.items.map((i) => ({ ...i })) : [{ description: '', quantity: 1, unit_price: 0 }],
)

function lineTotal(item) {
  return (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)
}

const subtotal = computed(() => items.reduce((sum, item) => sum + lineTotal(item), 0))
const vatAmount = computed(() => (form.vat_enabled ? (subtotal.value * (Number(form.vat_rate) || 0)) / 100 : 0))
const total = computed(() => subtotal.value + vatAmount.value)

function formatEUR(n) {
  return `${(Number(n) || 0).toFixed(2).replace('.', ',')} €`
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

async function generateNumber() {
  const year = new Date().getFullYear()
  const { count } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .gte('issue_date', `${year}-01-01`)
    .lte('issue_date', `${year}-12-31`)
  form.number = `${year}-${String((count ?? 0) + 1).padStart(4, '0')}`
}

function applyBooking(id) {
  const booking = recentBookings.value.find((b) => b.id === id)
  if (!booking) return
  form.client_name = booking.name
  form.client_email = booking.email
  form.booking_id = booking.id
  if (items.length === 1 && !items[0].description) {
    items[0].description = booking.service
  } else {
    items.push({ description: booking.service, quantity: 1, unit_price: 0 })
  }
}

async function save() {
  if (!form.client_name.trim()) {
    error.value = 'Le nom du client est requis.'
    return
  }
  saving.value = true
  error.value = null

  const payload = {
    number: form.number,
    status: form.status,
    client_name: form.client_name.trim(),
    client_email: form.client_email?.trim() || null,
    client_address: form.client_address?.trim() || null,
    issue_date: form.issue_date,
    due_date: form.due_date || null,
    vat_enabled: form.vat_enabled,
    vat_rate: form.vat_enabled ? Number(form.vat_rate) || 0 : 0,
    items: items.filter((i) => i.description.trim()),
    notes: form.notes?.trim() || null,
    booking_id: form.booking_id,
  }

  const query = props.invoice?.id
    ? supabase.from('invoices').update(payload).eq('id', props.invoice.id).select().single()
    : supabase.from('invoices').insert(payload).select().single()

  const { data, error: saveError } = await query
  saving.value = false

  if (saveError) {
    console.error('[invoices] save', saveError)
    error.value = "La facture n'a pas pu être enregistrée."
    return
  }

  emit('saved', data)
}

function print() {
  window.print()
}

onMounted(async () => {
  if (isNew) generateNumber()

  const { data } = await supabase
    .from('bookings')
    .select('id, name, email, service, booking_day, booking_month, booking_year')
    .order('created_at', { ascending: false })
    .limit(50)
  recentBookings.value = data || []
})
</script>

<style scoped>
.editor-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 200;
}

.editor-panel {
  background: var(--bg);
  border-radius: var(--radius);
  width: 100%;
  max-width: 1100px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border2);
  flex-shrink: 0;
}

.editor-header h2 {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.icon-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  cursor: pointer;
}

.icon-btn:hover { background: var(--ink); color: white; }

.editor-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  overflow: hidden;
  flex: 1;
}

.editor-form {
  padding: 24px;
  overflow-y: auto;
  border-right: 1px solid var(--border2);
}

.editor-preview {
  padding: 24px;
  overflow-y: auto;
  background: var(--bg2);
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  margin: 24px 0 12px;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.field-row label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text2);
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field-row input,
.field-row select,
.field-row textarea {
  padding: 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: inherit;
  color: var(--text);
  background: var(--bg2);
  outline: none;
}

.field-row input:focus,
.field-row select:focus,
.field-row textarea:focus { border-color: var(--accent); }

.field-row textarea { resize: vertical; min-height: 70px; }

.items-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: grid;
  grid-template-columns: 1fr 60px 90px 90px 28px;
  gap: 8px;
  align-items: center;
}

.item-row input {
  padding: 8px 10px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  background: var(--bg2);
  color: var(--text);
}

.item-total {
  font-size: 13px;
  font-weight: 500;
  text-align: right;
}

.remove-btn {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  font-size: 11px;
}

.remove-btn:hover:not(:disabled) { background: #e24b4a; color: white; border-color: #e24b4a; }
.remove-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.add-item-btn {
  align-self: flex-start;
  margin-top: 10px;
  padding: 8px 16px;
  border-radius: 50px;
  border: 1.5px dashed var(--border);
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  font-size: 13px;
}

.add-item-btn:hover { border-color: var(--accent); color: var(--accent); }

.vat-row {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.vat-row label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text); }
.vat-rate { width: 70px; padding: 6px 8px; border: 1.5px solid var(--border); border-radius: 8px; background: var(--bg2); }

.form-error { color: #e24b4a; font-size: 13px; margin-top: 12px; }

.editor-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
}

.editor-actions .btn-full:disabled { opacity: 0.6; cursor: not-allowed; }

/* ===== Invoice document look ===== */
.invoice-doc {
  background: white;
  color: #1a1814;
  border-radius: 8px;
  padding: 40px;
  box-shadow: var(--shadow);
  font-size: 13px;
}

.invoice-doc-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.doc-company { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; }
.doc-muted { color: #5a5650; font-size: 12px; margin-top: 2px; }

.doc-invoice-meta { text-align: right; font-size: 12px; }
.doc-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: 1px; margin-bottom: 6px; }

.doc-client { margin-bottom: 28px; }
.doc-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #5a5650; margin-bottom: 4px; }
.doc-client-name { font-weight: 700; font-size: 14px; }

.doc-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
.doc-table th {
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #5a5650;
  border-bottom: 1.5px solid #1a1814;
  padding: 8px 6px;
}
.doc-table th:not(:first-child), .doc-table td:not(:first-child) { text-align: right; }
.doc-table td { padding: 8px 6px; border-bottom: 1px solid rgba(26,24,20,0.1); }

.doc-totals { margin-left: auto; width: 240px; }
.doc-totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
.doc-total-final { font-weight: 700; font-size: 15px; border-top: 1.5px solid #1a1814; margin-top: 6px; padding-top: 8px; }

.doc-vat-mention { font-size: 11px; color: #5a5650; font-style: italic; margin-top: 24px; }
.doc-notes { font-size: 12px; color: #5a5650; margin-top: 12px; white-space: pre-wrap; }
.doc-iban { margin-top: 16px; }

@media (max-width: 900px) {
  .editor-body { grid-template-columns: 1fr; overflow-y: auto; }
  .editor-form { border-right: none; border-bottom: 1px solid var(--border2); overflow-y: visible; }
  .editor-preview { overflow-y: visible; }
}
</style>
