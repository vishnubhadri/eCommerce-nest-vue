<script setup lang="ts">
import { ref, reactive, defineModel } from 'vue'
import Password from '@/components/Password.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { Validation } from '../common/Validation'
import { api } from '@/common/Axios'

const name = defineModel('name')
const email = defineModel('email')
const password = defineModel('password')
const isLoading = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()

function signup() {
  if (!validateEmailAndPassword()) return // Exit if validation fails

  isLoading.value = true
  errorMessage.value = ''

  // Using promise chaining
  api
    .post(
      '/auth/signup',
      {
        name: name.value,
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
    .catch((error: any) => {
      if (error.response?.status && error.response?.data?.message) {
        errorMessage.value = error.response.data.message.join()
      } else if (error.response?.status === 400) {
        // Handle specific errors from the backend (e.g., email already exists)
        errorMessage.value = 'Signup failed. Please check your information.' // Adjust message as needed
      } else {
        console.error('Signup error:', error)
        errorMessage.value = 'An error occurred during signup.'
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

function validateEmailAndPassword(): boolean {
  const validation = new Validation(String(email.value), String(password.value))
  const result = validation.validateEmailAndPassword()
  if (!result.isValid) {
    errorMessage.value = result.errorMessage
  }
  return result.isValid
}

function navigateToLogin() {
  router.push('/')
}
</script>

<template>
  <div>
    <div class="text-center">
      <v-card-title>Create your account</v-card-title>
    </div>

    <div class="text-subtitle-1 mt-4">Name</div>

    <v-text-field v-model="name" placeholder="Enter" variant="outlined"></v-text-field>

    <div class="text-subtitle-1 mt-4">Email</div>

    <v-text-field v-model="email" placeholder="Enter" variant="outlined"></v-text-field>

    <Password v-model="password"></Password>

    <v-btn color="black" block height="48" class="mt-2" :disabled="isLoading" @click="signup"
      >Sign Up</v-btn
    >
    <v-divider class="border-opacity-25 my-4"></v-divider>

    <div class="text-center">
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <span class="mr-2">Have an account?</span>
          <span
            :class="isHovering ? 'text-decoration-underline' : undefined"
            v-bind="props"
            class="font-weight-medium cursor-pointer"
            @click="navigateToLogin"
          >
            Login
          </span>
        </template>
      </v-hover>
    </div>

    <div v-if="errorMessage" class="text-red mt-2">{{ errorMessage }}</div>
  </div>
</template>
