<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import CategoryLink from '@/components/CategoryLink.vue';
import CategoryItem from '@/components/CategoryItem.vue';
import InputSearch from '@/components/InputSearch.vue';

// import IconSearch from '@/components/icons/IconSearch.vue'
// import IconFolder from '@/components/icons/IconFolder.vue'
// import IconFile from '@/components/icons/IconFile.vue'
// import IconArrow from '@/components/icons/IconArrow.vue'
import IconBack from '@/components/icons/IconBack.vue';
import IconArrow from '@/components/icons/IconArrow.vue';

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
    const response = await axios.get('http://api.kerajo.online/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    hasErrorFetchData.value = true;
  } finally {
    isLoadingFetchData.value = false;
  }
};

const isLoadingContentCategory = ref(false);
const hasErrorContentCategory = ref(false);

const findItemsById = (items, id) => {
  items.forEach((item) => {
    if (item.id === id) {
      console.log('Item: ', item);
      console.log('Full: ', currentItems.value);
      currentItems.value.push(item); // Если найден нужный id, добавляем в currentItems
    }
    if (item.children && item.children.length) {
      findItemsById(item.children, id); // Рекурсивно ищем в дочерних элементах
    }
  });
};

const filterContentCategory = async (routeQueryId) => {
  isLoadingContentCategory.value = true;
  const queryId = parseInt(routeQueryId, 10); // Получаем id из строки запроса и преобразуем в число

  try {
    const response = await axios.get(`http://185.129.50.76/storage`);
    const items = response.data;
    currentItems.value = [];
    findItemsById(items, queryId); // Используем функцию поиска для полученных данных
    console.log('Current Items Loaded:', currentItems.value);
  } catch (error) {
    console.error(
      'Ошибка при загрузке файлов и папок:',
      error.response ? error.response.data : error
    );
    hasErrorContentCategory.value = true;
  } finally {
    isLoadingContentCategory.value = false;
  }
};

const goBack = () => {
  // Добавляем обработчик события popstate
  window.addEventListener('popstate', () => {
    // Вызываем функцию после возврата на предыдущую страницу
    filterContentCategory(route.query.id);
  });
  // Выполняем переход на предыдущую страницу
  history.go(-1);
};

const toggleLinksVisibility = () => {
  linksVisible.value = !linksVisible.value;
};

onMounted(async () => {
  await fetchData();
  await filterContentCategory(route.query.id);
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
          <h4 class="files__title" v-if="currentItems.length > 0" v-auto-animate>
            {{ currentItems[0].name }}
          </h4>
        </div>
      </div>
      <div class="files__content">
        <div class="files__item" v-auto-animate>
          <div
            class="files__list list"
            v-if="!isLoadingContentCategory && currentItems.length > 0"
            v-auto-animate
          >
            <CategoryItem
              v-for="item in currentItems[0].children"
              @click.native="filterContentCategory(item.id)"
              :key="item.id"
              :itemType="item.type"
              :item="item"
              :categoryId="item.categoryId"
              :currentPath="currentPath"
            />
          </div>
          <div class="files__list list" v-if="isLoadingContentCategory">
            <span class="files__loading-notification notification">
              {{ $t('notification.loading') }}
            </span>
          </div>
          <div class="files__list list" v-if="hasErrorContentCategory">
            <span class="files__erorr-notification notification">
              {{ $t('notification.nothing') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
