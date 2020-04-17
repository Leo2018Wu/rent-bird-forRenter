<template>
	<view class="rentLogin">
		<view class="mask" @catchtouchmove="true" @click="closeModal"></view>
		<view class="login_modal">
			<image src="../../static/login_close.png" mode="aspectFit" @click="closeModal"></image>
			<view class="login_modal_content">授权登录体验完整功能</view>
			<button class="login_modal_btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfo" withCredentials="true">授权微信登录</button>
		</view>
	</view>
</template>

<script>
	import { login } from '../../util/login.js';
	export default {
		data() {
			return {
			};
		},
		methods:{
			closeModal(){
				this.$emit('cancelEmit')
			},
			getUserInfo(e) {
				let _this = this
				if(e.detail.errMsg == 'getUserInfo:fail auth deny')return
				let par = {
					vm:_this,
					userInfo:e.detail.userInfo
				}
				login().then(()=>{
					_this.$emit('cancelEmit')
					_this.$store.dispatch('findUserById',par)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(#000000,0.4);
	}
	.login_modal{
		width: 620rpx;
		height: 693rpx;
		border-radius: 18rpx;
		text-align: center;
		background-image: url(../../static/loginBg.png);
		background-size: 100% 100%;
		position: fixed;
		left: 65rpx;
		top: 20%;
		image{
			width: 52rpx;
			height: 52rpx;
			position: absolute;
			top: 26rpx;
			right: 26rpx;
		}
		&_content{
			margin-top: 436rpx;
			color: #333333;
			font-size: 36rpx;
		}
		button{
			width: 554rpx;
			height: 92rpx;
			background-color: $base-color;
			margin: 72rpx auto 0 auto;
			line-height: 92rpx;
			color: #FFFFFF;
			border-radius: 47rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
</style>
