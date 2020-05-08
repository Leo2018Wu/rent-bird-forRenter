<template>
	<view class="myContainer">
		<cover-image class="control1" src="../../static/refresh.png" mode="aspectFit" @click.stop="refresh"></cover-image>
		<cover-image class="control2" src="../../static/position.png" mode="aspectFit" @click.stop="resetLoca"></cover-image>
		<map style="width: 100%; height: 100vh;" :show-location="true" :latitude="map.latitude" :longitude="map.longitude" :scale="map.scale" :markers="map.markers" @callouttap="calloutTap" />
		<view v-if="isAuthorized" class="community" @catchtouchmove="true" :class="{ community_show: showBox }">
			<image class="community_drop_icon" mode="aspectFit" @click="hideList" src="../../static/drop_down.png"></image>
			<view class="community_info">
				<view class="community_info_name">
					<view>{{ roomList[0].communityName }}</view>
					<view class="location">{{ district[curMarkerIndex] }} | 在租{{ roomList.length }}套</view>
				</view>
				<view class="community_info_collect"  @click="follow()">
					<image v-if="communityInfo.attentionStatus == 1" src="../../static/like1.png" mode="aspectFit" :class="{aniLike:communityInfo.attentionStatus == 1}"></image>
					<image v-else src="../../static/like0.png" mode="aspectFit" :class="{aniLike:communityInfo.attentionStatus == 1}"></image>
					<view>关注</view>
				</view>
			</view>
			<scroll-view scroll-y="true" class="content">
				<view class="content_li" v-for="(item, index) in roomList" :key="index">
					<room-sku :item="item" v-on:emitClick="returnEmit"></room-sku>
				</view>
			</scroll-view>
		</view>
		<view v-else class="community" @catchtouchmove="true" :class="{ community_show: showBox }">
			<image class="community_drop_icon" mode="aspectFit" @click="hideList" src="../../static/drop_down.png"></image>
			<view class="community_info">
				<view class="community_info_name">
					<view>{{ roomList[0].communityName }}</view>
					<view class="location">{{ district[curMarkerIndex] }} | 在租{{ roomList.length }}套</view>
				</view>
				<view class="community_info_collect" @click="follow()">
					<image v-if="communityInfo.attentionStatus == 1" src="../../static/like1.png" mode="aspectFit" :class="{aniLike:communityInfo.attentionStatus == 1}"></image>
					<image v-else src="../../static/like0.png" mode="aspectFit" :class="{aniLike:communityInfo.attentionStatus == 1}"></image>
					<view>关注</view>
				</view>
			</view>
			<view class="auth_mask">
				<view class="authBox" v-if="user.userInfo.id">
					<view class="authBox_content">您尚未获得授权，无法查看房源信息</view>
					<view class="authBox_content">请在“我的-基本信息”提交申请</view>
					<view class="authBox_jump" @click="jump">马上去申请</view>
				</view>
				<view class="authBox" v-else>
					<view class="authBox_content">您尚未登录，请登录后查看房源信息</view>
					<button class="loginBtn" hover-class="btnHoverClass" lang="zh_CN" open-type="getUserInfo" @getuserinfo="getUserInfo">授权微信登录</button>
				</view>
			</view>
			
		</view>
		<login-modal v-if="isShowLoginModal" v-on:cancelEmit="retunEmit"></login-modal>
	</view>
</template>

<script>
	import loginModal from '../../components/rent_login/rent_login.vue';
	import roomSku from '../../components/roomSku/roomSku.vue'
	import { login } from '../../util/login.js';
	import { mapState } from 'vuex';
