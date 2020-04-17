<template>
	<view class="mine">
		<view class="banner">
			<view class="userInfo">
				<view v-if="!user.userInfo.userImg" class="avatar_blank"></view>
				<image class="avatar" v-else :src="user.userInfo.userImg" mode="aspectFill"></image>
				<button v-if="!user.userInfo.userName" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfo">点击登录</button>
				<view class="name">{{ user.userInfo.userName }}</view>
			</view>
		</view>
		<view class="outer">
			<view class="content">
				<view class="content_barName">我的关注</view>
				<view class="content_collect">
					<view class="content_collect_li" v-for="(item, index) in collectList" :key="index" @click="jumpFollow(item.pathUrl)">
						<image :src="item.iconUrl" mode="aspectFit"></image>
						<view>{{ item.name }}</view>
					</view>
				</view>
			</view>
			<view class="jump">
				<view class="jump_li" v-for="(item, index) in jumpList" :key="index" @click="jump(item.pathUrl)">
					<image class="jump_li_iconUrl" :src="item.iconUrl" mode="aspectFit"></image>
					<view>{{ item.name }}</view>
					<image class="jump_li_link" src="../../static/right_arrow.png" mode="aspectFit"></image>
				</view>
			</view>
			<login-modal v-if="isShowLoginModal" v-on:cancelEmit="retunEmit"></login-modal>
		</view>
	</view>
</template>

<script>
import loginModal from '../../components/rent_login/rent_login.vue';
import { login } from '../../util/login.js';
import { mapState } from 'vuex';
export default {
	components: {
		loginModal
	},
	data() {
		return {
			isShowLoginModal: false,
			jumpList: [
				{
					iconUrl: '../../static/myItem1.png',
					name: '基本信息',
					pathUrl:'../userInfo/userInfo'
				},
				{
					iconUrl: '../../static/myItem2.png',
					name: '推广收租鸟',
					pathUrl:''
				},
				{
					iconUrl: '../../static/myItem3.png',
					name: '关于我们',
					pathUrl:'../aboutUs/aboutUs'
				}
			],
			collectList: [
				{
					iconUrl: '../../static/collectIcon1.png',
					name: '小区',
					pathUrl:'../collectList/collectList?type=1'
				},
				{
					iconUrl: '../../static/collectIcon2.png',
					name: '房源',
					pathUrl:'../collectList/collectList?type=2'
				},
				{
					iconUrl: '../../static/collectIcon3.png',
					name: '房东',
					pathUrl:'../collectList/collectList?type=3'
				}
			]
		};
	},
	onShow() {},
	computed: {
		...mapState(['user'])
	},
	methods: {
		
		jump(url){
			if(this.user.userInfo.id){
				uni.navigateTo({
					url
				})
			}else{
				this.isShowLoginModal = true
			}
			
		},
		jumpFollow(url){
			if(this.user.userInfo.id){
				uni.navigateTo({
					url
				})
			}else{
				this.isShowLoginModal = true
			}
			
		},
		retunEmit() {
			this.isShowLoginModal = false;
		},
		// show() {
		// 	console.log('nihao',this.user)
		// 	if (this.user.openId == '') {
		// 		this.isShowLoginModal = true;
		// 	}
		// },
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
			});
		}
	}
};
</script>

<style scoped lang="scss">
.banner {
	width: 100%;
	height: 286rpx;
	padding-top: 10rpx;
	background-image: url(../../static/mineBanner.jpg);
	background-size: 100% 100%;
}
.avatar_blank {
	width: 120rpx;
	height: 120rpx;
	background-color: #ffffff;
	border-radius: 50%;
	margin: 0 auto;
}
.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	margin: 0 auto;
	display: block;
}
button {
	width: fit-content;
	height: fit-content;
	background-color: transparent;
	color: #ffffff;
	font-size: 40rpx;
	font-weight: bold;
	margin: 0 auto;
}
.name {
	width: 100%;
	text-align: center;
	color: #ffffff;
	font-size: 40rpx;
	font-weight: bold;
}
.outer {
	width: 100%;
	position: absolute;
	top: 255rpx;
	left: 0;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	background-color: #ffffff;
}
.content {
	width: 100%;
	padding: 60rpx 56rpx 0 56rpx;
	border-bottom: 22rpx solid #f8f8f8;
	&_barName {
		font-size: 34rpx;
		color: #333333;
		font-weight: bold;
		padding-bottom: 55rpx;
	}
	&_collect {
		display: flex;
		justify-content: space-between;
		padding-bottom: 60rpx;
		&_li {
			color: #333333;
			font-size: 26rpx;
			font-weight: bold;
			width: calc(100% / 3);
			text-align: center;
			image {
				width: 58rpx;
				height: 58rpx;
				margin-bottom: 20rpx;
			}
		}
	}
}
.jump {
	width: 100%;
	padding-left: 56rpx;
	&_li {
		height: 122rpx;
		color: #333333;
		font-size: 32rpx;
		font-weight: bold;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: $base-border;
		&_iconUrl {
			width: 40rpx;
			height: 40rpx;
			margin-right: 26rpx;
		}
		&_link {
			width: 12rpx;
			height: 22rpx;
			margin-right: 56rpx;
		}
		view {
			margin-right: auto;
		}
	}
}
</style>
