<template>
  <div class="contact-info">
    <div class="section-label" v-reveal>Parlons-en</div>
    <h2 v-reveal="{ delay: 0.05 }">On est là pour vous aider</h2>
    <p v-reveal="{ delay: 0.1 }">Une question avant de réserver ? Un problème urgent ? Contactez-nous par le moyen qui vous convient le mieux. Nous répondons généralement en moins de 2 heures.</p>

    <div class="contact-methods" v-reveal="{ children: '.contact-method', stagger: 0.08, delay: 0.15 }">
      <div class="contact-method glass" v-for="method in methods" :key="method.title">
        <div class="contact-method-icon">{{ method.icon }}</div>
        <div>
          <h4>{{ method.title }}</h4>
          <p>{{ method.detail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const methods = [
  { icon: '📞', title: 'Téléphone', detail: '06 17 48 82 62 · Lun-Sam 8h–19h' },
  { icon: '✉️', title: 'Email', detail: 'contact@techpro.com' },
  { icon: '📍', title: 'Atelier', detail: 'Annecy · Sur rendez-vous' },
  { icon: '🏠', title: 'À domicile', detail: 'Déplacement Annecy & 30km autour' },
]
</script>

<style scoped>
.contact-info p { color: var(--text2); font-size: 16px; font-weight: 300; margin-bottom: 40px; line-height: 1.7; }

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius-sm);
  transition: transform 0.25s ease;
}

.contact-method:hover { transform: translateX(4px); }

.contact-method-icon {
  width: 44px; height: 44px;
  background: var(--accent-soft);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.contact-method h4 {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 2px;
}

.contact-method p { color: var(--text2); font-size: 13px; margin: 0; }
</style>
