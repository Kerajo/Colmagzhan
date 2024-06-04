<!-- views/ProductView.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

import CategoryLink from '@/components/CategoryLink.vue';
import InputSearch from '@/components/InputSearch.vue';

// import IconSearch from '@/components/icons/IconSearch.vue'
import IconBack from '@/components/icons/IconBack.vue';
import IconArrow from '@/components/icons/IconArrow.vue';

const { t } = useI18n({ useScope: 'global' });

const categories = ref([]);
const currentItems = ref([]);

const route = useRoute();
const currentPath = ref(route.params.path || '');
const linksVisible = ref(true);

const isLoadingFetchData = ref(false);
const hasErrorFetchData = ref(false);

const fetchData = async () => {
  isLoadingFetchData.value = true;
  try {
    const response = await axios.get('http://127.0.0.1:5000/categories');
    categories.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    hasErrorFetchData.value = true;
  } finally {
    isLoadingFetchData.value = false;
  }
};

const isLoadingContentFile = ref(false);
const hasErrorContentFile = ref(false);

const findItemsById = (items, id) => {
  items.forEach((item) => {
    if (item.id === id) {
      currentItems.value.push(item);
      console.log(currentItems);
      isLoadingContentFile.value = false; // Если найден нужный id, добавляем в currentItems
    } else if (item.children && item.children.length) {
      findItemsById(item.children, id); // Рекурсивно ищем в дочерних элементах
    } else {
      hasErrorContentFile.value = true;
    }
  });
};

const filterContentFile = async (routeQueryId) => {
  const queryId = parseInt(routeQueryId, 10); // Получаем id из строки запроса и преобразуем в число
  isLoadingContentFile.value = true;

  try {
    const response = await axios.get(`http://127.0.0.1:5000/storage`);
    const items = response.data;
    currentItems.value = [];
    findItemsById(items, queryId); // Используем функцию поиска для полученных данных
    console.log('Current Items Loaded:', currentItems.value);
  } catch (error) {
    console.error(
      'Ошибка при загрузке файлов и папок:',
      error.response ? error.response.data : error
    );
    hasErrorContentFile.value = true;
  }
};

const goBack = () => {
  // Добавляем обработчик события popstate
  window.addEventListener('popstate', () => {
    // Вызываем функцию после возврата на предыдущую страницу
    filterContentFile(route.query.id);
  });
  // Выполняем переход на предыдущую страницу
  history.go(-1);
};

const findCategoryText = computed(() => {
  return categories.value.find(
    (category) => category.idCategory === Number(currentItems.value[0].categoryId)
  );
});

const currentFileUrl = computed(() => {
  return currentItems.value.length > 0 ? currentItems.value[0].filepath : '';
});

const toggleLinksVisibility = () => {
  linksVisible.value = !linksVisible.value;
};

onMounted(async () => {
  await fetchData();
  await filterContentFile(route.query.id);
});
</script>

<template>
  <div class="files">
    <div class="files__tool-bar tool-bar">
      <div class="tool-bar__search-block">
        <h4 class="tool-bar__title">{{ $t('CFView.title-search') }}</h4>
        <InputSearch class="tool-bar__search" />
      </div>
      <div class="tool-bar__categories" v-auto-animate>
        <div class="tool-bar__categories-head" @click="toggleLinksVisibility">
          <h4 class="tool-bar__title">
            {{ $t('CFView.title-categories') }}
          </h4>
          <IconArrow :class="{ 'is-open': !linksVisible }" />
        </div>
        <div
          class="tool-bar__links links"
          :class="{ 'tool-bar__mobile-hidden': !linksVisible }"
          v-if="!isLoadingFetchData"
          v-auto-animate
        >
          <CategoryLink
            @click.native="filterContentCategory(list.idCategory)"
            v-for="list in categories"
            :key="list.idCategory"
            :textCategory="list.textCategory"
            :idCategory="list.idCategory"
            class="tool-bar__link link link--tool-bar"
          />
        </div>
        <div
          class="tool-bar__links links"
          :class="{ 'tool-bar__mobile-hidden': !linksVisible }"
          v-else-if="isLoadingFetchData"
          v-auto-animate
        >
          <span
            class="links__loading-notification notification"
            :class="{ 'tool-bar__mobile-hidden': !linksVisible }"
          >
            {{ $t('notification.loading') }}</span
          >
        </div>
        <div
          class="tool-bar__links links"
          :class="{ 'tool-bar__mobile-hidden': !linksVisible }"
          v-else
          v-auto-animate
        >
          <span class="files__erorr-notification notification">
            {{ $t('notification.error') }}</span
          >
        </div>
      </div>
    </div>
    <div class="files__main">
      <div class="files__head">
        <button @click="goBack" class="files__button-head button button--gray">
          <IconBack />
        </button>
        <div class="files__text" v-auto-animate>
          <h4
            class="files__title"
            v-if="!isLoadingFetchData && currentItems.length > 0"
            v-auto-animate
          >
            {{ currentItems[0].name }}
          </h4>
        </div>
      </div>
      <div
        class="files__content"
        v-if="!isLoadingFetchData && currentItems.length > 0"
        v-auto-animate
      >
        <div class="files__detalis detalis">
          <div class="detalis__category detalis__item">
            <p>{{ $t('CFView.detalis-category') }}</p>
            <RouterLink
              :to="`/category/${currentItems[0].categoryId}`"
              class="detalis__link link link--underline"
              >{{ findCategoryText.textCategory }}</RouterLink
            >
          </div>
          <div class="detalis__down">
            <div class="detalis__item">
              <p>{{ $t('CFView.detalis-date') }}</p>
              <span class="detalis__date">{{ currentItems[0].fileDate }}</span>
            </div>
            <div class="detalis__item">
              <p>{{ $t('CFView.detalis-formate') }}</p>
              <span class="detalis__fotmate">{{ currentItems[0].fileType }}</span>
            </div>
            <div class="detalis__item">
              <p>{{ $t('CFView.detalis-size') }}</p>
              <span class="detalis__size">{{ currentItems[0].fileSize }}</span>
            </div>
          </div>
        </div>
        <div class="files__buttons buttons">
          <a :href="currentFileUrl" download class="files__button button">{{
            $t('CFView.button-download')
          }}</a>
          <a
            :href="currentFileUrl"
            target="_blank"
            class="files__button files__button--gray button button--transparent"
            >{{ $t('CFView.button-view') }}</a
          >
        </div>
      </div>
      <div class="files__content" v-else-if="isLoadingFetchData && currentItems.length === 0">
        <span class="files__content-notification notification">
          {{ $t('notification.loading') }}
        </span>
      </div>
      <div class="files__content" v-else-if="hasErrorContentFile">
        <span class="files__content-notification notification">
          {{ $t('notification.error') }}
        </span>
      </div>
    </div>
  </div>
</template>
