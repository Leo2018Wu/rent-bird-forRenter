<template>
	<view class="aboutUs">
		<view class="logo">
			<image  src="../../static/bigLogo.png" mode="aspectFit"></image>
			<view class="logo_des">收租鸟房源直推，甄选、真实、高效</view>
		</view>
		<view class="jump" v-for="(item,index) in jumpList" :key="index" @click="jump(item.pathUrl)">
			<view class="jump_name">{{item.name}}</view>
			<image src="../../static/right_arrow.png" mode="aspectFit"></image>
		</view>
		<view class="copyRight">©2020 Raysler Info All Rights Reserved</view>
		<!-- 弹窗 -->
		<view class="modal_mask" v-show="flag" @click="closeModal"></view>
		<view class="modal" v-show="flag">
			<view class="modal_title">通过微信联系我们</view>
			<view class="modal_name">{{wechat}}</view>
			<view class="modal_btn" @click="copy">复制微信号</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag:false,
				wechat: 'jayne_zou',
				jumpList:[
					{name:'联系我们',pathUrl:''},
					{name:'使用协议及隐私政策',pathUrl:'/pages/privacy/privacy'}
				]
			}
		},
		methods: {
			closeModal(){
				this.flag = false
			},
			copy() {
				var that = this;
				uni.setClipboardData({
					//准备复制的数据
					data: that.wechat,
					success: function(res) {
						wx.showToast({
							title: '复制成功',
						});
					}
				});
			},
			jump(url){
				if(url){
					uni.navigateTo({
						url
					})
				}else{
					this.flag = true
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.logo{
		width: 100%;
		padding: 142rpx 0 178rpx 0;
		text-align: center;
		border-bottom: 1rpx solid #f6f6f6;
		image{
			width: 220rpx;
			height: 220rpx;	
		}
		&_des{
			color: #666666;
			font-size: 30rpx;
		}
	}
	.jump{
		width: 100%;
		height: 100rpx;
		padding: 0 44rpx 0 52rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 1rpx solid #f6f6f6;
		&_name{
			color: #666666;
			font-size: 28rpx;
			margin-right: auto;
		}
		image{
			width: 14rpx;
			height: 24rpx;
		}
	}
	.copyRight{
		width: 100%;
		text-align: center;
		color: #AEAEAE;
		font-size: 22rpx;
		position: fixed;
		bottom: 60rpx;
		left: 0;
	}
	/* 弹窗 */
	.modal_mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		background: #000;
		opacity: 0.5;
		overflow: hidden;
		z-index: 500;
	}
	
	.modal {
		width: 672rpx;
		height: 334rpx;
		border-radius: 20rpx;
		overflow: hidden;
		position: fixed;
		top: 31%;
		left: 6%;
		z-index: 1001;
		background: rgba(255, 255, 255, 1);
		text-align: center;
		&_title{
			height: 30%;
			padding-top: 40rpx;
			font-size: 36rpx;
			color: rgba(51, 51, 51, 1);
			line-height: 36px;
		}
		&_name{
			height: 30%;
			font-size: 34rpx;
			color: rgba(107, 107, 107, 1);
			line-height: 36px;
			margin-top: 30rpx;
		}
		&_btn{
			width: 100%;
			height: 36%;
			border-top: 2rpx solid rgba(238, 238, 238, 1);
			display: flex;
			justify-content: space-around;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFA044;
			position: relative;
			line-height: 90rpx;
		}
	}
	
</style>
