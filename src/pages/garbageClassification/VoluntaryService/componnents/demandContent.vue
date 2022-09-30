<template>
    <view>
        <view class="demandContent" @click="toDemandDetail(item.id)" v-for="item in demandContent" :key="item.id">
            <view class="demandTask">
                <view class="demandHead">
                    <van-image
                        round
                        width="100rpx"
                        height="100rpx"
                        :src="item.image? fileHost + item.images: defaultAvatar"
                    />
                    <view class="demandInfo">
                        <view class="servicePersonal">
                            <text class="voluntaryName">{{item.name}}</text>
                            <text class="allElderlyType">
                                <text class="elderlyType" v-for="peopleType in (item.peopleTypeName)" :key="peopleType.id">{{peopleType.name}}</text> 
                            </text>
                        </view>
                        <view class="allServiceType">
                            <text class="serviceType" v-for="needType in item.needTypeList" :key="needType.id">{{needType.name}}</text>
                        </view>
                    </view>
                </view>
                <image v-if="item.phone" class="ipone" :src="imgStaticUrl+'/img/VoluntaryService/ipone.png'" alt="" srcset="" @click.stop="dial(item.phone)" />
            </view>
            <view class="remark" v-if="item.description || item.recordingAttachments.length">
                {{item.description}}
                <view class="voice" :style="{width: `calc(${oneAudio.len>6.3?oneAudio.len/60*92:oneAudio.len/60*92+9-oneAudio.len}%)`}" @click.stop="playVoice(oneAudio)" v-for="oneAudio in item.recordingAttachments" :key="oneAudio.id">
                    <image
                        :src="imgStaticUrl + '/img/VoluntaryService/trumpet.png'"
                        class="trumpet"
                        v-if="!oneAudio.isPlay"
                    />
                    <image
                        :src="imgStaticUrl + '/img/assistance/voice1.gif'"
                        class="animatedTrumpet"
                        v-else
                    />
                    <text class="second">{{oneAudio.len}}s</text>
                </view>
            </view>
            <view class="helpInfo">
                <view class="address">
                    <van-icon name="location" class="iconMargin"/> {{item.address}}{{item.distance?`（距离${item.distance}米）`: ''}}
                </view>
                <view class="helpTime">
                    <view>
                        <van-icon name="underway" class="iconMargin"/>求助时间：{{item.time}}
                    </view>
                    <view :style="{color: item.hour > 0 || item.min > 30 ? '#F66E6E': undefined}">
                        已求助{{item.hour}}小时{{item.min}}分钟
                    </view>
                </view>
            </view>

            <view v-if="!item.isStatus" class="promotion-contain2" :style="{ 'border-color': `transparent transparent ${serviceStatusOptions[item.status].color}` }">{{serviceStatusOptions[item.status].name}}</view>
        </view>
    </view>
</template>

