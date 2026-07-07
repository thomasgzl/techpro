<template>
  <div class="contact-form glass" v-reveal="{ delay: 0.1, y: 50 }">
    <h3>Envoyer un message</h3>
    <Transition name="swap" mode="out-in">
      <div v-if="!submitted">
        <div class="form-row">
          <div class="form-group">
            <label>Prénom</label>
            <input type="text" placeholder="Jean" v-model="form.prenom" :style="errorStyle('prenom')">
          </div>
          <div class="form-group">
            <label>Nom</label>
            <input type="text" placeholder="Dupont" v-model="form.nom" :style="errorStyle('nom')">
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="jean.dupont@email.com" v-model="form.email" :style="errorStyle('email')">
        </div>
        <div class="form-group">
          <label>Sujet</label>
          <select v-model="form.sujet" :style="errorStyle('sujet')">
            <option value="">Choisissez un sujet…</option>
            <option>Demande de devis</option>
            <option>Urgence – panne</option>
            <option>Question sur un service</option>
            <option>Contrat entreprise</option>
            <option>Autre</option>
          </select>
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea placeholder="Décrivez votre problème ou votre question…" v-model="form.message" :style="errorStyle('message')"></textarea>
        </div>
        <p class="form-error" v-if="submitError">{{ submitError }}</p>
        <button class="btn-full dark" v-magnetic="0.15" :disabled="submitting" @click="submit">
          {{ submitting ? 'Envoi…' : 'Envoyer le message →' }}
        </button>
      </div>
      <div class="form-success" v-else>
        <div class="success-icon">📬</div>
        <h4>Message envoyé !</h4>
        <p>Merci pour votre message. Nous vous répondrons dans les prochaines heures.</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { supabase } from '../../lib/supabase.js'

const form = reactive({ prenom: '', nom: '', email: '', sujet: '', message: '' })
const errors = ref({})
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref(null)

function errorStyle(field) {
  return errors.value[field] ? { borderColor: '#e24b4a' } : {}
}

async function submit() {
  if (submitting.value) return

  const newErrors = {}
  for (const field of ['prenom', 'nom', 'email', 'sujet', 'message']) {
    if (!form[field].trim()) newErrors[field] = true
  }
  errors.value = newErrors
  if (Object.keys(newErrors).length > 0) return

  submitting.value = true
  submitError.value = null

  const { error } = await supabase.from('contact_messages').insert({
    prenom: form.prenom.trim(),
    nom: form.nom.trim(),
    email: form.email.trim(),
    sujet: form.sujet,
    message: form.message.trim(),
  })

  submitting.value = false

  if (error) {
    console.error('[contact_messages] échec de l\'envoi', error)
    submitError.value = "Le message n'a pas pu être envoyé. Réessayez dans un instant."
    return
  }

  submitted.value = true
}
</script>

<style scoped>
.contact-form {
  border-radius: var(--radius);
  padding: 40px;
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.swap-enter-from { opacity: 0; transform: scale(0.97); }
.swap-leave-to { opacity: 0; transform: scale(1.02); }

.contact-form h3 {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 32px;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text2);
  letter-spacing: 0.3px;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 14px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  color: var(--text);
  background: var(--bg);
  transition: border-color 0.2s;
  outline: none;
  width: 100%;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--accent);
  background: var(--bg2);
}

.form-group textarea { resize: vertical; min-height: 120px; }

.form-error {
  color: #e24b4a;
  font-size: 13px;
  margin-top: 4px;
  margin-bottom: 12px;
}

.btn-full:disabled { opacity: 0.6; cursor: not-allowed; }

.form-success {
  text-align: center;
  padding: 32px;
  background: var(--green-soft);
  border-radius: var(--radius-sm);
}

.form-success .success-icon { font-size: 48px; margin-bottom: 12px; }
.form-success h4 { font-family: 'Syne', sans-serif; color: var(--green); margin-bottom: 8px; }
.form-success p { color: var(--text2); font-size: 14px; }
</style>
