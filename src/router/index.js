import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/messages', // Redirect to the default "messages" route
    },
    {
        path: '/messages',
        name: 'Messages',
        component: () => import('@/components/MessageApp.vue') // Ensure the path is correct
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Log all navigation errors
router.onError((error) => {
    console.error('Vue Router Error:', error);
});

// Optional: Add a global beforeEach guard for debugging
router.beforeEach((to, from, next) => {
    try {
        console.log('Navigating from:', from.path, 'to:', to.path);
        next();
    } catch (error) {
        console.error('Navigation Guard Error:', error);
        next(false);
    }
});

export default router;