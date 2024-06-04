<script setup>
import { RouterLink } from 'vue-router'
import { defineProps } from 'vue'

defineProps({
  idCategory: Number,
  textCategory: String
})
</script>
<template>
  <RouterLink :to="`/category/${idCategory}`">
    {{ textCategory }}
  </RouterLink>
</template>
