import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'recipes',
        component: () => import('pages/RecipePage.vue'),
      },
      {
        path: 'calculator',
        component: () => import('pages/CalculatorPage.vue'),
      },
      {
        path: 'fridge',
        component: () => import('pages/FridgePage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
