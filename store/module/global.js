const state = {
	jumpCommunityName:'',//关注房源地址
}
const mutations = {
	SET_NAME:(state,data) =>{
		state.jumpCommunityName = data
	}
}
export default {
  state,
  mutations
}