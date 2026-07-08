<template>
  <footer>
    <div class="footer-logo">TechPro</div>
    <p>{{ t('footer.rights') }}</p>
    <router-link to="/admin" class="admin-link">{{ t('footer.adminLink') }}</router-link>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
footer {
  background: var(--ink);
  color: white;
  padding: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

footer p { font-size: 14px; opacity: 0.4; }
.footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; }

.admin-link {
  font-size: 12px;
  color: rgba(255,255,255,0.35);
  text-decoration: none;
  transition: color 0.2s;
}

.admin-link:hover { color: white; }

@media (max-width: 768px) {
  footer { padding: 32px 20px; }
}
</style>
