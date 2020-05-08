import https from './interface'

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * handle [boolean] 如果需要自己处理 catch 请求 ，传入 true ，交给接口统一处理 ，请传如 false或不传
 */

//登录
const login = (data) => {
    return https({
        url: '/wx/login',
        data,
		// handle:true
    })
}
//查询用户信息
const findUserById = (data) =>{
	return https({
	    url: '/interme/findByIntermeOid',
	    data,
		// handle:true
	})
}
//获取招租房源列表
const findCommunityAll = (data) =>{
	return https({
	    url: '/community/findAll',
	    data,
		// handle:true
	})
}
//房源下的房间列表
// 请求参数：communityAddress // 小区地址 
// 		或者 landlordId // 二房东id
const findRoomList = (data) =>{
	return https({
	    url: '/room/findList',
	    data,
		// handle:true
	})
}
//房间详情

const getRoomInfo = (data) =>{
	return https({
	    url: '/room/find',
	    data,
		// handle:true
	})
}
//统计房间详情进入情况
const vistiRoom = (data) =>{
	return https({
	    url: '/room/insertVisit',
	    data,
		// handle:true
	})
}

//申请授权
const applyAuth = (data) =>{
	return https({
	    url: '/interme/updateByIntermeOid',
	    data,
		// handle:true
	})
}

//关注
// 请求参数：intermeId和attentionStatus必填，另外3个字段取其一
// {
// 	"intermeId": "", // 中介id
// 	"attentionStatus": "1", // 关注状态 1-关注 0-未关注
// 	"roomId": "", // 房间id
// 	"communityAddress": "", // 房源地址
// 	"landlordId": "" // 二房东id
// }

const follow = (data) =>{
	return https({
	    url: '/interme/updAttStatus',
	    data,
		// handle:true
	})
}

//查询房源详情
const getCommunityInfo = (data) =>{
	return https({
	    url: '/community/find',
	    data,
		// handle:true
	})
}

//关注列表 关注类型 intermeId attentionType 1-房源 2-房间 3-二房东
const getFollowList = (data) =>{
	return https({
	    url: '/interme/findAttList',
	    data,
		// handle:true
	})
}
//逃离微信审核
const escapeCheck = (data) =>{
	return https({
	    url: '/dict/isAuth',
	    data,
		// handle:true
	})
}

//电话反馈
const feedBack = (data) =>{
	return https({
	    url: '/room/updateFeedback',
	    data,
		// handle:true
	})
}


// 默认全部导出
export default {
    login,
	findUserById,
	findCommunityAll,
	findRoomList,
	getRoomInfo,
	vistiRoom,
	applyAuth,
	follow,
	getCommunityInfo,
	getFollowList,
	escapeCheck,
	feedBack
}