<template>
  <component :is="headerComponent" />
  <router-view :class="containerClass" />
  <component :is="footerComponent" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import PageHeader from '@/components/HeaderBar.vue'
import PageFooter from '@/components/FooterBar.vue'
import UserHeader from '@/components/user/HeaderUser.vue'
import UserFooter from '@/components/user/FooterUser.vue'
import axios from 'axios'

const route = useRoute()
const token = localStorage.getItem('token')

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    }
    return Promise.reject(error)
  }
)


const layout = computed(() => route.meta.layout || 'page')

const headerComponent = computed(() => {
  if (layout.value === 'user') return null
  return {
    page: PageHeader,
    user: UserHeader,
    admin: null
  }[layout.value]
})

const footerComponent = computed(() => {
  if (layout.value === 'user') return UserFooter
  return {
    page: PageFooter,
    user: UserFooter,
    admin: null
  }[layout.value]
})

const containerClass = computed(() => {
  if (layout.value === 'admin') return 'w-full h-screen'
  if (layout.value === 'user') return 'w-full min-h-screen pb-20 lg:pt-20'
  return 'w-full'
})
</script>
