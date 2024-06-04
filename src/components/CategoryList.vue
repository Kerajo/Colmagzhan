<script setup>
import { RouterLink } from 'vue-router'
import { defineProps } from 'vue'

import IconArrow from '@/components/icons/IconArrow.vue'

defineProps({
  idCategory: Number,
  textCategory: String
})
</script>
<template>
  <RouterLink :to="`/category/${idCategory}`" class="categories__item">
    <p class="categories__text">
      {{ textCategory }}
    </p>
    <div class="categories__icon">
      <IconArrow />
    </div>
  </RouterLink>
</template>
