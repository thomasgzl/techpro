import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactView from '../views/ContactView.vue'
import RdvView from '../views/RdvView.vue'
import { useAuth, authReady } from '../composables/useAuth.js'

const router = createRouter({
  history: createWebHistory(),
  // Scroll reset is handled via Lenis (see App.vue) since it intercepts
  // native scrolling — the built-in scrollBehavior would fight it.
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/contact', name: 'contact', component: ContactView },
    { path: '/rdv', name: 'rdv', component: RdvView },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLoginView.vue'),
      meta: { admin: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminView.vue'),
      meta: { admin: true, requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  await authReady()
  const { session } = useAuth()
  if (!session.value) {
    return { name: 'admin-login' }
  }
  return true
})

export default router
