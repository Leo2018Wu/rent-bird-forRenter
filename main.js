import Vue from 'vue'
import App from './App'
import request from './lib/request/index.js'
import store from './store'
import validate from './util/validate.js'
import * as filters from '@/filters/index'

Vue.prototype.$request = request
Vue.prototype.$validate = validate;
Vue.config.productionTip = false

App.mpType = 'app'
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

const app = new Vue({
	 store,
    ...App
})
app.$mount()
export default app
