<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>
<template>
  <div class="files blocking">
    <div class="files__main blocking__main">
      <div class="files__head">
        <div class="files__text">
          <h4 class="files__title">{{ $t('block.block-title') }}</h4>
          <p class="files__subtitle blocking__subtitle">
            {{ $t('block.block-subtitle') }}
          </p>
        </div>
      </div>
      <div class="files__content">
        <div class="files__buttons buttons">
          <RouterLink to="/auth" class="files__button button">{{
            $t('block.button-auth')
          }}</RouterLink>
          <RouterLink to="/" class="files__button files__button--gray button button--transparent">{{
            $t('block.button-home')
          }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
