<template>
  <div>
    <div class="contact-layout">
      <GradientOrbs :triple="false" />
      <ContactInfo />
      <ContactForm />
    </div>
    <FaqSection />
    <SiteFooter />
  </div>
</template>

<script setup>
import ContactInfo from '../components/contact/ContactInfo.vue'
import ContactForm from '../components/contact/ContactForm.vue'
import FaqSection from '../components/contact/FaqSection.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import GradientOrbs from '../components/common/GradientOrbs.vue'
</script>

<style scoped>
.contact-layout {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 48px;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 80px;
  align-items: start;
}

.contact-layout > :deep(.contact-info),
.contact-layout > :deep(.contact-form) {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .contact-layout { grid-template-columns: 1fr; padding: 48px 20px; }
}
</style>
