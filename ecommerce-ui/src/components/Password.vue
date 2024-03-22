<template>
  <div>
    <div class="text-subtitle-1 mt-2">Password</div>

    <v-text-field
      placeholder="Enter"
      variant="outlined"
      :type="show1 ? 'text' : 'password'"
      @input="emit(`update:modelValue`, $event.target.value)"
    >
      <template v-slot:append-inner>
        <span variant="text" class="text-decoration-underline font-weight-regular" @click="toggle"
          >Show</span
        >
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show1 = ref(0)

function toggle() {
  show1.value = !show1.value
}

const emit = defineEmits(['update:modelValue'])
</script>
