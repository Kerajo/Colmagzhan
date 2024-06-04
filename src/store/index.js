import { createStore } from 'vuex'

const store = createStore({
  state: {
    authData: JSON.parse(localStorage.getItem('authData')) || null,
    selectedLang: localStorage.getItem('selectedLang') || 'RU' // Добавляем выбранный язык
  },
  mutations: {
    setAuthData(state, authData) {
      state.authData = authData
      localStorage.setItem('authData', JSON.stringify(authData))
    },
    setLanguage(state, lang) {
      state.selectedLang = lang
      localStorage.setItem('selectedLang', lang)
    },
    clearAuthData(state) {
      state.authData = null
      localStorage.removeItem('authData')
    }
  },
  actions: {
    updateAuthData({ commit }, authData) {
      commit('setAuthData', authData)
    },
    updateLanguage({ commit }, lang) {
      commit('setLanguage', lang)
    },
    logout({ commit }) {
      commit('clearAuthData')
    }
  },
  getters: {
    authData: (state) => state.authData,
    selectedLang: (state) => state.selectedLang // Геттер для выбранного языка
  }
})

export default store
