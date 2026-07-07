<template>
  <div>
    <div class="rdv-layout">
      <GradientOrbs :triple="false" />
      <div class="section-label" v-reveal>Agenda en ligne</div>
      <h2 v-reveal="{ delay: 0.05 }">Choisissez votre créneau</h2>
      <p class="section-intro" v-reveal="{ delay: 0.1 }">Réservez en quelques clics. Vous recevrez une confirmation par email avec tous les détails de votre rendez-vous.</p>

      <div class="rdv-grid">
        <BookingCalendar />
        <RdvForm />
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import BookingCalendar from '../components/rdv/BookingCalendar.vue'
import RdvForm from '../components/rdv/RdvForm.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import GradientOrbs from '../components/common/GradientOrbs.vue'
</script>

<style scoped>
.rdv-layout {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 48px;
}

.rdv-layout h2 { margin-bottom: 12px; }
.rdv-layout .section-intro { margin-bottom: 48px; }

.rdv-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: start;
}

@media (max-width: 768px) {
  .rdv-layout { padding: 48px 20px; }
  .rdv-grid { grid-template-columns: 1fr; }
}
</style>
