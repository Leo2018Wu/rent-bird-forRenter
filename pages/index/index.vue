<template>
	<view class="myContainer">
		<!-- <cover-image src="../../static/position.png" mode="aspectFit" @click.stop="getLocation"></cover-image> -->
		<map style="width: 100%; height: 100vh;" :show-location="true" :latitude="map.latitude" :longitude="map.longitude" :scale="map.scale" :markers="map.markers" @callouttap="calloutTap" />
		<view v-if="isAuthorized" class="community" @catchtouchmove="true" :class="{ community_show: showBox }">
			<image class="community_drop_icon" mode="aspectFit" @click="hideList" src="../../static/drop_down.png"></image>
			<view class="community_info">
				<view class="community_info_name">
					<view>{{ roomList[0].communityName }}</view>
					<view class="location">{{ district[curMarkerIndex] }} | 在租{{ roomList.length }}套</view>
				</view>
				<view class="community_info_collect"  @click="follow()">
					<image v-if="communityInfo.attentionStatus == 1" src="../../static/like1.png" mode="aspectFill" :class="{aniLike:communityInfo.attentionStatus == 1}"></image>
					<image v-else src="../../static/like0.png" mode="aspectFill" :class="{aniLike:communityInfo.attentionStatus == 1}"></image>
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
					<image v-if="communityInfo.attentionStatus == 1" src="../../static/like1.png" mode="aspectFill" :class="{aniLike:communityInfo.attentionStatus == 1}"></image>
					<image v-else src="../../static/like0.png" mode="aspectFill" :class="{aniLike:communityInfo.attentionStatus == 1}"></image>
					<view>关注</view>
				</view>
			</view>
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
		...mapState(['user'])
	},
	onShow() {
		this.showBox = false
	},
	onLoad() {
		// 实例化API核心类
		qqmapsdk = new QQMapWX({
			key: 'CU4BZ-IJPWP-R4ADW-L6WOR-KVTXV-TNFKL'
		});
		this.getLocation();
		this.findCommAll();
		this.checkSession();
	},
	methods: {
		getUserInfo(e) {
			console.log(e);
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
			console.log('nihao')
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
							item.roomImgs = ['../../static/house1.jpg'];
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
			console.log(e);
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
	border: 2rpx solid $base-color !important;
	color: $base-color;
	border-radius: 10rpx;
	font-size: 26rpx;
	font-weight: bold;
	margin: 50rpx auto 0 auto;
}
.community {
	transition: 0.6s;
	width: 100%;
	height: 726rpx;
	background-color: #ffffff;
	padding: 20rpx 0 80rpx 0;
	position: fixed;
	z-index: 99;
	bottom: -726rpx;
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
.authBox{
	width: 100%;
	padding-top: 158rpx;
	text-align: center;
	font-size: 32rpx;
	color: #333333;
	&_content{
		line-height: 36rpx;
	}
	&_jump{
		width: 190rpx;
		height: 70rpx;
		line-height: 70rpx;
		border: 2rpx solid $base-color;
		color: $base-color;
		border-radius: 10rpx;
		font-size: 26rpx;
		font-weight: bold;
		margin: 50rpx auto 0 auto;
	}
}
cover-image{
	width: 62rpx;
	height: 62rpx;
	position: fixed;
	z-index: 999;
	top: 52rpx;
	right: 32rpx;
}
</style>
