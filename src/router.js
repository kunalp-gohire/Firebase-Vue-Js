import { createRouter, createWebHistory } from 'vue-router';

import AddLink from './pages/AddLink.vue';
import ListView from './pages/ListView.vue';
import NotFound from './pages/NotFound.vue';
import UploadFile from './pages/UploadFile.vue';
import FileList from './pages/FilesList.vue';
import UserAuth from './pages/UserAuth.vue'

import store from './store/index.js';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/linklist', meta: { requiresAuth: true } },
        { path: '/linklist', component: ListView, meta: { requiresAuth: true } },
        { path: '/add', component: AddLink, meta: { requiresAuth: true } },
        { path: '/filelist', component: FileList, meta: { requiresAuth: true } },
        { path: '/upload', component: UploadFile, meta: { requiresAuth: true } },
        { path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },
        { path: '/:notFound(.*)', component: NotFound }
    ]
});
router.beforeEach(function (to, _, next) {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        next('/auth');
    } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
        next('/');
    }
    else {
        next();
    }
});
export default router;