<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import router from '../router'
import { useAuthStore } from '@/stores/auth' // Assuming you have an Auth store
import { Categories, Category } from '../common/Categories'
import { api } from '@/common/Axios'

const interests = ref([])
const selectedInterests = ref([])
const currentPage = ref(1)
const perPage = 6
const isLoading = ref(false)
const errorMessage = ref(null)
const debounceTimeout = ref(null)
const interestsToSend = ref([])
const recentSelectedInterests = ref([])
const userSelectedInterests = ref([])

function fetchInterests(pageId = 1) {
  isLoading.value = true
  api
    .get(`/categories?page=${pageId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    .then((response) => {
      interests.value = response.data as Categories

      const matchingInterestIds = interests.value.data
        .filter((interest) =>
          userSelectedInterests.value.some(
            (userSelectedInterest) => interest.id === userSelectedInterest
          )
        )
        .map((selected) => selected.id)

      selectedInterests.value = [...new Set([...selectedInterests.value, ...matchingInterestIds])]
    })
    .catch((error) => {
      console.error('Error fetching interests:', error)
      if (error.response?.status === 401) {
        router.push('/') // Redirect to login page (adjust as needed)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

function getToken(): string {
  return useAuthStore().token
}

function isInterestSelected(id: string) {
  return selectedInterests.value.includes(id)
}

function toggleInterestSelection(interest: Category) {
  const index = selectedInterests.value.indexOf(interest.id)
  if (index !== -1) {
    removeInterests(interest)
  } else {
    selectedInterests.value.push(interest.id)
    recentSelectedInterests.value.push(interest.id)
  }
  // Trigger debounced API call on selection change
  debouncedAddInterests()
}

const paginatedInterests = computed(() => {
  if (interests.value && interests.value?.data) {
    const start = (currentPage.value - 1) * perPage
    const end = start + perPage
    return interests.value.data
  }
})

function nextPage() {
  if (currentPage.value < interests.value.total_page) {
    currentPage.value++
    fetchInterests(currentPage.value)
  }
}

function previousPage() {
  if (currentPage.value > 1 && interests?.value?.total_page > 1) {
    currentPage.value--
    fetchInterests(currentPage.value)
  }
}

function debouncedAddInterests() {
  clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    const selectedIds = recentSelectedInterests.value
    interestsToSend.value = [...selectedIds] // Copy selected interests
    addInterests()
  }, 500)
}

function addInterests() {
  const selectedInterestIds = interestsToSend.value

  if (!selectedInterestIds.length) {
    return // Handle no selections
  }

  isLoading.value = true
  const data = JSON.stringify({ interests: selectedInterestIds })

  api
    .put('/users/interests', data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log('Interests added successfully:', response.data)
      interestsToSend.value = []
    })
    .catch((error) => {
      console.error('Error adding interests:', error)
      errorMessage.value = 'Failed to add interests. Please try again later.'
    })
    .finally(() => {
      isLoading.value = false
    })
}

function removeInterests(interestId: Category) {
  isLoading.value = true
  api
    .delete(`/users/interests/${interestId.id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log(JSON.stringify(response.data))
      const index = selectedInterests.value.findIndex((interest) => interestId.id === interest.id)
      if (index > 0) {
        selectedInterests.value.splice(index, 1)
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      isLoading.value = false
    })
}

function fetchUserInterest() {
  isLoading.value = true
  const data = JSON.stringify({}) // No data needed in request body

  api
    .get('/users/interests', {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      userSelectedInterests.value = response.data.map((interest) => interest.id)
    })
    .catch((error) => {
      console.error('Error fetching interests:', error)
      if (error.response?.status === 401) {
        router.push('/') // Redirect to login page (adjust as needed)
      }
    })
    .then(fetchInterests)
    .finally(() => {
      isLoading.value = false
    })
}

fetchUserInterest()
</script>

<template>
  <div>
    <div class="text-center">
      <v-card-title class="text-h4 mb-3">Please mark your interest!</v-card-title>
      <v-card-text class="font-weight-medium">We will keep you notified</v-card-text>
    </div>

    <div class="text-subtitle-1 font-weight-bold my-4">My saved intrests!</div>

    <v-card-text>
      <v-checkbox
        v-for="interest in paginatedInterests"
        :key="interest.id"
        v-model="selectedInterests"
        :label="interest.name"
        :value="interest.id"
        color="black"
        hide-details
        density="comfortable"
        :checked="isInterestSelected(interest.id)"
        @click="toggleInterestSelection(interest)"
      ></v-checkbox>
    </v-card-text>

    <div class="d-flex justify-content-between mt-4">
      <v-btn variant="text" rounded :disabled="currentPage === 1" @click="previousPage"
        >Previous</v-btn
      >
      <v-btn
        variant="text"
        rounded
        :disabled="currentPage === Math.ceil(interests.length / perPage)"
        @click="nextPage"
        >Next</v-btn
      >
    </div>
  </div>
</template>
