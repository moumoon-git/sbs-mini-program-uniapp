<template>
    <view class="demandDetail">
        <demandContent class="demandList" :demandList="demandList" :isTo="false" />

        <van-tabs v-if="demandList[0].status === 1 || demandList[0].status === 2" custom-class="tabStyle" :active='activeService' @click="changeTab" title-active-color='#333333' title-inactive-color='#666666' tab-active-class="activeStyle">
            <van-tab :title="item.name" v-for="item in serviceTab" :key="item.id" :name="item.id"></van-tab>
        </van-tabs>
        <map
            id="map"
            class="map"
            :show-location="true"
            :latitude="latitude"
            :longitude="longitude"
            v-if="activeService === 0"
            :style="{height: `calc(100vh - ${ demandList[0].status === 2 ? 575: (demandList[0].status === 0 ? 575 : (demandList[0].status === 3 ? 670 : 750))}rpx)`}"
            :markers="markers"
            :polyline="polyline"
        ></map>
        <template v-else>
            <view class="allServiceRecord" :style="{height: `calc(100vh - ${ demandList[0].status === 2 ? 575: 800 }rpx)`}">
                <template v-if="serviceRecord.length">
                    <view v-for="item in serviceRecord" :key="item" class="serviceRecord">
                        <view class="recordTime">{{item.reportTime}}</view>
                        <view class="recordRemark">{{item.description}}</view>
                        <view class="allImage">
                            <van-image class="recordImage" width="200rpx" v-for="oneAttachment in item.attachments" :key="oneAttachment"
                                height="200rpx" :src="oneAttachment.fileUrl" alt="" srcset=""  />
                        </view>
                    </view>
                </template>
                <view class="notData" v-else :style="{
                    paading: 0,
                    background: `url(${imgStaticUrl}/img/inspection/empty.png) no-repeat`,
                    width: '100%',
                    height: '100%',
                    'background-size': '100px 100px',
                    'background-position': 'center', 
                    'text-align': 'center', 
                    'line-height': `calc(100vh - ${ demandList[0].status === 2 ? 575: 600 }rpx)`
                }">
                    ????????????
                </view>
            </view>
        </template>

        <template v-if="isOutreach === 2">
            <view class="serviceOption" v-if="demandList[0].status === 0 || demandList[0].status === 3">
                <van-button v-if="isServiceList == 'null'" type="default" @click="claimShowHandle">????????????</van-button>
                <template v-else>
                    <van-button type="default" @click="claimShowHandle">????????????</van-button>
                    <view class="serviceButtom">
                        <text @click="stopService">????????????</text>
                    </view>
                </template>
            </view>

            <view class="serviceOption" v-if="demandList[0].status === 1">
                <van-button type="default" @click="completeShowHandle">????????????</van-button>
                <view class="serviceButtom">
                    <template v-if="activeService === 1"> <text @click="reportRecordHandle">????????????</text> <text class="dividingLine">|</text> </template><text @click="stopService">????????????</text> <text class="dividingLine">|</text> <text @click="navigation">??????</text>
                </view>
            </view>
        </template>

        <!-- ?????????????????? -->

        <van-popup
            :show="reportRecordShow"
            round
            position="bottom"
            custom-style="height: 45%"
            bind:close="onClose"
        >   
            <view class="reportRecord">
                <view class="reportRecordHeader">
                    <van-icon name="cross" @click="closeReportRecord" />
                    <text class="reportRecordTitle">????????????</text> 
                    <text class="reportRecordDetermine" @click="submitReportRecord">??????</text> 
                </view>

                <view class="uploaderPic">
                    <van-uploader :file-list="fileList" upload-text="????????????\n(??????4???)" @after-read="afterRead" @delete="deleteFile" max-count="4"  />
                </view>
                <view class="serviceDescription">
                    <text class="serviceDescriptionTitle">????????????</text>
                    <van-field
                        autosize
                        type="textarea"
                        placeholder="???????????????????????????"
                        input-class="serviceDescriptionRemark"
                        :value="description"
                        @input="descriptionInput"
                    />
                </view>
            </view>
        </van-popup>
    </view>
