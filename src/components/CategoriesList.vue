<script setup>
import { defineProps } from 'vue'

import CategoryItem from './CategoryList.vue'

const props = defineProps({
  cateriesList: Array
})

console.log(props)
</script>
<template>
  <div class="categories__list" v-for="list in cateriesList" :key="list.idCategory">
    <CategoryItem :id-category="list.idCategory" :text-category="list.textCategory" />
  </div>
</template>
