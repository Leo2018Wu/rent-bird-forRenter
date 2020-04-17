import vm from '../main.js'
const login = function login(){
	return new Promise((reslove,reject) =>{
		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				vm.$request.login({code:loginRes.code}).then((res)=>{
					vm.$store.commit('SET_OPENID',res.data.data.openid)
					reslove(true)
				})
			}
		});
	})
}
module.exports = {
	login
}
    
