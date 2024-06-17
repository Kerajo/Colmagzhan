<script setup>
import { ref, onMounted, provide } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

import CategoryList from '@/components/CategoryList.vue';

import IconLocation28 from '@/components/icons/IconLocation28.vue';
import IconCall28 from '@/components/icons/IconCall28.vue';
import IconMail28 from '@/components/icons/IconMail28.vue';

const categories = ref([]);

const { t } = useI18n({ useScope: 'global' });

const isLoadingFetchData = ref(false);
const hasErrorFetchData = ref(false);

const fetchData = async () => {
  isLoadingFetchData.value = true;
  try {
    const response = await axios.get('http://api.kerajo.online/categories');
    console.log('fffsdfs:', response.data);
    // Записываем полученные данные в переменную
    categories.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    hasErrorFetchData.value = true;
  } finally {
    isLoadingFetchData.value = false;
  }
};

provide('categoryies', categories);
onMounted(fetchData);
</script>
<template>
  <div class="hero__home hero">
    <div class="hero__hello">
      <div class="hero__illustration">
        <!-- Иллюстрация -->
        <img src="/img_hero.svg " alt="Иллюстрация" />
      </div>
      <div class="hero__content">
        <h1 class="hero__title">
          {{ $t('hero.hero__title1/2') }} <span>{{ $t('hero.hero__title-span') }}</span> <br />
          {{ $t('hero.hero__title2/2') }}
        </h1>
        <p class="hero__description">
          {{ $t('hero.hero__description') }}
        </p>
        <div class="hero__buttons">
          <!-- Две кнопки ссылки -->
          <RouterLink to="/auth" class="hero__button button">{{
            $t('hero.hero__button-auth')
          }}</RouterLink>
          <a
            href="https://colmagzhan.kz/content/o-kolledghe/lang-ru"
            class="hero__button button button--transparent"
            >{{ $t('hero.hero__button-about') }}</a
          >
        </div>
      </div>
    </div>
    <div class="hero__banner">
      <!-- Кнопка якорная ссылка -->
      <a href="#categories" class="hero__link"></a>
    </div>
  </div>

  <div class="categories__home categories" id="categories" v-auto-animate>
    <h2 class="categories__title">{{ $t('hero.categories__title') }}</h2>
    <div class="categories__list" v-if="!isLoadingFetchData" v-auto-animate>
      <CategoryList
        v-for="list in categories"
        :key="list.idCategory"
        :id-category="list.idCategory"
        :text-category="list.textCategory"
      />
    </div>
    <div
      class="categories__list categories__list--notification"
      v-else-if="isLoadingFetchData"
      v-auto-animate
    >
      <span class="categories__list__loading-notification notification">{{
        $t('notification.loading')
      }}</span>
    </div>
    <div class="categories__list categories__list--notification" v-else v-auto-animate>
      <span class="categories__list__error-notification notification">{{
        $t('notification.error')
      }}</span>
    </div>
  </div>
  <div class="college-info__home college-info">
    <div class="college-info__left">
      <h3 class="college-info__title">
        {{ $t('hero.college-info__title-college') }}
      </h3>
      <div class="college-info__director">
        <img src="/Director_photo.jpg" alt="Фото диретора" class="college-info__director-photo" />
        <div class="college-info__director-info">
          <p class="college-info__director-name">
            {{ $t('hero.college-info__director-name') }}
          </p>
          <p class="college-info__director-position">
            {{ $t('hero.college-info__director-post') }}
          </p>
        </div>
      </div>
      <p class="college-info__description">
        <span>{{ $t('hero.college-info__description-span') }}</span>
        {{ $t('hero.college-info__description') }}
      </p>
      <a
        href="https://colmagzhan.kz/content/o-kolledghe/lang-ru"
        class="college-info__button button"
        >{{ $t('hero.college-info__button') }}</a
      >
    </div>
    <div class="college-info__right">
      <h3 class="college-info__title">{{ $t('hero.college-info__title-contact') }}</h3>
      <div class="college-info__contacts contacts">
        <div class="college-info__contact contact">
          <div class="college-info__contact-icon contact__icon">
            <IconCall28 />
          </div>
          <p class="college-info__contact-text contact__text">+7 (7152) 36-91-36</p>
        </div>
        <div class="college-info__contact contact">
          <div class="college-info__contact-icon contact__icon">
            <IconLocation28 />
          </div>
          <p class="college-info__contact-text contact__text">
            {{ $t('hero.college-info__contact-text-address') }}
          </p>
        </div>
        <div class="college-info__contact contact">
          <div class="college-info__contact-icon contact__icon">
            <IconMail28 />
          </div>
          <p class="college-info__contact-text contact__text">Colmagzhan@mail.ru</p>
        </div>
      </div>
      <div class="college-info__map">
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A0e16d009c9b2d8a816eccf110e198d8adf447540f336516d7371e4c25fc2ff78&amp;source=constructor"
          width="555"
          height="292"
          frameborder="0"
        ></iframe>
        <button class="college-info__map-button button button--white">
          Посмотреть на <span>Я.Картах</span>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
