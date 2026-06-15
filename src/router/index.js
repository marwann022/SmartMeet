import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // ── PUBLIC (Navbar + Footer layout) ────────────────────────────────
  {
    path: '/',
    component: () => import('@/components/layout/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/public/Home.vue')
      },
      {
        path: 'features',
        name: 'Features',
        component: () => import('@/views/public/Features.vue')
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: () => import('@/views/public/Pricing.vue')
      }
    ]
  },

  // ── AUTH (standalone, no layout shell) ─────────────────────────────
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('@/views/auth/SignIn.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/auth/SignUp.vue')
  },

  // ── APP (Sidebar + Header layout) ──────────────────────────────────
  {
    path: '/',
    component: () => import('@/components/layout/AuthenticatedLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/app/Dashboard.vue')
      },
      {
        path: 'archive',
        name: 'Archive',
        component: () => import('@/views/app/Archive.vue')
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: () => import('@/views/app/Tasks.vue')
      },
      {
        path: 'knowledge-ai',
        name: 'KnowledgeAI',
        component: () => import('@/views/app/KnowledgeAI.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/app/Settings.vue')
      },
      {
        path: 'new-meeting',
        name: 'NewMeeting',
        component: () => import('@/views/app/NewMeeting.vue')
      },
      {
        path: 'live-meeting',
        name: 'LiveMeeting',
        component: () => import('@/views/app/LiveMeeting.vue')
      }
    ]
  },

  // ── FALLBACK ────────────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

// Navigation guard — swap `true` with useAuthStore().isAuthenticated when auth is implemented
router.beforeEach((to) => {
  const isAuthenticated = true // TODO: replace with real auth check
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'SignIn' }
  }
})

export default router
