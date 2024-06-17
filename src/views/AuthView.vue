<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const store = useStore();

const { t } = useI18n({ useScope: 'global' });

// Определяем переменную errorMessage на уровне компонента
const errorMessage = ref('');

const authorization = reactive({
  login: '',
  password: ''
});

const submit = async () => {
  console.log('authorization');

  try {
    const response = await axios.post('http://api.kerajo.online/login', authorization, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Успешный ответ:', response.data);
    store.dispatch('updateAuthData', response.data);
    errorMessage.value = '';
    router.push('/');
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error.message);
    // Обновляем значение переменной errorMessage
    errorMessage.value = error.message;
  } finally {
    console.log('Запрос завершен');
  }
};

onMounted(() => {
  if (store.getters.authData) {
    // Предполагаем, что у тебя есть такой геттер
    router.push('/'); // Перенаправляем на главную страницу
  }
});
</script>
<template>
  <div class="main-auth">
    <div class="auth-block">
      <div class="auth-block__text">
        <h3 class="auth-block__title">{{ $t('auth.auth-title') }}</h3>
        <p class="auth-block__description">
          {{ $t('auth.auth-description') }}
        </p>
      </div>
      <form action="" @submit.prevent.stop="submit">
        <div class="auth-block__inputs inputs">
          <input
            type="text"
            name="login"
            :placeholder="$t('auth.input-login')"
            autocomplete="username"
            v-model="authorization.login"
          />
          <input
            type="password"
            name="password"
            :placeholder="$t('auth.input-password')"
            autocomplete="current-password"
            v-model="authorization.password"
          />
        </div>

        <button class="auth-block__button button">{{ $t('auth.auth-button') }}</button>
      </form>
      <div class="auth-block__down" v-auto-animate>
        <p class="auth-block__error-message" v-if="errorMessage">
          {{ $t('auth.error-message') }}
        </p>
        <p class="auth-block__forgot-password">
          {{ $t('auth.forgot-password') }}
        </p>
        <!-- Используем переменную errorMessage в шаблоне -->
      </div>
    </div>
  </div>
</template>
