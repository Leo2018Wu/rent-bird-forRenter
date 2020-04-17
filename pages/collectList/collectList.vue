<template>
	<view class="collectList" v-if="init">
		<view v-if="followType == 1" class="collect_item" v-for="(item,index) in collectList" :key="index" @click="toHome">
			<view class="collect_item_inner">
				<view class="collect_item_inner_left">
					<view>{{item.communityName}}</view>
					<view class="location"><image src="../../static/community_loca.png" mode="aspectFit"></image><view class="singleRowText" style="max-width: 440rpx;">{{item.communityAddress}}</view></view>
				</view>
				<view class="collect_item_inner_right">在租 <span>{{item.letRoom}}</span>套</view>
			</view>
		</view>
		<view v-if="followType == 2">
			<view class="collect_room" v-for="(item,index) in collectList" :key="index">
				<view class="collect_room_li">
					<room-sku :item="item" v-on:emitClick="returnEmit"></room-sku>
				</view>
			</view>
		</view>
		<view v-if="followType == 3" class="collect_item" v-for="(item,index) in collectList" :key="index" @click="showMore(item)">
			<view class="collect_item_inner">
				<image v-if="item.userImg" class="collect_item_inner_avatar" :src="item.userImg" mode="aspectFit"></image>
				<view v-else class="collect_item_inner_avatar"></view>
				<view class="collect_item_inner_left">
					<view>{{item.realName}}{{item.userSex == 1 ? '女士' : '先生' }}</view>
					<view class="tel">{{item.phoneNumber | hidePhone}}</view>
				</view>
				<view class="collect_item_inner_right">在租 <span>{{item.letRoom}}</span>套</view>
			</view>
		</view>
		<view class="empty" v-if="collectList.length == 0">
			<image src="../../static/noFollow.png" mode="aspectFit"></image>
			<view>暂无关注</view>
		</view>
	</view>
</template>

<script>
	import roomSku from '../../components/roomSku/roomSku.vue'
	export default {
		components:{
			roomSku
		},
		data() {
			return {
				init:false,
				followType:null,
				collectList:[]
			}
		},
		onLoad(options){
			uni.setNavigationBarTitle({
				title: options.type == 2 ? '房源' :(options.type == 3 ? '房东' : '小区' )
			})
			this.followType = options.type 
		},
		onShow() {
			this.getFollowList(this.followType)
		},
		methods: {
			toHome(){
				uni.switchTab({
					url:'../index/index'
				})
			},
			showMore(item){
				let par = JSON.stringify(item)
				uni.navigateTo({
					url:'../landlordRoomList/landlordRoomList?landlordInfo='+par
				})
			},
			returnEmit(e){
				uni.navigateTo({
					url: '../roomDetail/roomDetail?roomId=' + e.id+'&houseId='+e.houseId
				});
			},
			getFollowList(attentionType){
				this.$request.getFollowList({
					attentionType,
					intermeId:this.$store.state.user.userInfo.id
				}).then((res) =>{
					this.init = true
					if(this.followType == 3){
						res.data.data.map(item=>item.realName = item.realName.substr(0,1))
					}
					if(this.followType == 2){
						res.data.data.forEach((item, index) => {
							if (item.roomImgs == '') {
								item.roomImgs = ['../../static/house1.jpg'];
							} else {
								item.roomImgs = item.roomImgs.split(',');
							}
						});
					}
					this.collectList = res.data.data
				})
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.collect_room{
		width: 100%;
		padding-left: 45rpx;
		&_li{
			padding: 45rpx 48rpx 45rpx 0;
			border-bottom: $base-border;
		}
	}
	.collect_item{
		width: 100%;
		height: 172rpx;
		padding-left:48rpx;
		&_inner{
			width: 100%;
			height: 100%;
			padding: 40rpx 48rpx 40rpx 0;
			border-bottom: $base-border;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			&_avatar{
				width: 86rpx;
				height: 86rpx;
				margin-right: 20rpx;
				background-color: #BFBFBF;
				border-radius: 50%;
			}
			&_left{
				height: 100%;
				margin-right: auto;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				color: #333333;
				font-size: 33rpx;
				font-weight: bold;
				.location{
					display: flex;
					align-items: center;
					font-size: 28rpx;
					color: #999999;
					font-weight: normal;
				}
				.tel{
					font-size: 30rpx;
					font-weight: normal;
				}
				image{
					width: 18rpx;
					height: 33rpx;
					margin-right: 8rpx;
				}
			}
			&_right{
				color: #999999;
				font-size: 30rpx;
				span{
					color: $base-color;
					font-size: 34rpx;
					font-weight: bold;
					margin: 0 6rpx;
				}
			}
		}
	}
	.empty{
		margin-top: 282rpx;
		width: 100%;
		text-align: center;
		color: #B5B5B5;
		font-size: 30rpx;
		image{
			width: 317rpx;
			height: 229rpx;
			margin-bottom: 49rpx;
		}
	}
</style>
