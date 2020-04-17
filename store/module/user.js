
const state = {
	openId:'',
	userInfo:{},
}
const mutations = {
	SET_USERINFO:(state,userInfo) =>{
		state.userInfo = userInfo
	},
	SET_OPENID:(state,id) =>{
		state.openId = id
	}
}
const actions = {
	findUserById({commit},data){
		const vm = data.vm
		const { nickName, avatarUrl, city, gender, country, province} = data.userInfo
		let para =  { 
			intermeOpenId: state.openId,
			unionId: '',
			userName:nickName,
			userSex:gender,
			userImg:avatarUrl,
			province,
			city,
			country
		} 
		return new Promise((reslove,reject) => {
			vm.$request.findUserById(para).then(response =>{
				commit('SET_USERINFO',response.data.data)
				console.log(response)
			})
		})
	}
}
export default {
  state,
  mutations,
  actions
}