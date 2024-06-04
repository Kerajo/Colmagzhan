<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
</script>
<template>
  <div class="error">
    <div class="error__text">
      <h3 class="error__title">404</h3>
      <p class="error__description">{{ $t('404.error-description') }}</p>
    </div>
    <div class="error__buttons buttons">
      <RouterLink to="/" class="error__button button">{{ $t('404.button-home') }}</RouterLink>
      <RouterLink
        to="/category/1"
        class="error__button button button--transparent button--grayTransparnt"
        >{{ $t('404.button-categories') }}</RouterLink
      >
    </div>
  </div>
</template>
