<script setup lang="ts">
import { ref,  defineModel } from 'vue'
import Password from '@/components/Password.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { Validation } from '@/common/Validation'
import { api } from '@/common/Axios'

const email = defineModel('email')
const password = defineModel('password')
const isLoading = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()

function validateEmailAndPassword(): boolean {
  const validation = new Validation(String(email.value), String(password.value))
  const result = validation.validateEmailAndPassword()
  if (!result.isValid) {
    errorMessage.value = result.errorMessage
  }
  return result.isValid
}

async function login() {
  if (!validateEmailAndPassword()) return // Exit if validation fails

  isLoading.value = true
  errorMessage.value = ''

  api
    .post(
      '/auth/login',
      {
        email: email.value,
        password: password.value
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      const { access_token } = response.data
      authStore.setToken(access_token)
      router.push('/interest')
    })
    .catch((error) => {
      if (error.response?.status && error.response?.data?.message) {
        errorMessage.value = error.response.data.message.join()
      } else if (error.response?.status === 401) {
        errorMessage.value = 'Invalid email or password.'
      } else {
        console.error('Login error:', error)
        errorMessage.value = 'An error occurred during login. Please try again'
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

function navigateToSignup() {
  router.push('/signup')
}
</script>

<template>
  <div>
    <div class="text-center">
      <v-card-title>Login</v-card-title>
      <v-card-title>Welcome to ECOMMERCE</v-card-title>
      <v-card-text>The next gen business marketplace</v-card-text>
    </div>

    <div class="text-subtitle-1 mt-4">Email</div>

    <v-text-field v-model="email" placeholder="Enter" variant="outlined"></v-text-field>

    <Password v-model="password"></Password>

    <v-btn color="black" block height="48" class="mt-2" :loading="isLoading" @click="login"
      >Login</v-btn
    >
    <v-divider class="border-opacity-25 my-4"></v-divider>

    <div class="text-center">
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <span class="mr-2">Don't have an account?</span>
          <span
            :class="isHovering ? 'text-decoration-underline' : undefined"
            v-bind="props"
            class="font-weight-medium cursor-pointer"
            @click="navigateToSignup"
          >
            SIGN UP
          </span>
        </template>
      </v-hover>
    </div>

    <div v-if="errorMessage" class="text-red mt-2">{{ errorMessage }}</div>
  </div>
</template>
