import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import ChooseInterest from '../views/ChooseInterest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../views/SignUp.vue')
    },
    {
      path: '/interest',
      name: 'Choose Interest',
      component: ChooseInterest
    }
  ]
})

export default router
