import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    // ── PUBLIC ─────────────────────────────────────────────
    {
        path: '/',
        component: () =>
            import ('@/components/layout/PublicLayout.vue'),
        children: [{
                path: '',
                name: 'Home',
                component: () =>
                    import ('@/views/public/Home.vue')
            },
            {
                path: 'features',
                name: 'Features',
                component: () =>
                    import ('@/views/public/Features.vue')
            },
            {
                path: 'pricing',
                name: 'Pricing',
                component: () =>
                    import ('@/views/public/Pricing.vue')
            }
        ]
    },

    // ── AUTH ───────────────────────────────────────────────
    {
        path: '/signin',
        name: 'SigniIn',
        component: () =>
            import ('@/views/auth/SignIn.vue')
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () =>
            import ('@/views/auth/ForgotPassword.vue')
    },
    {
        path: '/reset-password/:token',
        name: 'ResetPassword',
        component: () =>
            import ('@/views/auth/ResetPassword.vue')
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: () =>
            import ('@/views/auth/SignUp.vue')
    },

    // ── APP ────────────────────────────────────────────────
    {
        path: '/',
        component: () =>
            import ('@/components/layout/AuthenticatedLayout.vue'),
        meta: { requiresAuth: true },
        children: [{
                path: 'dashboard',
                name: 'Dashboard',
                component: () =>
                    import ('@/views/app/Dashboard.vue')
            },
            {
                path: 'archive',
                name: 'Archive',
                component: () =>
                    import ('@/views/app/Archive.vue')
            },
            {
                path: 'tasks',
                name: 'Tasks',
                component: () =>
                    import ('@/views/app/Tasks.vue')
            },
            {
                path: 'knowledge-ai',
                name: 'KnowledgeAI',
                component: () =>
                    import ('@/views/app/KnowledgeAI.vue')
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () =>
                    import ('@/views/app/Settings.vue')
            },
            {
                path: 'new-meeting',
                name: 'NewMeeting',
                component: () =>
                    import ('@/views/app/NewMeeting.vue')
            },
            {
                path: 'live-meeting',
                name: 'LiveMeeting',
                component: () =>
                    import ('@/views/app/LiveMeeting.vue')
            }
        ]
    },

    // ── FALLBACK ───────────────────────────────────────────
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

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (to.meta.requiresAuth && !user) {
        next('/signin')
        return
    }

    // Pending/rejected users can only access /dashboard and /settings
    if (user && to.meta.requiresAuth) {
        const restricted = user.status === 'pending' || user.status === 'rejected'
        const allowed = to.path === '/dashboard' || to.path === '/settings'
        if (restricted && !allowed) {
            next('/dashboard')
            return
        }
    }

    next()
})

export default router