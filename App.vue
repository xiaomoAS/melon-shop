<script>
	import Couponlast from '@/components/coupon-list/coupon-list.vue'
	export default {
		components: {Couponlast},
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	
	
	.bottom_resige_down{
		position: fixed;
		bottom:160rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 96%;
		padding: 24rpx 20rpx;
		background: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		color: #fff;
		border-radius: 5px;
		z-index: 99;
		.l_cont{
			display:flex;
			align-items: center;
			.logo{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80rpx;
				height:80rpx;
				image{
					display:block;
					width:100%;
					height:100%;
				}
			}
			.inf_cont{
				padding-left:20rpx;
				.tle{
					font-size:26rpx;
					color:#fffffff2;
					margin-bottom:10rpx;
				}
				.txt{
					font-size:24rpx;
					color:#fffffff2;
				}
			}
		}
		.down_btn{
			padding: 20rpx 50rpx;
			border-radius: 100rpx;
			background: #e10000;
			font-size: 26rpx;
			color: #ffffff;
			.biaoqian{
				color: #ffffff !important;
				text-decoration: dashed;
			}
		}
	}
	
	.contain{
		width:100%;
		padding:0 20rpx;
	}
	view{
		box-sizing: border-box;
	}
	.pulic_dc_bg{
		position: fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		z-index:10;
		background: rgba(0,0,0,0.5);
	}
</style>
