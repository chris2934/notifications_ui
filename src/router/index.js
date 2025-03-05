import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'aws-amplify/auth'

const routes = [
    {
        path: '/',
        redirect: '/MessageLoginForm',

    },
    {
        path: '/MessageLoginForm',
        name: 'MessageLoginForm',
        component: () => import('../components/MessageLoginForm.vue')
    },
    {
        path: '/messages',
        name: 'Messages',
        component: () => import('../components/MessageApp.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            await getCurrentUser()
            next()
        } catch (error) {
            next('/MessageLoginForm')
        }
    } else {
        next()
    }
})

export default router
