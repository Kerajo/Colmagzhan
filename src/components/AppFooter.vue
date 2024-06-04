<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

import IconMail28 from './icons/IconMail28.vue';
import IconCall28 from './icons/IconCall28.vue';
import IconLocation28 from './icons/IconLocation28.vue';
import IconSocialFacebook from './icons/IconSocialFacebook.vue';
import IconSocialInstagram from './icons/IconSocialInstagram.vue';
import IconSocialVk from './icons/IconSocialVk.vue';
import IconSocialYoutube from './icons/IconSocialYoutube.vue';

const { t, locale } = useI18n({ useScope: 'global' });
</script>
<template>
  <footer class="footer">
    <div class="wrapper">
      <div class="footer__left">
        <div class="footer__information">
          <RouterLink to="/" class="footer__logo logo">
            <!-- Логотип Colmagzhan -->
            <img class="logo__img" src="/logo-80px.png" alt="Логотип colmagzhan" />
            <div class="logo__info">
              <!-- Название компании -->
              <span class="logo__company-name">Colmagzhan</span>
              <!-- Описание компании -->
              <p class="footer__logo-description logo__company-description">
                {{ $t('footer.footer__logo-description') }}
              </p>
            </div>
          </RouterLink>
          <a href="https://colmagzhan.kz/" class="footer__college-button button">{{
            $t('footer.footer__college-button')
          }}</a>
        </div>
        <div class="footer__social">
          <h4 class="footer__title">{{ $t('footer.footer__title-social') }}</h4>
          <div class="footer__buttons">
            <a
              href="https://www.instagram.com/collegemzhumabaeva/"
              class="footer__button button button--social"
            >
              <IconSocialInstagram />
            </a>
            <a
              href="https://www.youtube.com/@user-vh4qf7tp2x/videos"
              class="footer__button button button--social"
            >
              <IconSocialYoutube />
            </a>
            <a href="https://vk.com/petrogumcollege" class="footer__button button button--social">
              <IconSocialVk />
            </a>
            <a
              href="https://www.facebook.com/petrogumcollege"
              class="footer__button button button--social"
            >
              <IconSocialFacebook />
            </a>
          </div>
        </div>
      </div>
      <div class="footer__center">
        <h4 class="footer__title">{{ $t('footer.footer__title-info') }}</h4>
        <div class="footer__links links">
          <a href="#" class="footer__link link">{{ $t('footer.footer__link-account') }}</a>
          <a
            href="https://colmagzhan.kz/content/attestaciya-2023/lang-ru"
            class="footer__link link"
            >{{ $t('footer.footer__link-certification') }}</a
          >
          <a
            href="https://colmagzhan.kz/content/1416-31-08-23-17-00-37-2023-2024-uchebnyy-god/lang-ru"
            class="footer__link link"
            >{{ $t('footer.footer__link-timing') }}</a
          >
          <a href="https://colmagzhan.kz/content/novosti/lang-ru" class="footer__link link">{{
            $t('footer.footer__link-news')
          }}</a>
          <a href="https://colmagzhan.kz/content/o-kolledghe/lang-ru" class="footer__link link">{{
            $t('footer.footer__link-about')
          }}</a>
          <a href="https://colmagzhan.kz/" class="footer__link link">{{
            $t('footer.footer__link-college')
          }}</a>
          <a
            href="https://colmagzhan.kz/content/prepodavatelyu-i-sotrudniku/lang-ru"
            class="footer__link link"
            >{{ $t('footer.footer__link-worker') }}</a
          >
        </div>
      </div>
      <div class="footer__right">
        <h4 class="footer__title">{{ $t('footer.footer_title-contact') }}</h4>
        <div class="footer__contacts contacts">
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
              {{ $t('footer.college-info__contact-text-address') }}
            </p>
          </div>
          <div class="college-info__contact contact">
            <div class="college-info__contact-icon contact__icon">
              <IconMail28 />
            </div>
            <p class="college-info__contact-text contact__text">Colmagzhan@mail.ru</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
