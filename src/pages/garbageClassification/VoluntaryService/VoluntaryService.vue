<template>
    <view class="voluntaryService">
        <view class="volunteerTask" @click="toServiceList">
            <view class="volunteerHead">
                <van-image
                    round
                    width="100rpx"
                    height="100rpx"
                    :src="avatar == null ? defaultAvatar : avatar"
                />
                <view class="voluntaryInfo">
                    <view class="voluntaryName">
                        {{userName}}
                        <image v-if="frequencyData.politicalOutlook === 1" class="partyMember" :src="imgStaticUrl+'/img/VoluntaryService/partyMember.png'" alt="" srcset="" />
                    </view>
                    <view class="numberOfServices">
                        <text>服务数：{{frequencyData.sum}}</text>
                        <text>待接单：<text class="num">{{frequencyData.pending}}</text></text>
                        <text>服务中：<text class="num">{{frequencyData.serving}}</text></text>
                    </view>
                </view>
            </view>
            <van-icon name="arrow" />
        </view>

        <view class="demandList">
            <text>
                需求总数：<text class="demandNum">{{demandTotal}}</text>
            </text>
            <view class="demandType">
               <view v-for="(item, index) in dataType" :key="item" :class="['oneType', { selectTypeStyle:  selectType === index}]"  @click="selectTypeHandle(index)">
                   {{item.name}}
               </view>
            </view>
        </view>
        
        <view class="allInfo">
            <demandContent :demandList="demandList" />
        </view>
    </view>
</template>

<script>
//创建audio控件
const myaudio = wx.createInnerAudioContext();
import demandContent from './componnents/demandContent.vue'
import { getFrequency, getPendingService } from "@/apis/index.js";
import config from '@/static/config/index.js';
import store from '@/store';
import { getLocation } from '@/utils/hooks/useHooks.js';
    export default {
        name: 'VoluntaryService',
        data(){
            return {
                imgStaticUrl: this.$imgStaticUrl,
                defaultAvatar: this.$imgStaticUrl + '/img/home/default-avatar.png', // 默认头像
                frequencyData: null,
                dataType: [{name: '按时间', id : 0}, {name: '按距离', id : 1}], // 列表查询方式类型
                selectType: 0, // 列表查询方式选中索引值
                elderlyType: ['空巢老人', '残疾人', '病患者'], // 列表查询方式类型
                serviceType: ['家电维修', '聊天解闷', '家政打扫'], // 列表查询方式类型
                latitude: 0,
                longitude: 0,
                demandList: [],// 所有服务对象信息
                demandTotal: 0, // 需求总数
                timeInterval: null,
            }
        },
        components: {
            demandContent,
        },
        async onShow(){
            const res = await getLocation(true);
            if (res.latitude) {
                let lnglat = {
                    latitude: res.latitude,
                    longitude: res.longitude,
                }
                this.latitude = res.latitude;
                this.longitude = res.longitude;
                
                // 存储起来给服务清单和需求详情用
                store.commit('SET_LNGLAT', lnglat)
            }else{
                this.latitude = 0;
                this.longitude = 0;
                wx.showToast({
                    icon: 'error',
                    title: res.errMsg
                })
            }
            this.getFrequencyData();
            this.getPendingServiceData();
        },
        computed: {
            avatarImg() {
                return store.state.userInfo.avatar;
            },
            userName() {
                return store.state.userInfo.userName;
            },
            avatar() {
                return this.avatarImg
                    ? this.avatarImg.startsWith('http')
                        ? this.avatarImg
                        : config.fileHost + this.avatarImg
                    : null;
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
             * 获取平台的待服务需求
             */
            async getPendingServiceData(){
                try{
                    let pendingServiParams = {
                        type: this.dataType[this.selectType].id,
                        longitude: this.longitude,
                        latitude: this.latitude,
                    }
                    const { data } = await getPendingService(pendingServiParams);
                    if (data.code) {
                        wx.showToast({
                            icon: 'error',
                            title: data.msg
                        })
                        this.demandList = [];
                        this.demandTotal = 0;
                        return;
                    }
                    this.demandList = data.data;
                    this.demandTotal = data.count;
                    this.demandList.forEach((item)=>{
                        item.isPlay = false;
                        item.isStatus = true;
                    })
                }catch(err){
                    this.demandList = [];
                    this.demandTotal = 0;
                    throw new Error(`请求获取平台的待服务需求接口报错${err}`);
                }
            },
            /**
             * 点击查询方式
             * @param idx 选择索引值
             */
            selectTypeHandle(idx){
                this.selectType = idx;
                this.getPendingServiceData();
            },
            /**
             * 跳转到服务清单页
             */
            toServiceList(){
                wx.navigateTo({
                    url:'/pages/garbageClassification/VoluntaryService/componnents/ServiceList/ServiceList'
                })
            },
            playVoice(obj){
                this.demandList.forEach(v=>{
                    v.audioArr.forEach(item=>{
                        if (obj.id !== item.id) {
                            item.isPlay = false;
                            myaudio.stop();
                        }
                    })  

                })

                obj.isPlay = !obj.isPlay
                if (obj.isPlay) {
                    //音频播放 
                    myaudio.src = obj.path;
                    myaudio.play();
                    myaudio.onEnded(() => {
                        obj.isPlay = false;
                    })
                    return
                }
                //音频停止
                myaudio.stop();
                myaudio.onEnded(() => {
                    obj.isPlay = false;
                })
            }
        },
    }
</script>

<style lang="less">
.voluntaryService {
    height: 98vh;
    background: #f8f8f8;
    padding: 0 10rpx;
    color: #999;
    font-size: 30rpx;
    .volunteerTask {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background-color: white;
        .volunteerHead{
            display: flex;
            .voluntaryInfo{
                width: 520rpx;
                margin-left: 10rpx;
                .voluntaryName{
                    color: #333;
                    font-weight: 600;
                    font-size: 35rpx;
                    margin-bottom: 10rpx;
                    display: flex;
                    align-items: center;
                    .partyMember{
                        width: 40rpx;
                        height: 40rpx;
                        margin-left: 10rpx;
                    }
                }
            }
            .numberOfServices{
                display: flex;
                justify-content: space-between;
            }
        }
        .num {
            color: #0091ff;
        }
    }

    .demandList{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        margin: 20rpx 0;
        padding: 20rpx;
        .demandNum{
            color: #333;
            font-weight: 600;
        }
        .demandType{
            color: #666;
            font-size: 27rpx;
            background-color: #F8F8F8;
            border-radius: 32rpx;
            display: flex;
            justify-content: space-between;
            .selectTypeStyle{
                color: #0091ff;
            }
            .oneType{
                padding: 14rpx 25rpx;
            }
        }
    }

    .allInfo{
        height: calc(98vh - 259rpx);
        overflow: auto
    }
}
</style>