var QQMapWX = require('../../util/qqmap-wx-jssdk');
var qqmapsdk;
export default {
	components: {
		loginModal,
		roomSku
	},
	data() {
		// rentType 0 整租 1合租
		return {
			tempCommunity:{},
			isShowLoginModal:false,
			communityInfo:{},
			isAuthorized:false,
			orientationList: ['东', '南', '西', '北'],
			roomList: [],
			curMarkerIndex: null,
			communityList: [],
			showBox: false,
			map: {
				latitude: 39.909,
				longitude: 116.39742,
				scale:13,
				markers: []
			},
			district: [],
		};
	},
	computed: {
		...mapState(['user','global'])
	},
	onShow() {
		this.showBox = false
		if(this.global.jumpCommunityName.length != 0){
			let par = this.map.markers.filter((item,index) => item.callout.content.split(" ")[0] == this.global.jumpCommunityName);
			console.log(par)
			this.calloutTap({markerId:par[0].id})
		}
	},
	onLoad() {
		// 实例化API核心类
		qqmapsdk = new QQMapWX({
			key: 'CU4BZ-IJPWP-R4ADW-L6WOR-KVTXV-TNFKL'
		});
		this.checkSession();
		this.findCommAll();
		this.getLocation();
	},
	methods: {
		refresh(){
			this.map.markers = []
			this.findCommAll();
		},
		resetLoca(){
			this.map.latitude = "";
			this.map.longitude = "";
			this.getLocation();
		},
		getUserInfo(e) {
			let _this = this;
			if (e.detail.errMsg == 'getUserInfo:fail auth deny') return;
			let par = {
				vm: _this,
				userInfo: e.detail.userInfo
			};
			login().then(() => {
				_this.$store.dispatch('findUserById', par);
				this.retunSucc()
			});
		},
		retunEmit(){
			this.isShowLoginModal = false
		},
		//逃避微信审核
		escapeCheck(){
			let _this = this
			return new Promise((reslove,reject) =>{
				_this.$request.escapeCheck().then((res)=>{
					reslove(res.data.data.value)
				})
			})
		},
		retunSucc(){
			console.log(this.tempCommunity)
			this.getRoomList(this.tempCommunity.communityAddress).then(() => {
				this.escapeCheck().then((res) =>{
					if(this.user.userInfo.authStatus == 1 || res == 1){
						this.isAuthorized = true
					}else{
						this.isAuthorized = false
					}
				})
			});
		},
		getCommunityInfo(communityAddress){
			this.$request.getCommunityInfo({
				communityAddress,
				intermeId:this.user.userInfo.id
			}).then((res) =>{
				this.communityInfo = res.data.data
			})
		},
		follow(communityId){
			if(this.user.userInfo.id){
				let par = {
					intermeId:this.user.userInfo.id,
					attentionStatus:this.communityInfo.attentionStatus == 1 ? 0 : 1,
					communityAddress:this.communityInfo.communityAddress
				}
				this.$request.follow(par).then(res =>{
					if(res.data.code == 200){
						this.communityInfo.attentionStatus = par.attentionStatus
						uni.showToast({
							title: par.attentionStatus ? '关注成功' : '取关成功',
							icon:'none'
						})
					}
				})
			}else{
				this.isShowLoginModal = true
				this.showBox = false
			}
		},
		setMakers(lat, lng, communityName, index, district) {
			let markerTemp = {
				id: 1,
				latitude: 39.909,
				longitude: 116.39742,
				callout: {
					content: '金东名苑@8套',
					color: '#333333',
					bgColor: '#FFFFFF',
					borderRadius: 14,
					fontSize: 15,
					padding: 6,
					textAlign: 'center',
					display: 'ALWAYS'
				},
				iconPath: '../../static/logo.png',
				width: 20,
				height: 20
			};
			markerTemp.id = index + 1;
			markerTemp.callout.content = communityName;
			markerTemp.latitude = lat;
			markerTemp.longitude = lng;
			this.map.markers.push(markerTemp);
			this.district.push(district);
		},
		getGeocode(address, communityName, index) {
			let _this = this;
			return new Promise(reslove => {
				qqmapsdk.geocoder({
					address,
					success(res) {
						_this.setMakers(res.result.location.lat, res.result.location.lng, communityName, index, res.result.address_components.district);
					},
					complete(data) {
						console.log('I see', data);
					}
				});
			});
		},
		findCommAll() {
			let _this = this;
			_this.$request.findCommunityAll().then(res => {
				_this.communityList = res.data.data;
				_this.communityList.forEach(async (item, index) => {
					let name = item.communityName + ' ' + item.letRoom + '套';
					await _this.getGeocode(item.communityAddress, name, index);
				});
			});
		},
		getSetting() {
			uni.getSetting({
				success(res) {}
			});
		},
		checkSession() {
			let _this = this;
			uni.checkSession({
				success(res) {
					if (res.errMsg == 'checkSession:ok')
						uni.getUserInfo({
							lang:'zh_CN',
							success(data) {
								console.log(data);
								let par = {
									vm: _this,
									userInfo: data.userInfo
								};
								login().then(() => {
									_this.$store.dispatch('findUserById', par);
								});
							}
						});
				}
			});
		},
		returnEmit(e){
			uni.navigateTo({
				url: '../roomDetail/roomDetail?roomId=' + e.id+'&houseId='+e.houseId
			});
		},
		showList() {
			this.showBox = true;
		},
		hideList() {
			this.showBox = false;
			this.map.markers[this.curMarkerIndex].callout.bgColor = '#FFFFFF';
			this.map.markers[this.curMarkerIndex].callout.color = '#333333';
		},
		getRoomList(communityAddress) {
			let _this = this;
			return new Promise((reslove, reject) => {
				_this.$request.findRoomList({ communityAddress }).then(res => {
					res.data.data.forEach((item, index) => {
						if (item.roomImgs == '') {
							item.roomImgs = ['../../static/defaultHouse.jpg'];
						} else {
							item.roomImgs = item.roomImgs.split(',');
						}
					});
					_this.roomList = res.data.data;
					reslove(true);
				});
			});
		},
		jump(){
			if(!this.user.userInfo.id){
				this.isShowLoginModal = true
				this.showBox = false
			}else{
				uni.navigateTo({
					url:'../userInfo/userInfo'
				})
			}
		},
		calloutTap(e) {
			if(this.user.userInfo.authStatus == 1){
				this.isAuthorized = true
			}
			const curIndex = this.map.markers.findIndex(ele => ele.id == e.markerId);
			this.curMarkerIndex = curIndex;
			this.map.markers.forEach((item, index) => {
				if (index == curIndex) {
					this.map.markers[index].callout.color = '#FFFFFF';
					this.map.markers[index].callout.bgColor = '#3c76ed';
				} else {
					this.map.markers[index].callout.color = '#333333';
					this.map.markers[index].callout.bgColor = '#FFFFFF';
				}
			});
			let par = this.communityList.filter((item, index) => index == e.markerId - 1);
			//登录时需要的房源信息
			this.tempCommunity = par[0]
			this.getCommunityInfo(par[0].communityAddress)
			this.getRoomList(par[0].communityAddress).then(() => {
				this.showList();
			});
			//平移makers到中心
			this.map.latitude = this.map.markers[curIndex].latitude;
			this.map.longitude = this.map.markers[curIndex].longitude;
		},
		getLocation() {
			let _this = this;
			uni.getLocation({
				type: 'gcj02',
				success(res) {
					qqmapsdk.reverseGeocoder({
						location: {
							latitude: res.latitude,
							longitude: res.longitude
						},
						success(data) {
							let resData = data.result;
							_this.map.latitude = resData.location.lat;
							_this.map.longitude = resData.location.lng;
						}
					});
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.loginBtn{
	width: 190rpx;
	height: 70rpx;
	line-height: 70rpx;
	background:$base-color;
	color: #FFFFFF;
	border-radius: 10rpx;
	font-size: 26rpx;
	font-weight: bold;
	margin: 50rpx auto 0 auto;
}
.community {
	transition: 0.6s;
	width: 100%;
	height: 926rpx;
	background-color: #ffffff;
	padding: 20rpx 0 80rpx 0;
	position: fixed;
	z-index: 99;
	bottom: -926rpx;
	left: 0;
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	&_drop_icon {
		width: 64rpx;
		height: 15rpx;
		margin-left: 343rpx;
	}
	&_info {
		color: #444444;
		width: 100%;
		// height: 113rpx;
		padding: 0 48rpx 35rpx 48rpx;
		border-bottom: $base-border;
		display: flex;
		justify-content: flex-start;
		align-items: baseline;
		&_name {
			font-size: 40rpx;
			margin-right: auto;
			font-weight: bold;
			.location {
				font-size: 28rpx;
				font-weight: normal;
			}
		}
		&_collect {
			font-size: 28rpx;
			text-align: center;
			image {
				width: 36rpx;
				height: 34rpx;
			}
		}
	}
	&_show {
		bottom: 0;
	}
}
.content {
	width: 100%;
	height: calc(100% - 134rpx);
	padding: 40rpx 48rpx 0 48rpx;
	&_li {
		width: 100%;
		height: 180rpx;
		margin-bottom: 40rpx;
		display: flex;
		&_img {
			width: 240rpx;
			height: 100%;
			margin-right: 30rpx;
			border-radius: 5rpx;
		}
		&_intro {
			width: calc(100% - 270rpx);
			height: 100%;
			color: #444444;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			&_name {
				font-size: 30rpx;
				font-weight: bold;
			}
			&_label {
				display: flex;
				font-size: 24rpx;
			}
			&_look {
				font-size: 24rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				image {
					width: 22rpx;
					height: 16rpx;
					margin-right: 8rpx;
				}
				span {
					color: #e7624b;
				}
			}
			&_price {
				font-size: 30rpx;
				color: #e7624b;
				font-weight: bold;
				span {
					font-size: 18rpx;
				}
			}
		}
	}
}
.auth_mask{
	position: absolute;
	width: 100%;
	height: 100%;
	background: url('data:image/jpg;base64,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AAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABIAAAAAQABAEgAAAABAAE4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAFo4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAE4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAI4QklNBAIAAAAAAAYAAAAAAAA4QklNBDAAAAAAAAMBAQEAOEJJTQQtAAAAAAACAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADPwAAAAYAAAAAAAAAAAAAApoAAALuAAAABWcqaAeYmAAtADEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAu4AAAKaAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAKaAAAAAFJnaHRsb25nAAAC7gAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAACmgAAAABSZ2h0bG9uZwAAAu4AAAADdXJsVEVYVAAAAAEAAAAAAABudWxsVEVYVAAAAAEAAAAAAABNc2dlVEVYVAAAAAEAAAAAAAZhbHRUYWdURVhUAAAAAQAAAAAADmNlbGxUZXh0SXNIVE1MYm9vbAEAAAAIY2VsbFRleHRURVhUAAAAAQAAAAAACWhvcnpBbGlnbmVudW0AAAAPRVNsaWNlSG9yekFsaWduAAAAB2RlZmF1bHQAAAAJdmVydEFsaWduZW51bQAAAA9FU2xpY2VWZXJ0QWxpZ24AAAAHZGVmYXVsdAAAAAtiZ0NvbG9yVHlwZWVudW0AAAARRVNsaWNlQkdDb2xvclR5cGUAAAAATm9uZQAAAAl0b3BPdXRzZXRsb25nAAAAAAAAAApsZWZ0T3V0c2V0bG9uZwAAAAAAAAAMYm90dG9tT3V0c2V0bG9uZwAAAAAAAAALcmlnaHRPdXRzZXRsb25nAAAAAAA4QklNBCgAAAAAAAwAAAACP/AAAAAAAAA4QklNBBEAAAAAAAEBADhCSU0EFAAAAAAABAAAAAM4QklNBAwAAAAAClIAAAABAAAAoAAAAI4AAAHgAAEKQAAACjYAGAAB/9j/7QAMQWRvYmVfQ00AAv/uAA5BZG9iZQBkgAAAAAH/2wCEAAwICAgJCAwJCQwRCwoLERUPDAwPFRgTExUTExgRDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBDQsLDQ4NEA4OEBQODg4UFA4ODg4UEQwMDAwMEREMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAI4AoAMBIgACEQEDEQH/3QAEAAr/xAE/AAABBQEBAQEBAQAAAAAAAAADAAECBAUGBwgJCgsBAAEFAQEBAQEBAAAAAAAAAAEAAgMEBQYHCAkKCxAAAQQBAwIEAgUHBggFAwwzAQACEQMEIRIxBUFRYRMicYEyBhSRobFCIyQVUsFiMzRygtFDByWSU/Dh8WNzNRaisoMmRJNUZEXCo3Q2F9JV4mXys4TD03Xj80YnlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vY3R1dnd4eXp7fH1+f3EQACAgECBAQDBAUGBwcGBTUBAAIRAyExEgRBUWFxIhMFMoGRFKGxQiPBUtHwMyRi4XKCkkNTFWNzNPElBhaisoMHJjXC0kSTVKMXZEVVNnRl4vKzhMPTdePzRpSkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2JzdHV2d3h5ent8f/2gAMAwEAAhEDEQA/AGSkeKSq5NOJa+LXlr/IkJKbSSx8rGdjmt1OQ5zXOgtJlTbbcwgbiUOJNOqks/1HkauQXvdr7j96HGrhdbRJYT7Hz9M/ei9Osc7NA3EiDoSkJKp2ElWzrramN9Llx1KqXZuYHMI0aQJgd05DqJKnm5N1VLXM0LoQzlZRdWR9Fw90BJToJKgcrIGSWHRnbTunwsjJfY5t3ABI0SU3klmZGblsaC0/nRwim7LLQAQCQDMfekpvJKo2zIDBvdALSd0cFEw7X2MJcd0HQpKTpJJJKf/QZCsYw2tLgDoUVVck3Cz2Oa0DxSU1OqMa23GLQAN2sJnRuChll9jmF9oPpmQGhQa8WWHdLWgTJTJdVw6NktdzIhDsCg721h28e7hQovY5zi4yAYTTS6mFgRelD9dHwKrXvDZcDp49lY6PYyzLBaQdDwlHcIkHYttrrID+/CQtrcQAJCVz6GR6pAniVF12OxwaeTqI81KsXN9RAJbp+RRGVUXtY1vPBSbdjQQBp4Qm9TEDwI9wEhJSR1tYgkc6SonJqb2h3gky3HtbubqAne+gCXD5wkpVd1drd23SY1Qvt9MH2mGqwyusNG0QOQm9Cn9wapKXrc2ysOA0PYqQAHAhM1oaNrRAHZOkpSSSSSn/0WQHVYtlx3avHIlHWJnV5Jz3mtjogQ4cFIpAt2BTSwaNaAqWbndNpBDy1zv3W6rIzrOr2xWK7NoHbus2zC6iOMd5PwQVTcy+q1PINbNgHBKrNywMZ726mVUd03qjz7qHx4Qp/s/qbKtjcd/nohSbYDqNr/Z961/qu4nMjtBWV+zeoggjHfxrotX6tY+bVnzdQ6tm0+4jRKlW9NdRTbHqiY4UX49DnB50IEDVTur9Vm0HafFQsx9xBBiAAjqgAdSuKKAZEBI4tJfvI1iEMYrx+dKIK7YI3fApWeySB3VXjVVtLWjQ6qRordyFJgLWgEyR3TorfBQECPBJJJJSkkkklKSSSSU//9JlF1tbTDnAHwJUlidTBOY74BCRoWmIsuz61X77fvTevSPz2/eueETzwpsYN+8+4eCZ7ngu4PF3xdWeHg/NL1a/3x96wXWsa4ADbKlWxllrWuJgnVO4kcLuetV++PvTtsY4w1wJ8lUZVjBulZcOxhFx21/SYzb5py1Okq2d6+xoqJ1OsKncM7cxwLogTHikp1UlSznZIoZ6c7jzHKGftjnVOBcRHuHCSnRSWeTljKJO7ZwB8k+E3Kba4XbiCDEpKb6Sy8n7dtGzf9LjyRizJc0Dc6CAZ80lN5JVAy5jBuc4tLTPjKnhF/pnfPOm7lJTYSSSSU//02WR1AA5bvktdYPV7vRy3uHMBMnsuhuqtjS1zHiZMhWAxjjp3VK3Kg1QNrXgGfFGByDksc0Hb5dk0AkLidVZlIrh3moVuh7XeCNnUZlxO0AtHEcqmWXM0exw+SNEIu3apy6RWBugo+O4FkSFzIsLXkAc+K0OkW7svbBGh76JwK2nXuv9It9pM+CZtxcdBA80sjJqo2+p+dwovy6mPDIkkSPmnIX+0GJ26DlQGW42NbtgOTty2GYYmOXULNpZrEykpI6/bEjkwouyXN0LNUqcqu1m4NgA91J97GiS2UlUtTkOsZuIjWIQft74cfT4VtoaQCBE6pbW+ASUtU/1Kw+InspJAAcJJKUkkkkp/9Rly/X7NueR2gSF1C5/rPR8vMy3WVtlpAjVNlsui18bMx7A1lrQC36PgtNjwRLTI8ljs6F1Vp2msEdjKs09N6xQfY3TwJQopsOo1yJM8oNFGWR+lr2O+KP6NwBO2T4J4K0gNPOGKyouewF3aNCq/Rmu+3Bw+iWlLJ6d1PIsBc0BpPjwFqYmEMd7SBwIJQOpBUNA2bBUQDYAQOJUH/Zy4F0T2U7a22s2O4UX47XkGYgQlqoV1WnH148FL0qid20TxKGMRo4cVIUQCNxgpapIj0LNtVTRDWgApGth5ATsbtaG8wnRWqGmiSSSSlJJJJKUkkkkp//VZMXtboTCdAv+mkpL6rPFL1WeKrJQkps+rX4perX4qrpCDR+mLt/APCSm+3IqcSA6YUg9rjAMlVtjQIAgKNbiMtjR9EtJKSm4SBqdEi5o5ICrZ1NtrGiudDqAVUtwcpxY4EmAARKSnUkDU6JSPFU82i+ylja5Lu4GiGcTIc6t2oLRBkpKdCRxOqQIPBBVA42T9pNnLTonw8W+mxxfqHDQpKbxIHJCRIGpIWXk4WU9o2DXdPPZGOHYWgGYgSJ7hJTekRMiEgQeDKqDGcxggF3tIc2e5U8Ot9bCHt2knhJTYSSSSU//1mQLvpo6o9RvdTq0SSkpmDqndppysY9Uuedrg2J7K3VnjcBaYBGiGqW0do7Qo4pbueB4qYe17ZbBTV1Cskgc8og+CilJQ65+2s8NpU5HgiUkF/mkhe6y1hbsbuB5SbZaTJG3yUcnK9Db7C/d4KNmW5ljWBkyJk+aSmQsuLZ2zHI8VAX5BsaC2GnnRO3LsMjZqmOY8WbNnaUlJXWWCIEyTKi+3IbptnzUaMt1rC4siDEKb8hzRo2T4JJrqtTbc5kvEGUH7RmQ72ajjRXWmQD4pJIYUuc6trn6OPKmkkkpSSSSSn//12Wb1Ztpb7GOfOntWknSU8e3EzQXFuK/uRPipNq6m9n6TGcCIIgLrtUtUk24VNeVtE1OaVYac1v5hcPArV1TJKtosstP06nDzVilp3TBCMkkhZxAGolRL2z9Ek/BTSSUw3t/dP3KW1vMCU6SSlAAcBKB4JJJKUkkkkpSSSSSlJJJJKf/2ThCSU0EIQAAAAAAUwAAAAEBAAAADwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAAABIAQQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAIABDAEMAAAABADhCSU0EBgAAAAAABwAGAAAAAQEA/+ENzGh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wNC0yMFQxODo0MToyOCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNC0yMFQxODo0MToyOCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMjBUMTg6NDE6MjgrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDliMmEyMjMtNzUwNS1jOTQwLWEyYjMtMTMwOWVhZmIyOGFlIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NmUyZDE4MmMtYzM4Ni0xNzRmLTk1MjgtMDYzNTEyZTlmNGFmIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTE5ODVjOWUtMzEyZi03ZjRhLTg2YTAtMDYxYTQ3N2UxNzViIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUxOTg1YzllLTMxMmYtN2Y0YS04NmEwLTA2MWE0NzdlMTc1YiIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0yMFQxODo0MToyOCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDliMmEyMjMtNzUwNS1jOTQwLWEyYjMtMTMwOWVhZmIyOGFlIiBzdEV2dDp3aGVuPSIyMDIwLTA0LTIwVDE4OjQxOjI4KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+4ADkFkb2JlAGRAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQoJCg0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgCmgLuAwERAAIRAQMRAf/dAAQAXv/EAaIAAAAHAQEBAQEAAAAAAAAAAAQFAwIGAQAHCAkKCwEAAgIDAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAACAQMDAgQCBgcDBAIGAnMBAgMRBAAFIRIxQVEGE2EicYEUMpGhBxWxQiPB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');
	background-size: 100% 100%;
}
.authBox{
	width: 100%;
	padding-top: 158rpx;
	text-align: center;
	font-size: 32rpx;
	color: #FFFFFF;
	&_content{
		line-height: 36rpx;
		margin-bottom: 10rpx;
	}
	&_jump{
		width: 190rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color:$base-color;
		border-radius: 10rpx;
		font-size: 26rpx;
		font-weight: bold;
		margin: 50rpx auto 0 auto;
	}
}
.control1{
	width: 62rpx;
	height: 62rpx;
	position: fixed;
	z-index: 999;
	top: 52rpx;
	right: 32rpx;
}
.control2{
	width: 62rpx;
	height: 62rpx;
	position: fixed;
	z-index: 999;
	top: 134rpx;
	right: 32rpx;
}
</style>
