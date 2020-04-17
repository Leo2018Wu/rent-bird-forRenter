<template>
	<view class="roomDetail" v-if="init">
		<view class="swiper">
			<swiper :indicator-dots="false" autoplay="true" interval="5000" duration="1000" @change="swiperChange">
				<block v-for="(item, index) in roomInfo.roomImgs" :key="index">
					<swiper-item >
						<image :src="item" class="swiper_image" mode="aspectFill"/>
					</swiper-item>
				</block>
			</swiper>
			<view v-if="roomInfo.roomImgs.length !=0" class="swiper_dots">
				{{swiperCurrent}}/{{roomInfo.roomImgs.length}}
			</view>
		</view>
		<view class="content">
			<view class="content_price">{{roomInfo.roomPrice ? roomInfo.roomPrice : 0}}<span>元/月(付{{roomInfo.rentNum ? roomInfo.rentNum : 1}}押{{roomInfo.depositNum}})</span></view>
			<view class="content_name" v-if="roomInfo.rentType == 0">整租·{{roomInfo.communityName}} {{roomInfo.bedroomNum}}室{{roomInfo.livingroomNum}}厅{{roomInfo.toiletNum}}卫</view>
			<view class="content_name" v-else>合租·{{roomInfo.communityName}} {{roomInfo.bedroomNum}}室{{roomInfo.livingroomNum}}厅{{roomInfo.toiletNum}}卫 卧{{roomInfo.roomNo}}</view>
			<view class="content_intro">
				<view class="content_intro_li">
					<view>{{orientationList[roomInfo.orientation]}}</view>
					<view class="content_intro_li_name">朝向</view>
				</view>
				<view class="content_intro_li">
					<view style="display: flex;justify-content: center;">{{roomInfo.area}}m<sup>2</sup> </view>
					<view class="content_intro_li_name">面积</view>
				</view>
				<view class="content_intro_li">
					<view>{{roomInfo.floor}}/{{roomInfo.totalFloor}}层</view>
					<view class="content_intro_li_name">楼层</view>
				</view>
				<view class="content_intro_li">
					<view>{{roomInfo.checkInTime}}</view>
					<view class="content_intro_li_name">入住</view>
				</view>
			</view>
			<view class="content_facility">
				<view class="content_facility_li" v-for="(item,index) in roomInfo.label" :key="index">{{item.name}}</view>
			</view>
			<view class="content_other">
				<view class="content_other_item"><span>租期：</span>{{roomInfo.tenancyTerm}}</view>
				<view class="content_other_item"><span>看房：</span>{{seeApaList[roomInfo.seeTheApartment]}}</view>
			</view>
		</view>
		<view class="introduce" :class="{addPadding:roomInfo.tenants.length == 0}">
			<view class="introduce_name">房源简介</view>
			<view class="introduce_facility">
				<view class="introduce_facility_li" :class="{grayFilter:item.isChecked == 0}" v-for="(item,index) in roomInfo.roomConfigure" :key="index">
					<image class="introduce_facility_li_img" :src="'../../static/facIcon'+index+'.png'" mode="aspectFit"></image>
					<view>{{item.name}}</view>
				</view>
			</view>
			<view class="introduce_desc">{{roomInfo.remarks}}</view>
		</view>
		<view class="roommate" v-if="roomInfo.tenants.length != 0">
			<view class="roommate_name">合租室友</view>
			<view class="roommate_li" v-for="(item,index) in roomInfo.tenants" :key="index">
				<view class="roommate_li_inner" v-if="item.tenantSex == 1">
					<image class="sexImg" src="../../static/female.png" mode="aspectFit"></image>
					<view class="roomNo">卧{{item.roomNo}}</view>
					<view class="sex">女</view>
					<image class="sexIcon" src="../../static/female_icon.png" mode="aspectFit"></image>
				</view>
				<view class="roommate_li_inner" v-else>
					<image class="sexImg" src="../../static/male.png" mode="aspectFit"></image>
					<view class="roomNo">卧{{item.roomNo}}</view>
					<view class="sex">男</view>
					<image class="sexIcon" src="../../static/male_icon.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<view class="btnBox">
			<view class="btnBox_collect" @click="follow(1)">
				<image v-if="roomInfo.attentionStatus == 1" src="../../static/like1.png" mode="aspectFill" :class="{aniLike:roomInfo.attentionStatus == 1}"></image>
				<image v-else src="../../static/like0.png" mode="aspectFill" :class="{aniLike:roomInfo.attentionStatus == 1}"></image>
				<!-- <image src="../../static/like0.png" mode="aspectFit"></image> -->
				<view>关注</view>
			</view>
			<view class="btnBox_contact" @click="contactOwner">联系房东</view>
		</view>
		<!-- contact弹窗 -->
		<cover-view v-if="isShowContactModal" @click="hideModal" @catchtouchmove="true" class="contactMask"></cover-view>
		<cover-view v-if="isShowContactModal" class="contact_modal">
			<cover-view class="contact_modal_landlordInfo">
				<cover-image v-if="roomInfo.landlordImg" :src="roomInfo.landlordImg" mode="aspectFit"></cover-image>
				<cover-image v-else src="../../static/house1.jpg" mode="aspectFit"></cover-image>
				<cover-view class="contact_modal_landlordInfo_name">{{roomInfo.landlordName}}{{roomInfo.landlordSex == 1 ? '女士' : '先生' }}</cover-view>
				<cover-view v-if="roomInfo.landlordAttStatus == 1" class="contact_modal_landlordInfo_save saved">已关注</cover-view>
				<cover-view v-else class="contact_modal_landlordInfo_save" @click="follow(2)">关注房东</cover-view>
			</cover-view>
			<cover-image class="contact_modal_del" @click="hideModal" src="../../static/deleteIcon.png" mode="aspectFit"></cover-image>
			<cover-view class="contact_modal_telBox">
				<cover-view class="contact_modal_telBox_tel">{{roomInfo.landlordPhone | hidePhone}}</cover-view>
				<cover-view class="contact_modal_telBox_btn" @click="callPhone">拨打电话</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				init:false,
				seeApaList:['随时看房','周末看房','工作日看房'],
				orientationList:['东','南','西','北'],
				isShowContactModal:false,
				facilityList:[
					{
						iconUrl:'../../static/facIcon0.png',
						name:'洗衣机'
					},
					{
						iconUrl:'../../static/facIcon1.png',
						name:'空调'
					},
					{
						iconUrl:'../../static/facIcon2.png',
						name:'衣柜'
					},
					{
						iconUrl:'../../static/facIcon3.png',
						name:'电视'
					},
					{
						iconUrl:'../../static/facIcon4.png',
						name:'冰箱'
					},
					{
						iconUrl:'../../static/facIcon5.png',
						name:'热水器'
					},
					{
						iconUrl:'../../static/facIcon6.png',
						name:'床'
					},
					{
						iconUrl:'../../static/facIcon7.png',
						name:'暖气'
					},
					{
						iconUrl:'../../static/facIcon8.png',
						name:'宽带'
					},
					{
						iconUrl:'../../static/facIcon9.png',
						name:'天然气'
					},
				],
				swiperCurrent:1,
				imgUrls:[
					'../../static/house1.jpg',
					'../../static/house2.jpg',
					'../../static/house3.jpg',
				],
				roomInfo:{}
			}
		},
		computed:{
			 ...mapState(['user']) 
		},
		onLoad(option) {
			this.getRoomInfo(option.roomId,option.houseId)
			// setTimeout(()=>{
				this.vistiRoom(option.roomId)
			// },2000)
		},
		methods: {
			follow(type){
				let _this = this
				let par = {
					intermeId:this.user.userInfo.id
				}
				if(type == 1){
					par.roomId = this.roomInfo.id
					if(_this.roomInfo.attentionStatus == 1){
						par.attentionStatus = 0
					}else{
						par.attentionStatus = 1
					}
				}else if(type == 2){
					par.landlordId = _this.roomInfo.landlordId
					par.attentionStatus = 1
				}
				this.$request.follow(par).then(res =>{
					if(res.data.code == 200){
						if(type == 1){
							_this.roomInfo.attentionStatus = par.attentionStatus
						}else if(type == 2){
							_this.roomInfo.landlordAttStatus = par.attentionStatus
						}
						uni.showToast({
							title: par.attentionStatus ? '关注成功' : '取关成功',
							icon:'none'
						})
					}
				})
			},
			vistiRoom(roomId){
				this.$request.vistiRoom({
					roomId,
					intermeId:this.user.userInfo.id
				})
			},
			getRoomInfo(id,houseId){
				let _this = this
				_this.$request.getRoomInfo({
					id,
					houseId,
					"intermeId":_this.user.userInfo.id
				}).then((res) =>{
					this.init = true;
					let data = res.data.data
					if(data.roomImgs == ""){
						data.roomImgs = _this.imgUrls
					}else{
						data.roomImgs = data.roomImgs.split(',')
					}
					data.landlordName = data.landlordName.substr(0,1)
					data.seeTheApartment = parseInt(data.seeTheApartment) - 1
					data.label = JSON.parse(data.label)
					let arr = []
					data.label.forEach(item => {
						if(item.isChecked == 1){
							arr.push(item)
						}
					})
					data.label = arr
					data.tenancyTerm = JSON.parse(data.tenancyTerm)
					let str = ''
					data.tenancyTerm.forEach((item,index) =>{
						console.log(item)
						if(item.isChecked){
							if(index == (data.tenancyTerm.length - 1)){
								str+=item.name
							}else{
								str+=item.name+'/'
							}
						}
					})
					data.tenancyTerm = str
					data.roomConfigure = JSON.parse(data.roomConfigure)
					_this.roomInfo = data
				})
			},
			callPhone(){
				let _this = this
				uni.makePhoneCall({
				  phoneNumber: _this.roomInfo.landlordPhone
				})
			},
			contactOwner(){
				this.isShowContactModal = true
			},
			hideModal(){
				this.isShowContactModal = false;
			},
			swiperChange(e){
				this.swiperCurrent = e.detail.current +1;
			}
		}
	}
