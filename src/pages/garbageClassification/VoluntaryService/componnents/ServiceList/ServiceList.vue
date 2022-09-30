<template>
    <view class="demandDetail">
        <van-tabs custom-class="tabStyle" :active='activeStatus' @click="changeTab" title-active-color='#333333' title-inactive-color='#666666' tab-active-class="activeStyle">
            <van-tab :info="frequencyData[item.serviceNum]" :title="item.name" v-for="item in serviceStatusOptions" :key="item.id" :name="item.id"></van-tab>
        </van-tabs>
        <view class="allInfo">
            <demandContent :demandList="demandList" :isServiceList="true"/>
        </view>
    </view>
</template>

<script>
//创建audio控件
import demandContent from '../demandContent.vue'
import { getFrequency, getServiceRequirementsListPage } from "@/apis/index.js";
import store from '@/store';
    export default {
        name: 'DemandDetail',
        data(){
            return {
                frequencyData: null,
                userId:  wx.getStorageSync('userId'), // 登陆用户Id
                serviceStatusOptions: [{ name: '全部', id: undefined, serviceNum: 'sum' }, { name: '待接单', id: 3, serviceNum: 'pending' }, { name: '服务中', id: 1, serviceNum: 'serving' }, { name: '已完成', id: 2, serviceNum: 'completed' }], // 服务状态切换
                activeStatus: undefined, // 选中的服务
                demandList: []
            }
        },
        components: {
            demandContent,
        },
        async onShow(){
            this.getFrequencyData();
            this.getServiceRequirementsData();
        },
        computed:{
            latitude() {
                return store.state.lnglat.latitude;
            },
            longitude() {
                return store.state.lnglat.longitude;
            },
        },
        methods: {
            /**
             * 获取自己服务数
             */
            async getFrequencyData(){
                try{
                    const { data } = await getFrequency();
                    if (data.code) {
                        wx.showToast({
                            icon: 'error',
                            title: data.msg
                        })
                        this.frequencyData = null;
                        return
                    }
                    this.frequencyData = data.data;

                    
                }catch(err){
                    this.frequencyData = null;
                    throw new Error(`请求获取自己服务数接口报错${err}`)
                }
            },
            /**
             * 获取服务需求列表 / 小程序服务清单
             */
            async getServiceRequirementsData(){
                try{
                    let serviceRequirementsParams = {
                        serviceContactorId: this.userId,
                        search: '',
                        status: this.activeStatus,
                        latitude: this.latitude,
                        longitude: this.longitude,
                        flag: 4
                    }
                    const { data } = await getServiceRequirementsListPage(serviceRequirementsParams);
                    if (data.code) {
                        wx.showToast({
                            icon: 'error',
                            title: data.msg
                        })
                        this.demandList = [];
                        return
                    }
                    this.demandList = data.page.list;
                }catch(err){
                    this.demandList = [];
                    throw new Error(`请求获取获取服务需求列表 / 小程序服务清单接口报错${err}`)
                }
            },
            /**
             * 切换tab 服务处理函数
             */
            changeTab(item){
                this.activeStatus = item.detail.name;
                this.getServiceRequirementsData();
            },
        },
    }
</script>

<style lang="less">
.demandDetail{
    height: 97vh;
    background: #f8f8f8;
    padding: 0 10rpx;
    color: #999;
    font-size: 30rpx;
    position: relative;
    .allInfo{
        height: calc(97vh - 84rpx);
        overflow: auto
    }
    .tabStyle{
        margin: 20rpx 0;
        .van-info {
            position: absolute !important;
            top: 10rpx !important;
            right: 30rpx;
        }
    }
    .activeStyle{
        font-weight: 600;
    }
}
</style>