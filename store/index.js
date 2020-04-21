import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import global from './module/global.js'
import getters from './getter.js'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
	user,
	global
  },
  getters
})

export default store