</script>

<style scoped lang="scss">
	swiper{
		width: 100%;
		height: 434rpx;
	}
	.swiper{
		width: 100%;
		height: 434rpx;
		position: relative;
		&_image{
			width: 100%;
			height: 100%;
		}
		&_dots{
			position: absolute;
			right: 20rpx;
			bottom: 30rpx;
			font-size: 30rpx;
			color: #FFFFFF;
			&::first-letter{
				opacity: 0.6;
			}
		}
	}
	.content{
		width: 100%;
		height: 100%;
		padding: 50rpx 40rpx 44rpx 40rpx;
		border-bottom: 22rpx solid #F8F8F8;
		&_price{
			color: #E7624B;
			font-size: 50rpx;
			font-weight: bold;
			display: flex;
			span{
				font-size: 30rpx;
				align-self: center;
			}
		}
		&_name{
			margin-top: 20rpx;
			font-size: 36rpx;
			color: #444444;
			font-weight: bold;
			padding-bottom: 46rpx;
			border-bottom: $base-border;
		}
		&_intro{
			width: calc(100% - 20rpx);
			margin-left: 10rpx;
			padding: 40rpx 0;
			border-bottom: $base-border;
			display: flex;
			justify-content: space-between;
			&_li{
				width: fit-content;
				color: #555555;
				font-size: 30rpx;
				font-weight: bold;
				text-align: center;
				sup{
					font-size: 14rpx;
				}
				&_name{
					font-size: 26rpx;
					color: #999999;
					margin-top: 10rpx;
					font-weight: normal;
				}
			}
		}
		&_facility{
			width: 100%;
			padding: 32rpx 0 22rpx 0;
			display: flex;
			flex-wrap: wrap;
			&_li{
				height: 48rpx;
				width: fit-content;
				padding: 0 18rpx;
				color: #333333;
				font-size: 26rpx;
				line-height: 48rpx;
				border-radius: 5rpx;
				background-color: #F7F7F7;
				margin-bottom: 20rpx;
				&:not(:last-of-type){
					margin-right: 20rpx;
				}
			}
		}
		&_other{
			width: 100%;
			display: flex;
			color: #444444;
			font-size: 30rpx;
			&_item:first-of-type{
				margin-right: auto;
			}
			span{
				font-weight: bold;
			}
		}
	}
	.roommate{
		width: 100%;
		height: 100%;
		padding: 50rpx 40rpx 184rpx 40rpx;
		&_name{
			font-size: 44rpx;
			color: #444444;
			font-weight: bold;
			padding-bottom: 24rpx;
		}
		&_li{
			height: 108rpx;
			&_inner{
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				border-bottom: 1rpx solid #F0F0F0;
				.sexImg{
					width: 60rpx;
					height: 60rpx;
					margin-right: 28rpx;
				}
				.roomNo{
					font-size: 30rpx;
					color: #555555;
					margin-right: auto;
				}
				.sex{
					color: #999999;
					font-size: 30rpx;
					margin-right: 18rpx;
				}
				.sexIcon{
					width: 29rpx;
					height: 29rpx;
				}
			}
		}
	}
	
	.introduce{
		width: 100%;
		height: 100%;
		padding: 50rpx 40rpx 0 40rpx;
		
		&_name{
			font-size: 44rpx;
			color: #444444;
			font-weight: bold;
			padding-bottom: 48rpx;
		}
		&_facility{
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			&_li{
				width: calc(100% / 5);
				margin-bottom: 48rpx;
				text-align: center;
				font-size: 22rpx;
				color: #444444;
				
				&_img{
					width: 52rpx;
					height: 52rpx;
					margin-bottom: 18rpx;
				}
			}
		}
		&_desc{
			color: #555555;
			font-size: 31rpx;
			line-height: 44rpx;
		}
	}
	.btnBox{
		width: 100%;
		height: 164rpx;
		padding-right: 40rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		box-shadow:0rpx 2rpx 16rpx 2rpx rgba(68,68,82,0.08);
		background-color: #FFFFFF;
		&_collect{
			height: 100rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			margin: 0 auto;
			color: #444444;
			font-size: 28rpx;
			image{
				width: 42rpx;
				height: 40rpx;
			}
		}
		&_contact{
			width: 494rpx;
			height: 100rpx;
			text-align: center;
			line-height: 100rpx;
			border-radius: 10rpx;
			color: #FFFFFF;
			background-color: $base-color;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	.grayFilter{
		filter: opacity(30%);
	}
	.contactMask{
		position: fixed;
		width: 750rpx;
		height: 100vh;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #000000;
		opacity: 0.4;
	}
	.contact_modal{
		width: 630rpx;
		height: 342rpx;
		border-radius: 15rpx;
		background-color: #FFFFFF;
		position: fixed;
		z-index: 100;
		left: 60rpx;
		top: 28%;
		text-align: center;
		padding: 74rpx 0 54rpx 0;
		&_landlordInfo{
			width: 100%;
			height: 86rpx;
			line-height: 86rpx;
			font-weight: bold;
			position: relative;
			cover-image{
				width: 86rpx;
				height: 86rpx;
				display: inline-block;
				border-radius: 50%;
				position: absolute;
				left: 44rpx;
				top: 0;
			}
			cover-view{
				display: inline-block;
			}
			&_name{
				height: 86rpx;
				line-height: 86rpx;
				color: #333333;
				font-size: 36rpx;
				position: absolute;
				left: 152rpx;
				top: 0;
			}
			.saved{
				background-color: #F0F0F0;
				color: #999999;
			}
			&_save{
				background-color: #FFA044;
				border-radius: 10rpx;
				width: 173rpx;
				height: 62rpx;
				color: #FFFFFF;
				font-size: 26rpx;
				line-height: 62rpx;
				text-align: center;
				position: absolute;
				top: 10rpx;
				right: 44rpx;
			}
		}
		&_telBox{
			width: 100%;
			height: 62rpx;
			position: absolute;
			bottom: 64rpx;
			left: 0;
			&_tel{
				height: 62rpx;
				line-height: 62rpx;
				position: absolute;
				left: 44rpx;
				top: 0;
				font-size: 36rpx;
				color: #333333;
				font-weight: bold;
			}
			&_btn{
				background-color: #3C76ED;
				border-radius: 10rpx;
				width: 173rpx;
				height: 62rpx;
				color: #FFFFFF;
				font-size: 26rpx;
				line-height: 62rpx;
				text-align: center;
				position: absolute;
				top: 0rpx;
				right: 44rpx;
			}
		}
		&_del{
			width: 32rpx;
			height: 32rpx;
			position: absolute;
			right: 32rpx;
			top: 32rpx;
		}
	}
	.addPadding{
		padding: 50rpx 40rpx 180rpx 40rpx;
	}
</style>
