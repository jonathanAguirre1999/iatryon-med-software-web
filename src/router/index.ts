import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import UsersView from '../views/UsersView.vue'
import PatientsView from '../views/PatientsView.vue'
import AppLayout from '../layouts/AppLayout.vue'

import { useAuthStore } from '../stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/',
      component: AppLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: {
            roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'],
          },
        },
        {
          path: 'users',
          name: 'users',
          component: UsersView,
          meta: {
            roles: ['ADMIN'],
          },
        },
        {
          path: 'patients',
          name: 'patients',
          component: PatientsView,
          meta: {
            roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'],
          },
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.restoreSession()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/'
  }

  const allowedRoles = to.meta.roles as string[] | undefined

  if (
    allowedRoles &&
    authStore.user &&
    !allowedRoles.includes(authStore.user.role)
  ) {
    return '/'
  }
})

export default router
