const getters = {
	openId:state => state.user.openId,
	userInfo: state => state.user.userInfo,
	jumpCommunityName: state => state.global.jumpCommunityName
}
export default getters
