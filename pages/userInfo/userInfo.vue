<template>
	<view class="userInfo">
		<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
			<evan-form-item label="姓名" prop="realName" :fontBold="true">
				<template v-slot:main>
					<input class="form-input" placeholder-style="color:#cecece" placeholder-class="form-input-placeholder" v-model="info.realName" placeholder="请输入" />
				</template>
				<template v-slot:tip>
					<view class="inpArrow">
						<image src="../../static/right_arrow.png" mode="aspectFit"></image>
					</view>
				</template>
			</evan-form-item>
			<evan-form-item label="电话" prop="phoneNumber" :fontBold="true">
				<template v-slot:main>
					<input class="form-input" placeholder-style="color:#cecece" type="number" maxlength="11" placeholder-class="form-input-placeholder" 
					 v-model="info.phoneNumber" placeholder="请输入" />
				</template>
				<template v-slot:tip>
					<view class="inpArrow">
						<image src="../../static/right_arrow.png" mode="aspectFit"></image>
					</view>
				</template>
			</evan-form-item>
			<evan-form-item label="门店" prop="company" :fontBold="true">
				<template v-slot:main>
					<input class="form-input" placeholder-style="color:#cecece" placeholder-class="form-input-placeholder" v-model="info.company" placeholder="请输入" />
				</template>
				<template v-slot:tip>
					<view class="inpArrow">
						<image src="../../static/right_arrow.png" mode="aspectFit"></image>
					</view>
				</template>
			</evan-form-item>
			<evan-form-item label="状态" prop="status" :fontBold="true">
				<template v-slot:main>
					<view class="statusBox">
						<view v-if="user.userInfo.authStatus == 0" class="statusBox_unAuth">未授权</view>
						<view v-if="user.userInfo.authStatus == 2" class="statusBox_unAuth">授权审核中</view>
						<view v-if="user.userInfo.authStatus == 1" class="statusBox_authed">已授权</view>
					</view>
				</template>
			</evan-form-item>
		</evan-form>
		<view v-if="user.userInfo.authStatus == 0" class="btnBox">
			<view class="btnBox_save" @click="save(false)">保存</view>
			<view class="btnBox_apply" @click="save(true)">申请授权</view>
		</view>
		<view v-if="user.userInfo.authStatus == 1 || user.userInfo.authStatus == 2"  class="saveBtn" @click="save(false)">保存</view>
	</view>
</template>

<script>
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue'; 
	import { mapState } from 'vuex';
	export default {
		components: {
			evanFormItem,
			evanForm
		},
		data() {
			return {
				info:{
					realName:'',
					phoneNumber:'',
					company:'',
				},
				rules:{
					realName: {
						required: true,
						message: '请输入姓名'
					},
					phoneNumber: [{
							required: true,
							message: '请输入电话'
						},
						{
							validator: (rules, tel, callback) => {
								if (this.$validate.isMobilePhone(tel)) {
									callback();
								} else {
									callback(new Error('手机号格式不正确'));
								}
							}
						}
					],
					company: {
						required: true,
						message: '请输入门店'
					},
				}
			}
		},
		computed: {
			...mapState(['user'])
		},
		onShow() {
			console.log(this.user)
			let _this = this
			for(let key in _this.info){
				let temp = _this.user.userInfo[key]
				if(!temp && typeof(temp)!="undefined" && temp!=0){
					_this.info[key] = ""
				}else{
					_this.info[key] = temp
				}
				
			}
			_this.$nextTick(() => {
				_this.$refs.form.setRules(_this.rules)
			})
		},
		methods: {
			save(type){
				console.log(type)
				let _this = this
				_this.$refs.form.validate(res => {
					if (res) {
						let temp = JSON.parse(JSON.stringify( _this.user.userInfo))
						for(let key in _this.info){
							temp[key] = _this.info[key]
						}
						if(type){
							temp.authStatus = 2
						}
						_this.$request.applyAuth(temp).then((res)=>{
							console.log(res)
							if(type){
								uni.showToast({
									title:'申请授权成功，请耐心等候',
									icon:'none',
									duration:2000
								})
							}else{
								uni.showToast({
									title:'保存成功',
									duration:2000
								})
							}
							_this.$store.commit('SET_USERINFO',res.data.data)
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.userInfo{
		padding: 0 45rpx 0 48rpx;
	}
	.inpArrow {
		width: 19rpx;
		height: 100%;
		margin-left: 10rpx;
		display: flex;
		align-items: center;
		margin-top: 4rpx;
		image{
			width: 100%;
			height: 30rpx;
		}
	}
	.form-input-placeholder {
		font-size: 32rpx;
		text-align: right !important;
	}
	
	.form-input {
		width: 100%;
		height: 100%;
		text-align: right;
		font-size: 32rpx;
		color: #999999;
	}
	.statusBox{
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		view{
			// width: 171rpx;
			padding: 0 40rpx;
			height: 53rpx;
			line-height: 53rpx;
			text-align: center;
			border-radius: 27rpx;
			font-size: 24rpx;
		}
		&_unAuth{
			color: #999999;
			background-color: #F0F0F0;
		}
		&_authed{
			background-color: $base-color;
			color: #FFFFFF;
		}
	}
	.btnBox{
		width: calc(100% - 152rpx);
		height: 96rpx;
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 100rpx;
		left: 76rpx;
		view{
			width: calc((100% - 25rpx) / 2);
			text-align: center;
			height: 100%;
			line-height: 96rpx;
			border-radius: 10rpx;
		}
		&_save{
			background-color: $base-color;
			color: #FFFFFF;
		}
		&_apply{
			border: 1rpx solid $base-color;
			color: $base-color;
		}
	}
	.saveBtn{
		width: 574rpx;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		background-color: $base-color;
		color: #FFFFFF;
		font-size: 34rpx;
		font-weight: bold;
		position: fixed;
		bottom: 100rpx;
		left: 88rpx;
		border-radius: 10rpx;
	}
</style>
