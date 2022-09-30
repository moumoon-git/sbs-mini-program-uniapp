<template>
	<!--pages/activation/activation.wxml-->
	<view class="container">
	    <header class="header">
	        <image class="header-image" src="https://z3.ax1x.com/2021/10/20/5Bte9U.png" mode="cover"></image>
	        <text class="header-text">增 城 社 会 治 理</text>
	    </header>
	    <view>
	        <van-tabs v-model:active="active" type="card" animated @change="handleTabChange">
	            <van-tab title="手机验证码激活">
	                <van-cell-group >
	                    <van-field
	                        v-model="phone"
	                        center
	                        clearable
	                        label="手机号"
	                        placeholder="请输入手机号"
	                        :border="false"
	                        use-button-slot
	                    >
	                        <van-button slot="button" size="small" round type="info" @click="getVerificationCode">
	                            <text v-if="!getCodeFlag">发送验证码</text>
	                            <van-count-down v-if="getCodeFlag" class="count-down" :time="time" format="ss"  @finish="finished"/>
	                        </van-button>
	                    </van-field>
	                    <van-field
	                        v-model="verificationCode"
	                        center
	                        clearable
	                        label="验证码"
	                        placeholder="请输入验证码"
	                        :border="false"
	                    >
	                    </van-field>
	                </van-cell-group>
	            </van-tab>
	            <van-tab title="随机密码激活">
	                <van-cell-group >
	                    <van-field
	                        v-model="phone"
	                        center
	                        clearable
	                        label="手机号"
	                        placeholder="请输入手机号"
	                        :border="false"
	                    >
	                    </van-field>
	                    <van-field
	                        v-model="password"
	                        type="password"
	                        center
	                        clearable
	                        label="密码"
	                        placeholder="请输入密码 "
	                        :border="false"
	                    >
	                    </van-field>
	                </van-cell-group>
	            </van-tab>
	        </van-tabs>
	        <van-button class="activation" round  type="info" size="normal" :disabled="(active==0 && !(phone && verificationCode)) || (active==1 && !(phone && password))" @click="activate">立即激活</van-button>
	    </view>
	</view>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive
} from 'vue';
import config  from '@/static/config/index.js';

