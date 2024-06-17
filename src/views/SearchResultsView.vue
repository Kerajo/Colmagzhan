<script setup>
import { onMounted, ref, defineProps, watch } from 'vue';
import axios from 'axios';
import { useRoute, RouterLink } from 'vue-router';
import Fuse from 'fuse.js';
import { useI18n } from 'vue-i18n';

import CategoryItem from '@/components/CategoryItem.vue';

const route = useRoute();
const searchResults = ref([]);
const isLoadingContentFile = ref(false);
const hasErrorContentFile = ref(false);

const { t } = useI18n({ useScope: 'global' });

const props = defineProps({
  query: String
});

// Настройки для Fuse.js
const options = {
  includeScore: true,
  keys: ['name', 'fileType', 'fileDate'],
  threshold: 0.3 // Порог чувствительности поиска
};

const currentPath = ref(route.params.path || '');

const recursiveSearch = (items, query, fuseOptions, accumulatedResults = []) => {
  const fuse = new Fuse(items, fuseOptions);
  const results = fuse.search(query);

  // Аккумулируем результаты с их score
  results.forEach((result) => {
    accumulatedResults.push({
      item: result.item,
      score: result.score
    });
  });

  // Рекурсивно обрабатываем дочерние элементы
  items.forEach((item) => {
    if (item.children && item.children.length) {
      recursiveSearch(item.children, query, fuseOptions, accumulatedResults);
    }
  });

  return accumulatedResults; // Возвращаем накопленные результаты для верхнего вызова
};

const fetchAndSearch = async (query) => {
  isLoadingContentFile.value = true;
  try {
    const response = await axios.get('http://api.kerajo.online/storage');
    const allMatches = recursiveSearch(response.data, query, options);
    // Сортируем результаты по score
    allMatches.sort((a, b) => a.score - b.score);
    // Обновляем searchResults уже отсортированными элементами
    searchResults.value = allMatches.map((match) => match.item);
  } catch (error) {
    console.error('Ошибка при загрузке файлов и папок:', error);
    hasErrorContentFile.value = true;
  } finally {
    isLoadingContentFile.value = false;
  }
};

onMounted(async () => {
  await fetchAndSearch(route.query.query);
});

watch(
  () => route.query.query,
  (newQuery) => {
    fetchAndSearch(newQuery);
  }
);
</script>

<template>
  <div class="files search-result" v-auto-animate>
    <div class="files__main search-result__main">
      <div class="files__head">
        <div class="files__text">
          <p class="files__subtitle">{{ $t('search.subtitle') }} "{{ props.query }}"</p>
          <h4 class="files__title" v-if="!isLoadingContentFile && searchResults.length >= 1">
            {{ $t('search.title') }}
            <span v-if="searchResults.length === 1"
              >{{ searchResults.length }} {{ $t('search.one-file') }}</span
            >
            <span v-else-if="searchResults.length <= 4"
              >{{ searchResults.length }} {{ $t('search.to-four-files') }}</span
            >
            <span v-else>{{ searchResults.length }} {{ $t('search.more-four-files') }}</span>
          </h4>
          <h4 class="files__title" v-else-if="searchResults.length === 0">
            {{ $t('search.title-not-found') }}
          </h4>
        </div>
      </div>
      <div class="files__content">
        <div class="files__item" v-if="!isLoadingContentFile && searchResults.length >= 1">
          <div class="files__list list" v-if="searchResults.length > 0" v-auto-animate>
            <CategoryItem
              v-for="item in searchResults"
              :key="item.id"
              :itemType="item.type"
              :item="item"
              :categoryId="item.categoryId"
              :currentPath="currentPath"
            />
          </div>
        </div>
        <div class="files__item" v-else-if="isLoadingContentFile" v-auto-animate>
          <span class="files__item__loading-notification notification">
            {{ $t('notification.loading') }}
          </span>
        </div>
        <div class="files__buttons buttons" v-else-if="searchResults.length === 0">
          <RouterLink to="/category/1" class="files__button button">{{
            $t('search.button-categories')
          }}</RouterLink>
          <RouterLink to="/" class="files__button files__button--gray button button--transparent">{{
            $t('search.button-home')
          }}</RouterLink>
        </div>
        <div class="files__item" v-else-if="hasErrorContentFile" v-auto-animate>
          <span class="files__item__erorr-notification notification">{{
            $t('notification.error')
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