<script>
//创建audio控件
const myaudio = uni.createInnerAudioContext();
import config from '@/static/config/index.js';
    export default {
        name: 'demandContent',
        props: ['demandList','isServiceList', 'isTo'],
        data(){
            return {
                imgStaticUrl: this.$imgStaticUrl,
                fileHost: config.fileHost,
                defaultAvatar: this.$imgStaticUrl + '/img/VoluntaryService/serviceAvatar.png', // 默认头像
                elderlyType: ['空巢老人', '残疾人', '病患者'], // 列表查询方式类型
                serviceType: ['家电维修', '聊天解闷', '家政打扫'], // 列表查询方式类型,
                serviceStatusOptions: [{ name: '待服务', color: '#f4be3c'}, { name: '服务中', color: '#0091ff'} , { name: '已完成', color: '#23d7a0'}, { name: '待接单', color: '#f4be3c'}],
                serviceStatus: 0,
                demandContent: [],
                serviceData: { name: '张明亮', phoneNumber: '13719655512', latitude: 23.0632, longitude: 113.1553 }, // 服务对象信息
            }
        },
        watch: {
            demandList(newV) {
                if (newV.length) {
                    newV.forEach((item) => {
                        item.time = this.getTime(item.time);
                        item.isPlay = false;
                    })
                    this.demandContent = newV;
                    return
                }
                this.demandContent = []
            }
        },
        methods: {
            getTime(str) {
                if (!str) {
                    return ""
                }
                const dateTime = str.substring(0, str.length-3).split(" ");
                const date = dateTime[0].split('-');
                const dateChina = `${date[0]}年${date[1]}月${date[2]}日`;
                return dateChina + " " + dateTime[1];
            },
            /**
             * 跳转到需求详情页
             */
            toDemandDetail(id){
                // 如果已经是详情页不跳转
                if (this.isTo !== false) {
                    wx.navigateTo({
                        url:`/pages/garbageClassification/VoluntaryService/componnents/DemandDetail/DemandDetail?isServiceList=${this.isServiceList}&requireId=${id}`
                    })
                }
            },
            /**
             * 拨打电话处理行数
             */
            dial(phone){
                wx.makePhoneCall({
                    phoneNumber: phone
                })
            },
            /**
             * 播放录音处理行数
             * @param obj 选中的录音信息
             */
            playVoice(obj){
                this.demandContent.forEach(v=>{
                    if (v.recordingAttachments) {
                        v.recordingAttachments.forEach(item=>{
                            if (obj.id !== item.id) {
                                item.isPlay = false;
                                myaudio.stop();
                            }
                        })  
                    }
                })

                obj.isPlay = !obj.isPlay
                myaudio.autoplay = true;
                if (obj.isPlay) {
                    //音频播放 
                    myaudio.src = obj.url;
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
.demandContent{
    background-color: white;
    padding: 20rpx;
    height: 440rpx;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    margin-bottom: 20rpx;
    .demandTask {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 89%;
        .demandHead{
            display: flex;
            .demandInfo{
                margin-left: 10rpx;
                .servicePersonal{
                    margin-bottom: 15rpx;
                    // display: flex;
                    // align-items: center;
                    .voluntaryName{
                        display: inline-block;
                        color: #333;
                        font-weight: 600;
                        font-size: 35rpx;
                        margin-right: 10rpx;
                        max-width: 140rpx;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .allElderlyType{
                        // display: flex;
                        // align-items: center;
                        .elderlyType{
                            display: inline-block;
                            font-size: 20rpx;
                            color: #86A0BA;
                            border-radius: 14rpx;
                            border: 2rpx solid #CDD6E1;
                            padding: 0 15rpx;
                            margin: 0 5rpx;
                            box-sizing: border-box;
                            max-width: 110rpx;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }
                }
                .allServiceType{
                    display: flex;
                    flex-wrap: wrap;
                    .serviceType{
                        font-size: 25rpx;
                        background-color: #f2f2f2;
                        border-radius: 14rpx;
                        color: #666;
                        padding: 5rpx 20rpx;
                        box-sizing: border-box;
                        margin: 0 5rpx 10rpx;
                        max-width: 140rpx;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
        .ipone{
            flex: 0 0 30rpx;
            height: 40rpx;
        }
        .num {
            color: #0091ff;
        }
    }
    .remark{
        background-color: #F5F6F7;
        border-radius: 6rpx;
        padding: 18rpx 13rpx;
        box-sizing: border-box;
        color: #333;
        margin-top: 10rpx;
        height: 142rpx;
        overflow: auto;
        .voice{
            background: rgba(0, 145, 255, 0.12);
            border: 1px solid #0091FF;
            border-radius: 35rpx;
            padding: 11rpx 20rpx;
            display: flex;
            align-items: center;
            margin: 15rpx;
            .trumpet{
                width: 45rpx;
                height: 55rpx;
            }
            .animatedTrumpet{
                width: 45rpx;
                height: 55rpx;
            }
            .second{
                margin-left: 10rpx;
            }
        }
    }
    .helpInfo{
        font-size: 25rpx;
        .iconMargin{
            margin-right: 8rpx;
        }
        .address{
            margin: 15rpx 0;
            height: 60rpx;
            display: flex;
            align-items: center;
        }
        .helpTime{
            display: flex;
            justify-content: space-between;
        }
    }
    
    // 右上角标签样式
    .promotion-contain2 {
        content:"";
        display:block;
        height:0;
        border-width:0px 40rpx 40rpx;
        border-style:none solid solid;
        position:absolute;
        transform:rotate(45deg);
        right: -18rpx;
        top: 20rpx;
        width: 80rpx;
        font-size: 26rpx;
        color: white;
    }
}
</style>