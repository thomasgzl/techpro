<template>
  <div class="rdv-form glass" v-reveal="{ delay: 0.1, y: 40 }">
    <div class="rdv-summary" :class="{ visible: summaryText }">
      <h4>{{ t('rdv.summary.title') }}</h4>
      <p>{{ summaryText || t('rdv.summary.placeholder') }}</p>
    </div>

    <h3>{{ t('rdv.form.title') }}</h3>

    <Transition name="swap" mode="out-in">
      <div v-if="!state.confirmedDetails" key="form">
        <div class="section-label service-selector-label">{{ t('rdv.form.serviceLabel') }}</div>
        <div class="service-selector">
          <div
            class="service-option"
            v-for="option in serviceOptions"
            :key="option.value"
            :class="{ selected: state.selectedService === option.value }"
            @click="selectService(option.value)"
          >
            <span class="opt-icon">{{ option.icon }}</span><span>{{ option.label }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('rdv.form.name') }}</label>
          <input type="text" :placeholder="t('rdv.form.namePlaceholder')" v-model="name">
        </div>
        <div class="form-group">
          <label>{{ t('rdv.form.phone') }}</label>
          <input type="tel" :placeholder="t('rdv.form.phonePlaceholder')" v-model="phone">
        </div>
        <div class="form-group">
          <label>{{ t('rdv.form.email') }}</label>
          <input type="email" :placeholder="`${t('rdv.form.emailPlaceholderUser')}@${t('rdv.form.emailPlaceholderDomain')}`" v-model="email">
        </div>
        <div class="form-group">
          <label>{{ t('rdv.form.description') }}</label>
          <textarea :placeholder="t('rdv.form.descriptionPlaceholder')" v-model="description" style="min-height: 80px;"></textarea>
        </div>
        <p class="form-error" v-if="state.submitError">{{ state.submitError }}</p>
        <button class="btn-full dark" v-magnetic="0.15" :disabled="state.submitting" @click="submit">
          {{ state.submitting ? t('rdv.form.submitting') : t('rdv.form.submit') }}
        </button>
      </div>

      <div class="rdv-confirmed" v-else key="confirmed">
        <div class="conf-icon">✅</div>
        <h3>{{ t('rdv.form.confirmedTitle') }}</h3>
        <div class="rdv-details">
          <p><span>{{ t('rdv.form.clientLabel') }}</span>{{ state.confirmedDetails.name }}</p>
          <p><span>{{ t('rdv.form.dateLabel') }}</span>{{ state.confirmedDetails.dateText }}</p>
          <p><span>{{ t('rdv.form.serviceLabel2') }}</span>{{ confirmedServiceLabel }}</p>
          <p><span>{{ t('rdv.form.emailSentLabel') }}</span>{{ state.confirmedDetails.email }}</p>
        </div>
        <p>{{ t('rdv.form.confirmedText') }}</p>
        <button class="btn-full dark" style="margin-top: 20px;" v-magnetic="0.15" @click="resetForm">{{ t('rdv.form.resetButton') }}</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBooking } from '../../composables/useBooking.js'

const { t, tm } = useI18n()
const { state, summaryText, selectService, submitBooking, resetBooking } = useBooking()

const serviceOptions = computed(() => tm('rdv.form.services'))
const confirmedServiceLabel = computed(
  () => serviceOptions.value.find((o) => o.value === state.confirmedDetails?.service)?.label ?? state.confirmedDetails?.service,
)

const name = ref('')
const phone = ref('')
const email = ref('')
const description = ref('')

async function submit() {
  if (state.submitting) return
  if (!state.selectedDay || !state.selectedSlot) {
    alert(t('rdv.form.alertNoSlot'))
    return
  }
  if (!state.selectedService) {
    alert(t('rdv.form.alertNoService'))
    return
  }
  if (!name.value.trim() || !phone.value.trim() || !email.value.trim()) {
    alert(t('rdv.form.alertMissingFields'))
    return
  }
  await submitBooking({
    name: name.value.trim(),
    phone: phone.value.trim(),
    email: email.value.trim(),
    description: description.value.trim(),
  })
}

function resetForm() {
  name.value = ''
  phone.value = ''
  email.value = ''
  description.value = ''
  resetBooking()
}
</script>

<style scoped>
.rdv-form {
  border-radius: var(--radius);
  padding: 32px;
  position: sticky;
  top: calc(var(--nav-h) + 24px);
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.swap-enter-from { opacity: 0; transform: scale(0.97); }
.swap-leave-to { opacity: 0; transform: scale(1.02); }

.rdv-summary {
  background: var(--accent-soft);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  margin-bottom: 24px;
  display: none;
}

.rdv-summary.visible { display: block; }

.rdv-summary h4 {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: var(--accent);
  margin-bottom: 4px;
}

.rdv-summary p { font-size: 13px; color: var(--text2); }

.rdv-form h3 {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 24px;
}

.service-selector-label { margin-bottom: 10px; }

.service-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.service-option {
  padding: 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.service-option:hover { border-color: var(--accent); transform: translateY(-2px); }
.service-option.selected { border-color: var(--accent); background: var(--accent-soft); animation: optionPop 0.3s ease; }

@keyframes optionPop {
  0% { transform: scale(0.92); }
  100% { transform: scale(1); }
}
.service-option .opt-icon { font-size: 20px; display: block; margin-bottom: 4px; }
.service-option span { font-size: 12px; font-weight: 500; }

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
.form-group textarea {
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
.form-group textarea:focus {
  border-color: var(--accent);
  background: var(--bg2);
}

.form-group textarea { resize: vertical; }

.form-error {
  color: #e24b4a;
  font-size: 13px;
  margin-top: 12px;
}

.btn-full:disabled { opacity: 0.6; cursor: not-allowed; }

.rdv-confirmed {
  text-align: center;
  padding: 32px 16px;
}

.rdv-confirmed .conf-icon {
  width: 64px; height: 64px;
  background: var(--green-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 20px;
}

.rdv-confirmed h3 { font-family: 'Syne', sans-serif; color: var(--green); margin-bottom: 12px; }
.rdv-confirmed p { font-size: 14px; color: var(--text2); line-height: 1.7; }
.rdv-confirmed .rdv-details {
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin: 20px 0;
  font-size: 14px;
  text-align: left;
}

.rdv-details p { margin-bottom: 6px; color: var(--text); }
.rdv-details p span { color: var(--text2); }
</style>