</template>

<script>
import config from '@/static/config/index.js';
import demandContent from '../demandContent.vue'
import { getServiceRequirementsInfo, getServiceRecord, changeStatus, serviceRecordSave } from "@/apis/index.js";
import store from '@/store';
import { getDirection } from '@/utils/hooks/useHooks.js';

    export default {
        name: 'DemandDetail',
        data(){
            return {
                imgStaticUrl: this.$imgStaticUrl,
                isReceiveTask: false, // ?????????????????????
                serviceTab: [{ name: '????????????', id: 0 }, { name: '????????????', id: 1 }], // ??????????????? ????????????
                activeService: 0, // ???????????????
                isServiceList: false, // ??????????????????????????????????????????
                serviceRecord: [], // ????????????????????????
                reportRecordShow: false, //??????????????????
                fileList: [], // ???????????? ????????????
                picList: [], // ???????????? ?????????????????????
                topHeight: 0,
                buttomHeight: 0,
                middleHeight: 0,
                notImg: {
                    background: `url(${this.$imgStaticUrl}/img/inspection/empty.png) no-repeat`,
                    width: '100%',
                    height: '100%',
                    'background-size': '100px 100px',
                    'background-position': 'center',
                },
                markers: [],
                requireId: 0, // ??????Id
                demandList: [],
                userId:  wx.getStorageSync('userId'), // ????????????Id
                description: '', // ????????????????????????
                polyline: [], // ????????????
            }
        },
        components: {
            demandContent,
        },
        async onLoad(options){
            if(options.requireId) {
                this.requireId = options.requireId;
            }
            if(options.isServiceList) {
                this.isServiceList = options.isServiceList;
            }

            await this.getServiceRequirementsData();
            this.getHeight();
        },
        computed:{
            latitude() {
                return store.state.lnglat.latitude;
            },
            longitude() {
                return store.state.lnglat.longitude;
            },
            isOutreach() {
                return store.state.userInfo.isOutreach;
            },
        },
        methods: {
            /**
             * ??????????????????
             */
            getHeight(){
                let that = this;
                that.$nextTick(()=>{
                    // ??????????????????????????????
                    wx.createSelectorQuery().select('.demandList').boundingClientRect(function (res) {
                        if (res) {
                            that.topHeight = res.height;
                            return
                        }
                        that.topHeight = 0;
                    }).exec()
                    // ??????????????????tab??????
                    wx.createSelectorQuery().select('.tabStyle').boundingClientRect(function (res) {
                        if (res) {
                            that.middleHeight = res.height;
                            return
                        }
                        that.middleHeight = 0;
                    }).exec()
                    // ????????????????????????
                    wx.createSelectorQuery().select('.serviceOption').boundingClientRect(function (res) {
                        if (res) {
                            // 20 ?????????????????????
                            that.buttomHeight = res.height +20 + (that.isOutreach === 2 ?0:(that.demandList[0].status === 0 || that.demandList[0].status === 3?200:400));
                            console.log('that.buttomHeight: ', that.buttomHeight);
                            return
                        }
                        // ???????????????????????? ?????????????????? ??????????????????
                        that.buttomHeight = ((that.demandList[0].status === 0 || that.demandList[0].status === 3)?220:320);
                    }).exec()
                })
            },
            /**
             * ????????????????????????
             */
            async getServiceRequirementsData(){
                try{
                    let infoObj = {
                        requireId: this.requireId,
                        longitude: this.longitude,
                        latitude: this.latitude,
                    }
                    const { data } = await getServiceRequirementsInfo(infoObj);
                    if (data.code) {
                        wx.showToast({
                            icon: 'error',
                            title: data.msg
                        })
                        this.demandList = [];
                        return
                    }
                    let newObj = {
                        id: data.data.careObject.id,
                        address: data.data.careObject.address,
                        name: data.data.careObject.name,
                        images: data.data.careObject.images,
                        peopleTypeName: data.data.careObject.dmpCaringPeopleEntity.personnelTypeList,
                        needTypeList: data.data.needTypeList,
                        time: data.data.helpTime,
                        hour: data.data.hour,
                        min: data.data.min,
                        status: data.data.status,
                        description: data.data.description,
                        distance: data.data.distance,
                        recordingAttachments: data.data.recordingAttachments,
                        latitude: data.data.careObject.latitude,
                        longitude: data.data.careObject.longitude,
                    }
                    this.demandList = [newObj];

                    // ???????????? ????????????
                    this.markers = [{
                        iconPath: `${this.$imgStaticUrl}/img/VoluntaryService/startingPoint.png`,
                        latitude: this.latitude,
                        longitude: this.longitude,
                        width: 25,
                        height: 25
                    },{
                        iconPath: `${this.$imgStaticUrl}/img/VoluntaryService/endPoint.png`,
                        latitude: newObj.latitude,
                        longitude: newObj.longitude,
                        width: 25,
                        height: 25
                    }]
                    const route = {
                        from: {
                            latitude: this.latitude,
                            longitude: this.longitude,
                        },
                        to: {
                            latitude: newObj.latitude,
                            longitude: newObj.longitude,
                        },
                    }

                    // ????????????  ????????????
                    getDirection(route).then((res)=>{
                        // console.log('res: ', res);
                        this.polyline = [{
                            points: res,
                            color: "#ff6600",
                            width: 10,
                            dottedLine: false,
                            arrowLine: true,
                            borderWidth:2
                        }]
                    })


                    // ?????????????????? ????????????????????? ??????????????????
                }catch(err){
                    this.demandList = [];
                    throw new Error(`?????????????????????????????? / ?????????????????????????????????${err}`)
                }
            },
            /**
             * ????????????????????????
             */
            async getServiceRecordData(){
                try{
                    let infoObj = {
                        caringPeopleId: this.demandList[0].id,
                        volunteerId: this.userId,
                        requirementId: this.requireId,
                    }
                    const { data } = await getServiceRecord(infoObj);
                    if (data.code) {
                        wx.showToast({
                            icon: 'error',
                            title: data.msg,
                        })
                        this.serviceRecord = [];
                        return
                    }
                    this.serviceRecord = data.page.list;

                    // ??????????????????
                    this.serviceRecord.forEach( item => {
                        const attachments = [];
                        item.attachments.forEach(element => {
                            attachments.push(this.transformUrl(element))
                        })
                        item.attachments = attachments
                    })

                }catch(err){
                    this.serviceRecord = [];
                    throw new Error(`??????????????????????????????????????????${err}`)
                }
            },
            /**
             * ??????????????????
             */
            async toChangeStatus(status){
                try{
                    let statusObj = {
                        id: this.requireId,
                        status, // 0???????????? 2????????????
                        serviceContactorId: this.userId,
                    }
                    const { data } = await changeStatus(statusObj);
                    return data
                    

                }catch(err){
                    throw new Error(`??????????????????????????????${err}`)
                }
            },
            /**
             * ??????????????????????????????
             */
            claimShowHandle(){
                const that = this;
                wx.showModal({
                    title: '??????',
                    content: '????????????????????????',
                    confirmText: '??????',
                    async success (res) {
                        if (res.confirm) {
                            const data = await that.toChangeStatus(1);
                            if (data.code) {
                                wx.showToast({
                                    icon: 'error',
                                    title: data.msg
                                })
                                return
                            }
                            that.demandList[0].status = 1 // ????????????????????????
                            that.getHeight();
                            wx.showToast({
                                title: '??????????????????',
                                icon: 'success',
                            })
                        } else if (res.cancel) {
                            console.log('??????????????????')
                        }
                    }
                })
            },
            /**
             * ??????tab ??????????????????
             */
            changeTab(item){
                this.activeService = item.detail.name;
                if (item.detail.name === 1) {
                    this.getServiceRecordData();
                }
            },
            /**
             * ????????????????????????
             */
            stopService(){
                const that = this;
                wx.showModal({
                    title: '??????',
                    content: '???????????????????????????',
                    async success (res) {
                        if (res.confirm) {
                            const data = await that.toChangeStatus(0);
                            if (data.code) {
                                wx.showToast({
                                    icon: 'error',
                                    title: data.msg
                                })
                                return
                            }
                            wx.showToast({
                                title: '??????????????????',
                                icon: 'success',
                            })
                            // ?????????????????????
                            wx.navigateBack({
                                url:'/pages/garbageClassification/VoluntaryService/componnents/ServiceList/ServiceList'
                            })
                        } else if (res.cancel) {
                            console.log('??????????????????')
                        }
                    }
                })
            },
            /**
             * ??????????????????????????????
             */
            completeShowHandle(){
                const that = this;
                wx.showModal({
                    title: '??????',
                    content: '???????????????????????????',
                    async success (res) {
                        if (res.confirm) {
                            const data = await that.toChangeStatus(2);
                            if (data.code) {
                                wx.showToast({
                                    icon: 'error',
                                    title: data.msg
                                })
                                return
                            }
                            that.demandList[0].status = 2 // ????????????????????????
                            wx.showToast({
                                title: '??????????????????',
                                icon: 'success',
                            })

                            // ??????????????? ?????????
                            that.buttomHeight = 0;
                            that.isReceiveTask = false;
                        } else if (res.cancel) {
                            console.log('??????????????????')
                        }
                    }
                })
            },
            /**
             * ??????????????????????????????
             */
            reportRecordHandle(){
                this.reportRecordShow = true;
            },
            /**
             * ??????????????????????????????
             * @param event ????????????????????????
             */
            afterRead(event) {
                // console.log('afterRead', event);
                const { name, file } = event.detail;
                let upFiles = [];
                // ????????? mutiple ??? true ???, file ???????????????????????????????????????
                if (file instanceof Array) {
                    upFiles.push(...file);
                } else {
                    upFiles.push(file);
                }
                upFiles.forEach((item) => {
                    // console.log(item);
                    wx.uploadFile({
                    url: `${config.baseUrl}/upload/passImg`, // ???????????????????????????????????????
                    // url: 'https://scg.chinaemt.com/ser/upload/passImg',
                    filePath: item.url,
                    name: 'file',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        token: wx.getStorageSync('token'),
                    },
                    formData: {
                        'content-type': 'multipart/form-data',
                        charset: 'utf-8',
                        file: item.url,
                    },
                    success: (res) => {
                        let data = JSON.parse(res.data);

                        if (data.code === 0) {
                        const obj = this.transformUrl(data.data);
                        this.fileList.push({
                            name: obj.name,
                            url: obj.fileUrl,
                        });
                        this.picList.push({
                            name: obj.name,
                            url: obj.url,
                        });
                        }
                    },
                    fail: (res) => {
                        console.log('fail', res);
                    },
                    complete: (res) => {
                        console.log('complete', res);
                    },
                    });
                });
            },
            /**
             * ????????????????????????
             * @param data ???????????????????????????
             */
            transformUrl(data) {
                const fileUrl = data.url.replace(/\\/g, '/');
                //???????????????????????? \ ????????????/ ????????????????????? ????????????????????????????????????
                return {
                    name: data.name,
                    fileUrl: config.fileHost + fileUrl,
                    url: data.url,
                };
            },
            /**
             * ????????????????????????
             * @param event ??????????????????
             */
            deleteFile(event) {
                // console.log('onDelete', event);
                const { index } = event.detail;
                this.fileList.splice(index, 1);
                this.picList.splice(index, 1);
            },
            /**
             * ??????????????????????????????
             */
            closeReportRecord(){
                this.reportRecordShow = false;
            },
            /**
             * ??????
             */
            navigation(){
                let that = this;
                wx.getLocation({
                    type: 'gcj02', //??????????????????wx.openLocation????????????
                    success (res) {
                        // console.log('res: ', res);
                    
                        wx.openLocation({
                            latitude: that.demandList[0].latitude,
                            longitude: that.demandList[0].longitude,
                            scale: 18
                        })
                    },
                    fail() {
                        wx.showToast({
                            title: '??????????????????\n???????????????????????????',
                            icon: 'error',
                        })
                    }
                })
            },
            /**
             * ????????????????????????
             */
            async submitReportRecord(){
                try{
                    let recordObj = {
                        caringPeopleId: this.demandList[0].id,
                        volunteerId: this.userId,
                        requirementId: this.requireId,
                        description: this.description,
                        attachments: this.picList,
                    }
                    const { data } = await serviceRecordSave(recordObj);

                    if (data.code) {
                        wx.showToast({
                            icon: 'error',
                            title: data.msg
                        })
                        return
                    }
                    // ????????????????????????
                    this.reportRecordShow = false;
                    // ??????????????????
                    this.getServiceRecordData();

                    // ????????????
                    this.description = '';
                    this.picList = [];
                    this.fileList = [];
                }catch(err){
                    throw new Error(`??????????????????????????????${err}`)
                }
            },
            /**
             * ??????????????????
             */
            descriptionInput(res){
                this.description = res.detail
            }
        },
    }