export default defineComponent({
  name: 'activation',
  data() {  
	return {  
	  active: 0, //当前选中tab的标识符
	  phone: '', //手机号
	  verificationCode: '', //验证码
	  password: '', //密码
	  getCodeFlag: false, //是否正在获取手机验证码
	  time: 60 * 1000 //获取手机验证码倒计时
	}
   },
   components: {
   },
  methods: {
	// 当前tab改变时触发的回调函数
	handleTabChange(name, title) {
		console.log('handleTabChange name, title',name, title);
		this.active = name.detail.index;
	},
	// 验证手机号格式
	verifyPhone() {
		if(!(/^1[3456789]\d{9}$/.test(this.phone.detail))){
			wx.showToast({
				title: '手机号码有误，请重新填写',
				icon: 'error'
			});
			return false;
		}else{
			return true;
		}
	},
	// 获取手机验证码
	getVerificationCode() {
		console.log('发送验证码')
		if(!this.verifyPhone() || this.getCodeFlag) {
			return ;
		}
		const that = this;
		wx.request({
		  url: `${config.baseUrl}/mail/mailcontactor/getMobileVerificationCode`,
		  data: {
		    mobile: that.phone.detail,
		  },
		  method: "GET",
		  header: {
		    "content-type": "application/x-www-form-urlencoded"
		  },
		  success ({data}) {
		    console.log('/mail/mailcontactor/getMobileVerificationCode data', data);
		    if(data.code == 0) {
		    	that.getCodeFlag = true;
		    	wx.showToast({
		    		title: '验证码已发送',
		    		icon: 'success'
		    	});
		    } else {
		    	wx.showToast({
		    		title: data.msg,
		    		icon: 'error'
		    	});
		    }
		  }
		})
	},
	// 倒计时结束时触发
	finished() {
		this.getCodeFlag = false;
	},
	// 立即激活
	activate() {
		if(!this.verifyPhone()) {
			return ;
		}
		if(this.active == 0) {
			const that = this;
			wx.request({
			  url: `${config.baseUrl}/mail/mailcontactor/activation`,
			  data: {
			    mobile: that.phone.detail,
			    verificationCode: that.verificationCode.detail,
			    openId: wx.getStorageSync('openId')
			  },
			  method: "POST",
			  header: {
			    'content-type': 'application/json'
			  },
			  success ({data}) {
			    console.log('/mail/mailcontactor/activation', data);
			    if(data.code == 0) {
			    	wx.showToast({
			    		title: '激活成功',
			    		icon: 'success'
			    	});
			    	wx.setStorageSync('platformId', data.platformId);
			    	wx.setStorageSync('token', data.token);
			    	wx.redirectTo({
			    		url: '../home/home'
			    	});
			    } else {
			    	wx.showToast({
			    		title: data.msg,
			    		icon: 'error'
			    	});
			    }
			  }
			})
			
		} else {
			const that = this;
			wx.request({
			  url: `${config.baseUrl}/mail/mailcontactor/passwordActivation`,
			  data: {
			    mobile: that.phone.detail,
			    verificationCode: that.password.detail,
			    openId: wx.getStorageSync('openId')
			  },
			  method: "POST",
			  header: {
			    'content-type': 'application/json'
			  },
			  success ({data}) {
			    console.log('/mail/mailcontactor/passwordActivation', data);
			    if(data.code == 0) {
			    	wx.showToast({
			    		title: '激活成功',
			    		icon: 'success'
			    	});
			    	wx.setStorageSync('platformId', data.platformId);
			    	wx.setStorageSync('token', data.token);
			    	wx.redirectTo({
			    		url: '../home/home'
			    	});
			    } else {
			    	wx.showToast({
			    		title: data.msg,
			    		icon: 'error'
			    	});
			    }
			  }
			})
		}
	} 
  }
});
</script>

<style lang="less">	
	.container {
		height: 100%;
		display: block;
		padding: 0rpx;
		box-sizing: border-box;
		text-align: center;
		.header {
			display: block;
			position: relative;
			.header-image {
				display: block;
				width: 100%;
				height: 300rpx;
			}	
			.header-text {
				font-size: 50rpx;
				font-weight: bold;
				color: rgba(255,255,255,1);
				text-shadow: 0rpx 10rpx 20rpx rgba(0,0,0,0.5);
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
			}
		}
		.van-tabs__scroll.van-tabs__scroll--card,.van-tabs__nav.van-tabs__nav--card,.van-ellipsis.van-tab {
		    border-radius: 60rpx;
		    border: 0rpx!important;
		}
		
		.van-tabs__nav--card .van-ellipsis.van-tab {
		    width: 280rpx;
		    height: 80rpx;
		    line-height: 80rpx;
		    padding: 0rpx;
		    flex: initial;
		}
		
		.van-ellipsis.van-tab.van-tab--active {
		    background: linear-gradient(
		90deg, rgb(43, 128, 255) 0%, rgb(99, 186, 255) 100%, rgb(101, 188, 255) 100%);
		}
		
		scroll-view {
		    width: initial;
		}
		
		.van-tabs--card .van-tabs__wrap,.van-tabs__nav--card {
		    height: initial!important;
		}
		
		.van-tabs__wrap {
		    justify-content: center;
		    margin-top: 60rpx;
		}
		
		.van-tab__pane.van-tab__pane--active {
		    margin-top: 50rpx;
		}
		
		.activation .van-button {
		    padding: 30rpx 200rpx;
		    font-size: 40rpx;
		    height: initial;
		    line-height: initial;
		    margin-top: 50rpx;
		}
		
		.count-down .van-count-down {
		    color: rgba(255,255,255,1);
		}
	}
</style>
