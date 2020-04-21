<template>
	<view class="spread">
		<image src="../../static/shareBanner.png" mode="aspectFill"></image>
		<view class="content">
			<view class="content_title">活动规则</view>
			<view class="content_name">活动说明</view>
			<view class="content_des">收租鸟是一款房屋收租小程序，房东可以利用收租鸟高效收租，并对闲置房源发布招租，招租信息将出现在收租鸟房源直租小程序。</view>
			<view class="content_name">活动奖励</view>
			<view class="content_des">将收租鸟小程序推荐给房东，待其跟收租鸟签约，你将获得20%签约金额的返佣奖励。</view>
			<view class="content_des">(定价5元/套/月，详情见收租鸟购买页）</view>
			<view class="content_name">活动时间</view>
			<view class="content_des">截止日期：2020年12月31日</view>
			<view class="content_btn_box">
				<view class="download btn" @click="saveImg">下载介绍图</view>
				<view class="jumpMini btn" @click="jumpMini">体验收租鸟</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods:{
		saveImg(){
			uni.showLoading({
				title:'正在下载中...'
			})
			uni.downloadFile({
			    url: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/introduce.jpg', //仅为示例，并非真实的资源
			    success: (resData) => {
			        if (resData.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: resData.tempFilePath,
							success: function() {
								uni.showToast({
									title: '分享图已保存，快去分享吧！',
									icon: 'none',
									duration: 2000
								})
							},
							fail(err) {
							
							},
							complete(data) {
								console.log(data)
								uni.hideLoading()
								if (data.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
									uni.showModal({
										title: '获取权限',
										content: '获取您拒绝过的相册权限',
										success: function(res) {
											if (res.confirm) {
												uni.openSetting({
													success(settingdata) {
														console.log(settingdata)
														if (settingdata.authSetting["scope.writePhotosAlbum"]) {
															console.log("获取权限成功，再次点击图片保存到相册")
														} else {
															console.log("获取权限失败")
														}
													},
													fail(errMsg) {
														console.log(errMsg)
													}
												})
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
														
								}
							}
						});
			        }
			    }
			});
			
		},
		jumpMini(){
			uni.navigateToMiniProgram({
			  appId: 'wx2d48bdae69b0cd75',
			  envVersion:'release',
			  success(res) {
			    // 打开成功
			  },
			  complete(data){
				  console.log(data)
			  }
			})
		}
	}
};
</script>

<style scoped lang="scss">
.spread {
	width: 100%;
	min-height: 100vh;
	height: 100%;
	background-color: #fafafa;
}
image {
	width: 100%;
	height: 370rpx;
}
.content {
	width: 694rpx;
	min-height: calc(100vh - 316rpx);
	background-color: #ffffff;
	border-radius: 20rpx;
	position: absolute;
	top: 286rpx;
	left: 30rpx;
	padding: 32rpx 50rpx 57rpx 50rpx;
	&_title {
		font-size: 34rpx;
		color: #333333;
		font-weight: bold;
		position: relative;
		&::after {
			content: '';
			width: 8rpx;
			height: 32rpx;
			position: absolute;
			top: 50%;
			transform: translateY(-40%);
			left: -22rpx;
			background-color: $base-color;
		}
	}
	&_name {
		color: #333333;
		font-size: 34rpx;
		margin: 54rpx 0 20rpx 0;
	}
	&_des {
		color: #999999;
		font-size: 30rpx;
		line-height: 42rpx;
		word-break:break-all;
	}
	&_btn_box{
		width: 100%;
		height: 80rpx;
		margin-top: 100rpx;
		display: flex;
		justify-content: space-between;
	}
}
.btn{
	width: 278rpx;
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	font-size: 30rpx;
	font-weight: bold;
	border-radius: 40rpx;
}
.download{
	border: 2rpx solid $base-color;
	color: $base-color;
}
.jumpMini{
	background-color: $base-color;
	color: #FFFFFF;
}
</style>
