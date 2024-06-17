<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

import CategoryLink from '@/components/CategoryLink.vue';
import CategoryItem from '@/components/CategoryItem.vue';
import InputSearch from '@/components/InputSearch.vue';

// import IconSearch from '@/components/icons/IconSearch.vue'
// import IconFolder from '@/components/icons/IconFolder.vue'
// import IconFile from '@/components/icons/IconFile.vue'
// import IconArrow from '@/components/icons/IconArrow.vue'
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
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    hasErrorFetchData.value = true;
  } finally {
    isLoadingFetchData.value = false;
  }
};

const isLoadingContentCategory = ref(false);
const hasErrorContentCategory = ref(false);

const filterContentCategory = async (idCategory) => {
  isLoadingContentCategory.value = true;
  try {
    const response = await axios.get(`http://api.kerajo.online/storage?idCategory=${idCategory}`);
    currentItems.value = response.data.children;
    console.log('Current Items Loaded:', currentItems.value);
  } catch (error) {
    console.error(
      'Ошибка при загрузке файлов и папок:',
      error.response ? error.response.data : error
    );
    hasErrorContentCategory.value = true;
    currentItems.value = '';
  } finally {
    isLoadingContentCategory.value = false;
  }
};

const getCategoryNameById = (id) => {
  const category = categories.value.find((category) => category.idCategory === parseInt(id));
  return category ? category.textCategory : '';
};

const isActiveCategory = (categoryId) =>
  computed(() => route.params.id === String(categoryId)).value;

const goBack = () => {
  // Добавляем обработчик события popstate
  window.addEventListener('popstate', () => {
    // Вызываем функцию после возврата на предыдущую страницу
    filterContentCategory(route.params.id);
  });
  // Выполняем переход на предыдущую страницу
  history.go(-1);
};

const toggleLinksVisibility = () => {
  linksVisible.value = !linksVisible.value;
};

onMounted(async () => {
  await fetchData();
  await filterContentCategory(route.params.id);
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
            :class="{ 'link--activ': isActiveCategory(list.idCategory) }"
          />
        </div>
        <div
          class="tool-bar__links links"
          :class="{ 'tool-bar__mobile-hidden': !linksVisible }"
          v-else-if="isLoadingFetchData"
          v-auto-animate
        >
          <span class="links__loading-notification notification">
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
          <h4 class="files__title" v-auto-animate>
            {{ getCategoryNameById(route.params.id) }}
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
              v-for="item in currentItems"
              :key="item.id"
              :itemType="item.type"
              :item="item"
              :categoryId="item.categoryId"
              :currentPath="currentPath"
            />
          </div>
          <div class="files__list list" v-else-if="isLoadingContentCategory">
            <span class="files__loading-notification notification">
              {{ $t('notification.loading') }}
            </span>
          </div>
          <div class="files__list list" v-else>
            <span class="files__erorr-notification notification">
              {{ $t('notification.nothing') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
