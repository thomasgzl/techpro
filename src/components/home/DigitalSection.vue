<template>
  <div class="section" id="section-digital">
    <div class="section-number">03</div>
    <div class="section-label" v-reveal>Compétences digitales</div>
    <h2 v-reveal="{ delay: 0.05 }">Au-delà du dépannage</h2>
    <p class="section-intro" v-reveal="{ delay: 0.1 }">Développeur et créatif de formation, je mets également mes compétences web et design à votre service pour faire grandir votre présence en ligne.</p>

    <div class="digital-banner" v-reveal>
      <GradientOrbs :triple="false" />
      <div class="digital-banner-text">
        <span class="digital-badge">Nouveau</span>
        <h3>Vous avez un projet web ou une identité à créer ?</h3>
        <p>En plus du support informatique, je vous accompagne sur des projets digitaux : création de site, refonte graphique, référencement naturel ou audit d'accessibilité. Une seule personne de confiance pour tous vos besoins numériques.</p>
      </div>
      <div class="digital-banner-icon">✦</div>
    </div>

    <div class="digital-grid" v-reveal="{ children: '.digital-card', stagger: 0.1 }">
      <div class="digital-card glass" v-tilt="{ strength: 5 }" v-for="item in digitalServices" :key="item.title">
        <div class="digital-card-head">
          <IconBadge :icon="item.icon" :size="48" />
          <h3>{{ item.title }}</h3>
        </div>
        <p>{{ item.description }}</p>
        <div class="service-tags">
          <span class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconBadge from '../common/IconBadge.vue'
import GradientOrbs from '../common/GradientOrbs.vue'
import { digitalServices } from '../../data/digitalServices.js'
</script>

<style scoped>
.digital-banner {
  background: var(--ink);
  border-radius: var(--radius);
  padding: 40px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  margin-bottom: 28px;
  overflow: hidden;
  position: relative;
}

.digital-banner-text { flex: 1; position: relative; z-index: 1; }

.digital-badge {
  display: inline-block;
  background: var(--accent);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.digital-banner h3 {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.digital-banner p {
  color: rgba(255,255,255,0.6);
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
  max-width: 560px;
}

.digital-banner-icon {
  position: relative;
  z-index: 1;
  font-size: 120px;
  color: rgba(124,58,237,0.25);
  line-height: 1;
  flex-shrink: 0;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
}

.digital-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.digital-card {
  border-radius: var(--radius);
  padding: 32px;
  transition: box-shadow 0.3s ease;
}

.digital-card:hover { box-shadow: var(--shadow-lg); }

.digital-card-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.digital-card h3 {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.digital-card p {
  color: var(--text2);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .digital-grid { grid-template-columns: 1fr; }
  .digital-banner { flex-direction: column; padding: 28px 24px; }
  .digital-banner-icon { display: none; }
}
</style>
