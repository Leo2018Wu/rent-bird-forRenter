import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import getters from './getter.js'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
	user
  },
  getters
})

export default store