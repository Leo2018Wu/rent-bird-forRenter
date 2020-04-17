<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@-webkit-keyframes opacitShow{
	    0%{opacity: 0}
	    20%{opacity: 0}
	    100%{opacity: 1}
	}
	@keyframes opacitHide{
	    0%{opacity: 1}
	    20%{opacity: 1}
	    100%{opacity: 0}
	}
	.aniLike{
		animation:aniIcon 0.4s linear;
	}
	// 小icon过度效果
	@keyframes  aniIcon{
		0%{scale: 0.6}
		30%{scale: 0.9}
		30%{scale: 1.1}
		100%{scale: 1.3}
	}
	
	/*每个页面公共css */
	view,cover-view,scroll-view{
		box-sizing: border-box;
	}
	button {
		margin: 0;
		padding: 0;
		border: none !important;
		background-color: #fff;
	}
	
	button::after {
		border: none;
	}
	
	.btnHoverClass {
		background-color: #FFFFFF !important;
	}
	sup{
	     font-size: 10rpx;
	     vertical-align:text-top;
	}
	sub{
	     font-size: 10rpx;
	     vertical-align:text-bottom;
	}
	scroll-view ::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	  display: none;
	}
	.singleRowText{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.multipleRowText{
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
</style>
