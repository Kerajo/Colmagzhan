<script setup>
import { ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import InputSearch from './InputSearch.vue';

import IconSearch from './icons/IconSearch.vue';
import IconClose from './icons/IconClose.vue';
import IconBurgerMenu from './icons/IconBurgerMenu.vue';
import IconArrow from './icons/IconArrow.vue';

const router = useRouter();
const store = useStore();
const isOpen = ref(false);
const isProfileMenuOpen = ref(false);
const isMenuOpen = ref(false); // Состояние видимости бургер-меню
const isSearchOpen = ref(false);

const { t, locale } = useI18n({ useScope: 'global' });

const selectedLang = computed(() => store.state.selectedLang);
const options = [
  { lang: 'RU', label: 'Русский' },
  { lang: 'KZ', label: 'Қазақша' },
  { lang: 'EN', label: 'English' }
];

const toggleDropdown = () => {
  isProfileMenuOpen.value = false;
  isOpen.value = !isOpen.value;
};

const changeLanguage = (lang) => {
  store.dispatch('updateLanguage', lang);
  locale.value = lang;
  isOpen.value = false; // Закрываем выпадающий список после выбора
};

const toggleProfileMenu = () => {
  isOpen.value = false;
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const logout = () => {
  toggleProfileMenu(); // Закрываем меню профиля

  // Очистить данные аутентификации
  store.commit('clearAuthData');

  // Перенаправить пользователя на страницу входа или главную страницу
  router.push('/'); // Предполагается, что у вас есть маршрут на страницу входа
};

// Функция для переключения состояния меню

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  const body = document.querySelector('body');

  body.classList.toggle('lock');
};
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const authData = computed(() => store.getters.authData);
</script>
<template>
  <header class="header">
    <div class="wrapper">
      <RouterLink to="/" class="header__logo logo">
        <!-- Логотип Colmagzhan -->
        <img class="logo__img" src="/logo-64px.png" alt="Логотип colmagzhan" />
        <div class="logo__info">
          <!-- Название компании -->
          <span class="logo__company-name">Colmagzhan</span>
          <!-- Описание компании -->
          <p class="header__company-description logo__company-description">
            {{ $t('header.title') }}
          </p>
        </div>
      </RouterLink>
      <div class="header__actions">
        <InputSearch class="header__search" />

        <div class="header__language language">
          <div class="language__trigger" @click="toggleDropdown" :class="{ active: isOpen }">
            <span class="language__initials">{{ selectedLang }}</span>
          </div>
          <div v-if="isOpen" class="language__dropdown">
            <a
              v-for="option in options"
              :key="option.lang"
              @click="changeLanguage(option.lang)"
              class="language__option"
            >
              {{ option.lang }} <span>{{ option.label }}</span>
            </a>
          </div>
        </div>

        <div class="header__right">
          <!-- Кнопка входа в аккаунт -->
          <RouterLink to="/auth" class="header__button button" v-if="!authData">{{
            $t('header.button')
          }}</RouterLink>
          <div class="header__profile-block profile-block" v-if="authData">
            <div class="profile-block__head" @click="toggleProfileMenu">
              <img src="/img_profile.svg" alt="Профиль" class="profile-block__avatar" />
              <div class="profile-block__text">
                <span class="profile-block__name">{{
                  `${authData.surname} ${authData.name.charAt(0)}.`
                }}</span>
                <p class="profile-block__post">{{ authData.post }}</p>
              </div>
            </div>
            <div v-if="isProfileMenuOpen" class="profile-block__dropdown">
              <a href="#" class="profile-block__dropdown-item">{{
                $t('header.profile-block__dropdown-item-setting')
              }}</a>
              <a
                href="#"
                class="profile-block__dropdown-item profile-block__dropdown-item--red"
                @click="logout"
                >{{ $t('header.profile-block__dropdown-item-logout') }}</a
              >
            </div>
          </div>
        </div>

        <div class="header__search-block search-block">
          <button class="search-block__button" @click="toggleSearch">
            <IconSearch />
          </button>
          <transition name="top-in">
            <div class="search-block__open" v-show="isSearchOpen">
              <div class="search-block__head">
                <InputSearch @keyup.enter="toggleSearch" />
              </div>
              <transition name="top-in" :duration="1550">
                <div
                  class="search-block__background"
                  @click="toggleSearch"
                  v-show="isSearchOpen"
                ></div>
              </transition>
            </div>
          </transition>
        </div>

        <div class="header__burger-menu burger-menu">
          <button class="burger-menu__kebab" @click="toggleMenu">
            <IconBurgerMenu />
          </button>

          <transition name="slide-in">
            <div class="burger-menu__open" v-show="isMenuOpen">
              <div class="burger-menu__head">
                <button class="burger-menu__button-close" @click="toggleMenu">
                  <IconClose />
                </button>
              </div>
              <div class="burger-menu__content" v-auto-animate>
                <RouterLink
                  to="/auth"
                  class="header__button button"
                  @click="toggleMenu"
                  v-if="!authData"
                >
                  {{ $t('header.button') }}
                </RouterLink>

                <div class="burger-menu__profile-block profile-block" v-if="authData">
                  <div class="burger-menu__profile-head profile-block__head">
                    <img src="/img_profile.svg" alt="Профиль" class="profile-block__avatar" />
                    <div class="profile-block__text">
                      <span class="profile-block__name">{{
                        `${authData.surname} ${authData.name.charAt(0)}.`
                      }}</span>
                      <p class="profile-block__post">{{ authData.post }}</p>
                    </div>
                  </div>
                  <div class="burger-menu__dropdown profile-block__dropdown">
                    <a href="#" class="burger-menu__dropdown-item profile-block__dropdown-item">{{
                      $t('header.profile-block__dropdown-item-setting')
                    }}</a>
                    <a
                      href="#"
                      class="burger-menu__dropdown-item burger-menu__dropdown-item--red profile-block__dropdown-item profile-block__dropdown-item--red"
                      @click="
                        toggleMenu();
                        logout();
                      "
                      >{{ $t('header.profile-block__dropdown-item-logout') }}</a
                    >
                  </div>
                </div>

                <div class="burger-menu__actions">
                  <InputSearch @keyup.enter="toggleMenu" />
                  <div class="burger-menu__language language">
                    <div
                      class="language__trigger"
                      @click="toggleDropdown"
                      :class="{ active: isOpen }"
                    >
                      <div class="language__text">
                        <span class="language__initials">{{ selectedLang }}</span>
                        <p class="language__lang">
                          {{ options.find((option) => option.lang === selectedLang)?.label }}
                        </p>
                      </div>

                      <IconArrow :class="{ 'is-open': isOpen }" />
                    </div>
                    <div v-if="isOpen" class="language__dropdown">
                      <a
                        v-for="option in options"
                        :key="option.lang"
                        @click="changeLanguage(option.lang)"
                        class="language__option"
                      >
                        {{ option.lang }} <span>{{ option.label }}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>
