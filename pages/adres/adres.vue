<template>
	<view class="contain">
		<!---->
		<view class="adres_list">
			<view class="tis_detail">
				<view class="tle">
					<view class="name">铁板鱿鱼</view>12200033322
				</view>
				<view class="txt">北京  朝阳区  团结湖路17号楼南门502</view>
			</view>
			<view class="bit_cont">
				<view class="adres_default">
					<label class="adres_rad">
						<view class="ring"><radio value="" /></view>
						<text>设为默认地址</text>
					</label>
				</view>
				<view class="seet_dl">
					<view class="dl">
						<image class="i" src="@/static/image/adres_i_1.png" mode="widthFix"></image>
						删除
					</view>
					<view class="dl">
						<image class="i" src="@/static/image/adres_i_2.png" mode="widthFix"></image>
						修改
					</view>
				</view>
			</view>
		</view>
		<!-- -->
		<navigator url="/pages/adresxz/adresxz" class="bit_add_btn">新增地址</navigator>
	</view>
</template>

<script>
</script>

<style lang="less">
	@import url(/pages/adres/adres.css);
	
</style>