<template>
	<view class="roomList">
		<view class="info">
			<view class="info_inner">
				<image v-if="landlordInfo.userImg" class="info_inner_avatar" :src="landlordInfo.userImg" mode="aspectFit"></image>
				<view v-else class="info_inner_avatar"></view>
				<view class="info_inner_content">
					<view>{{landlordInfo.realName}}{{landlordInfo.userSex == 1 ? '女士' : '先生' }}</view>
					<view class="info_inner_content_des">
						在租
						<span>{{landlordInfo.letRoom}}</span>
						套
					</view>
				</view>
				<view class="info_inner_link" style="margin-right: 70rpx;" @click="call">
					<image class="info_inner_link_icon" src="../../static/tel_icon.png" mode="aspectFit"></image>
					<view>电话</view>
				</view>
				<view class="info_inner_link" @click="follow">
					<image v-if="attentionStatus == 1" class="info_inner_link_icon" src="../../static/like1.png" mode="aspectFit"></image>
					<image v-else class="info_inner_link_icon" src="../../static/like0.png" mode="aspectFit"></image>
					<view>关注</view>
				</view>
			</view>
		</view>
		<view class="collect_room" v-for="(item, index) in roomList" :key="index">
			<view class="collect_room_li"><room-sku :item="item" v-on:emitClick="returnEmit"></room-sku></view>
		</view>
	</view>
</template>

<script>
import roomSku from '../../components/roomSku/roomSku.vue';
export default {
	components: {
		roomSku
	},
	data() {
		return {
			attentionStatus:1,
			landlordInfo:{},
			roomList: []
		};
	},
	onLoad(options) {
		this.landlordInfo = JSON.parse(options.landlordInfo)
		console.log(this.landlordInfo)
		this.getRoomList(this.landlordInfo.id);
	},
	methods: {
		follow(){
			let _this = this
			_this.$request.follow({
				intermeId:_this.$store.state.user.userInfo.id,
				attentionStatus:_this.attentionStatus ? 0 : 1,
				landlordId:_this.landlordInfo.id
			}).then(res =>{
				_this.attentionStatus = _this.attentionStatus ? 0 : 1
				uni.showToast({
					title: _this.attentionStatus ? '关注成功' : '取关成功',
					icon:'none'
				})
			})
		},
		call(){
			console.log('called')
			let _this = this
			uni.makePhoneCall({
			  phoneNumber: _this.landlordInfo.phoneNumber
			})
		},
		returnEmit(e) {
			uni.navigateTo({
				url: '../roomDetail/roomDetail?roomId=' + e.id + '&houseId=' + e.houseId
			});
		},
		getRoomList(landlordId) {
			this.$request
				.findRoomList({
					landlordId
				})
				.then(res => {
					res.data.data.forEach((item, index) => {
						if (item.roomImgs == '') {
							item.roomImgs = ['../../static/defaultHouse.jpg'];
						} else {
							item.roomImgs = item.roomImgs.split(',');
						}
					});
					this.roomList = res.data.data;
				});
		}
	}
};
</script>

<style scoped lang="scss">
.info {
	width: 100%;
	height: 172rpx;
	padding-left: 48rpx;
	padding-left: 48rpx;
	&_inner {
		width: 100%;
		height: 100%;
		padding: 40rpx 48rpx 40rpx 0;
		border-bottom: $base-border;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		&_avatar {
			width: 86rpx;
			height: 86rpx;
			margin-right: 20rpx;
			background-color: #bfbfbf;
			border-radius: 50%;
		}
		&_content {
			height: 100%;
			margin-right: auto;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			color: #333333;
			font-size: 33rpx;
			font-weight: bold;
			span {
				color: $base-color;
				font-size: 34rpx;
				font-weight: bold;
				margin: 0 6rpx;
			}
			&_des {
				display: flex;
				align-items: center;
				font-size: 30rpx;
				color: #999999;
				font-weight: bold;
			}
		}
		&_link {
			height: 100%;
			color: #999999;
			font-size: 28rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			&_icon {
				width: 36rpx;
				height: 36rpx;
			}
		}
	}
}
.collect_room {
	width: 100%;
	padding-left: 45rpx;
	&_li {
		padding: 45rpx 48rpx 45rpx 0;
		border-bottom: $base-border;
	}
}
</style>
