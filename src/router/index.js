import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NotFoundView from '../views/404View.vue';
import AuthView from '../views/AuthView.vue';
import AuthBlocker from '../views/AuthBlocker.vue';
import СategoryView from '../views/СategoryView.vue';
import FolderView from '../views/FolderView.vue';
import FileView from '../views/FileView.vue';
import SearchResults from '../views/SearchResultsView.vue';
import TestView from '../views/TestView.vue';
import store from '../store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/block',
      name: 'auth-blocker',
      component: AuthBlocker
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: { requiresAuth: true } // Указываем, что этот маршрут требует аутентификации
    },
    {
      path: '/category/:id',
      component: СategoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/category/:id/:pathMatch(.*)*/:folderName',
      name: 'category',
      component: FolderView,
      meta: { requiresAuth: true }
    },
    {
      path: `/category/:id//:pathMatch(.*)*/file/:fileName`,
      name: 'file',
      component: FileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults,
      meta: { requiresAuth: true },
      props: (route) => ({ query: route.query.query })
    },
    {
      path: '/404',
      name: '404',
      component: NotFoundView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = store.getters.authData !== null;

  if (requiresAuth && !isAuthenticated) {
    next('/block'); // Перенаправляем на страницу block
  } else {
    next();
  }
});

export default router;
