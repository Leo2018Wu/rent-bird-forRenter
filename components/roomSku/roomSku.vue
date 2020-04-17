<template>
	<view class="roomSku">
		<view class="content_li" @click="showDetail(item)">
			<image class="content_li_img" :src="item.roomImgs[0]" mode="aspectFill"></image>
			<view class="content_li_intro">
				<view class="content_li_intro_name singleRowText" v-if="item.rentType == 0">
					整租·{{ item.communityName }} {{ item.bedroomNum }}室{{ item.livingroomNum }}厅{{ item.toiletNum }}卫
				</view>
				<view class="content_li_intro_name singleRowText" v-if="item.rentType == 1">合租·{{ item.communityName }} {{ item.bedroomNum }}居室 卧{{ item.roomNo }}</view>
				<view class="content_li_intro_label singleRowText">
					{{ item.area }}m
					<sup>2</sup>
					| {{ item.floor }}/{{ item.totalFloor }}层 | {{ item.bedroomNum }}室{{ item.livingroomNum }}厅{{ item.toiletNum }}卫 | 朝{{ orientationList[item.orientation] }}
				</view>
				<view class="content_li_intro_look">
					<image src="../../static/look0.png" mode="aspectFit"></image>
					<view>
						被同行查看
						<span>{{ item.visitCount }}</span>
						次
					</view>
				</view>
				<view class="content_li_intro_price">
					￥{{ item.roomPrice ? item.roomPrice : 0 }}
					<span>元/月</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		item:{
			type:Object,
			"default":{}
		}
	},
	data() {
		return {
			orientationList: ['东', '南', '西', '北'],
		};
	},
	methods:{
		showDetail(item){
			this.$emit('emitClick',item)
		},
	}
}
</script>

<style scoped lang="scss">
.content_li {
	width: 100%;
	height: 180rpx;
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
</style>
