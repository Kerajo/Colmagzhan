<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import IconSearch from './icons/IconSearch.vue';

const route = useRouter();
const searchQuery = ref('');

const performSearch = () => {
  console.log('Search query:', searchQuery.value); // Добавлено логирование для отладки
  if (searchQuery.value.trim()) {
    route.push({ name: 'SearchResults', query: { query: searchQuery.value } });
    searchQuery.value = '';
  }
};
</script>
<template>
  <div class="search">
    <!-- Строка поиска -->
    <input
      type="text"
      class="search__input"
      v-model="searchQuery"
      @keyup.enter="performSearch"
      :placeholder="$t('header.placeholder')"
    />
    <!-- Иконка лупы для поиска -->
    <button class="search__button" @click="performSearch()">
      <IconSearch />
    </button>
  </div>
</template>