</script>

<style lang="less">
.demandDetail{
    height: 100vh;
    background: #f8f8f8;
    padding: 0 10rpx;
    color: #999;
    font-size: 30rpx;
    box-sizing: border-box;

    // tab ??????????????????
    .tabStyle{
        margin: 20rpx 0;
    }
    // tab ????????????????????????
    .activeStyle{
        font-weight: 600;
    }

    // ????????????
    .map{
        width: 100%;
        height: calc(100vh - 720rpx);
    }

    // ??????????????????
    .allServiceRecord{
        height: calc(100vh - 720rpx);
        overflow: scroll;
        .serviceRecord{
            padding: 30rpx 20rpx;
            box-sizing: border-box;
            background-color: white;
            border-radius: 10rpx;
            .recordTime{
                font-size: 25rpx;
                font-weight: 600;
                color: #333;
            }
            .recordRemark{
                margin: 20rpx 0;
            }
        }
            .allImage{
                display: flex;
                flex-wrap: wrap;
                .recordImage{
                    margin: 0 30rpx 30rpx 0;
                }
            }
        .notData{
            width: 100%;
            height: 100%;
            background-size: 100px 100px;
            background-position: center;
        }
    }

    // ????????????????????????
    .serviceOption{
        background-color: white;
        position: absolute;
        bottom: 10rpx;
        left: 10rpx;
        width: 100%;
        padding-top: 25rpx;
        box-sizing: border-box;
        & .van-button{
            background: linear-gradient(360deg, #2B80FF 0%, #65BCFF 100%);
            box-shadow: 0 6rpx 12rpx 0 rgba(12, 126, 161, 0.35);
            border-radius: 75rpx;
            border: 0;
            width: calc(100% - 20rpx);
            color: white;
            font-size: 35rpx;
        }
        .serviceButtom{
            margin: 30rpx 0;
            text-align: center;
            color: #0091ff;
            font-size: 25rpx;
            .dividingLine{
                color: #ddd;
                margin: 0 30rpx;
            }
        }
    }

    // ??????????????????
    .reportRecord{
        padding: 30rpx;
        box-sizing: border-box;
        .uploaderPic{
            padding: 20rpx 0 10rpx 0;
            box-sizing: border-box;
            border-bottom: 1px solid #ccc;
        }
        .reportRecordHeader{
            display: flex;
            justify-content: space-between;
            align-content: center;
            .reportRecordTitle{
                color: #333;
                font-weight: 600;
                font-size: 34rpx;
            }
            .reportRecordDetermine{
                color: #0091ff;
            }
        }

        
        .van-cell{
            padding: 0;
            padding-top: 10rpx;
            box-sizing: border-box;
        }
        .serviceDescription{
            margin-top: 15rpx;
            .serviceDescriptionTitle{
                color: #333;
            }
            .serviceDescriptionRemark{
                color: #ccc;
                height: 200rpx !important;
            }
        }
    }
}
</style>