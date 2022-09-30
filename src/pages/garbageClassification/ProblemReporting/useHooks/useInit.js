/*
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-03 13:49:29
 * @LastEditTime: 2022-05-11 10:16:47
 */

import { reactive, ref } from "vue";
const dataFormMap = reactive(
    {
        // 市容
        CITY_APPEARANCE: {
            typeId: "",//一级类型id
            profile: '', //问题简况
            secondaryTypeIds: [], //二级类型id数组
            allCheckedList: [],
            typeNames: '',
            areaId: "", //区域id
            handleId: '',//整改类型
            place: '',//位置
            longitude: "",
            latitude: '',
            attachments: [], //	附件数组
            belongTo: "", //是	归属于（0：上报，1：草稿箱）
            beforeAttachment:[],
            middleAttachment:[],
            afterAttachment:[],
            paperworkAttachment:[],
            typeCode:'',
            typeName: '',//一级问题类型名称
            tempBeforeAttachment:[],
            tempMiddleAttachment:[],
            tempAfterAttachment:[],
            tempPaperworkAttachment:[]
            
        },
        //工地类
        SITE_CLASS: {
            typeId: "",//一级类型id
            areaId: "", //区域id
            handleId: '',//整改类型
            secondaryTypeIds: [], //二级类型id数组
            place: '',//位置
            longitude: "",
            latitude: '',
            completeMudOut: '',//是否完成出泥 （0：否，1：是）
            existingProblems: '',//是否存在问题 （0：否，1：是）
            profile: '', //问题简况
            allCheckedList: [],
            typeNames: '',
            workSite: '',//工地名称
            attachments: [], //	附件数组
            belongTo: "", //是	归属于（0：上报，1：草稿箱
            beforeAttachment:[],
            middleAttachment:[],
            afterAttachment:[],
            paperworkAttachment:[],
            tempBeforeAttachment:[],
            tempMiddleAttachment:[],
            tempAfterAttachment:[],
            tempPaperworkAttachment:[],
            typeCode:'',
            typeName: '',//一级问题类型名称
        },
        //校园
        CAMPUS_PERIMETER: {
            schoolCompanyId: '',//学校id
            areaId: "", //区域id
            handleId: '',//整改类型
            profile: '', //问题简况
            allCheckedList: [],
            typeNames: '',
            typeId: "",//一级类型id
            secondaryTypeIds: [], //二级类型id数组
            place: '',//位置
            longitude: "",
            latitude: '',
            attachments: [], //	附件数组
            belongTo: "", //是	归属于（0：上报，1：草稿箱）
            beforeAttachment:[],
            middleAttachment:[],
            afterAttachment:[],
            paperworkAttachment:[],
            tempBeforeAttachment:[],
            tempMiddleAttachment:[],
            tempAfterAttachment:[],
            tempPaperworkAttachment:[],
            typeCode:'',
            typeName: '',//一级问题类型名称
        },
        //建筑废弃物
        CONSTRUCTION_WASTE: {
            areaId: "", //区域id
            handleId: '',//整改类型
            typeId: "",//一级类型id
            secondaryTypeIds: [], //二级类型id数组
            unlicensedCarNumber: 1,//扣押无证车辆台数
            profile: '', //问题简况
            allCheckedList: [],
            typeNames: '',
            place: '',//位置
            longitude: "",
            latitude: '',
            attachments: [], //	附件数组
            belongTo: "", //是	归属于（0：上报，1：草稿箱）
            beforeAttachment:[],
            middleAttachment:[],
            afterAttachment:[],
            paperworkAttachment:[],
            tempBeforeAttachment:[],
            tempMiddleAttachment:[],
            tempAfterAttachment:[],
            tempPaperworkAttachment:[],
            typeCode:'',
            typeName: '',//一级问题类型名称
        },
        //户外广告（招牌）
        UTDOOR_ADVERTISING: {
            typeId: "",//一级类型id
            secondaryTypeIds: [], //二级类型id数组
            kindId: '',//种类形式id
            situationId: '',//现状描述id
            specs: 1,//规格尺寸
            publishContent: '',//发布内容
            propertyRight: '',//产权单位
            contactInformation: '',//联系方式
            rectificationTime: '',//整改结束时间
            allCheckedList: [],
            typeNames: '',
            attachments: [], //	附件数组
            place: '',//位置
            longitude: "",
            latitude: '',
            belongTo: "", //是	归属于（0：上报，1：草稿箱）
            beforeAttachment:[],
            middleAttachment:[],
            afterAttachment:[],
            tempBeforeAttachment:[],
            tempMiddleAttachment:[],
            tempAfterAttachment:[],
            typeCode:'',
            typeName: '',//一级问题类型名称
        },
        //燃气执法
        GAS_LAW_ENFORCEMENT: {
            typeId: "",//一级类型id
            secondaryTypeIds: [], //二级类型id数组
            upplyGasModeId: '',//供气方式id
            schoolCompanyId: '',//学校id
            rectificationTime: '',//整改结束时间
            ubscriberDeletionTime: '',//销号时间
            propertyRight: '',//产权单位
            contactInformation: '',//联系方式
            profile: '', //问题简况
            allCheckedList: [],
            typeNames: '',
            attachments: [], //	附件数组
            place: '',//位置
            longitude: "",
            latitude: '',
            belongTo: "", //是	归属于（0：上报，1：草稿箱）
            supplyName: '',//供气方式
            beforeAttachment:[],
            middleAttachment:[],
            afterAttachment:[],
            paperworkAttachment:[],
            tempBeforeAttachment:[],
            tempMiddleAttachment:[],
            tempAfterAttachment:[],
            tempPaperworkAttachment:[],
            typeCode:'',
            typeName: '',//一级问题类型名称
        },
        //垃圾分类
        REFUSE_CLASSIFICATION: {
            typeId: "",//一级类型id
            areaId: "", //区域id
            handleId: '',//整改类型
            secondaryTypeIds: [], //二级类型id数组
            place: '',//位置
            longitude: "",
            latitude: '',
            existingProblems: '',//是否存在问题 （0：否，1：是）
            profile: '', //问题简况
            allCheckedList: [],
            typeNames: '',
            workSite: '',//检查单位
            attachments: [], //	附件数组
            belongTo: "", //是	归属于（0：上报，1：草稿箱
            beforeAttachment:[],
            middleAttachment:[],
            afterAttachment:[],
            paperworkAttachment:[],
            tempBeforeAttachment:[],
            tempMiddleAttachment:[],
            tempAfterAttachment:[],
            tempPaperworkAttachment:[],
            typeCode:'',
            typeName: '',//一级问题类型名称
            fine:'',//罚款金额
        },
        //其他
        OTHER: {
            typeId: "",//一级类型id
            profile: '', //问题简况
            secondaryTypeIds: [], //二级类型id数组
            allCheckedList: [],
            typeNames: '',
            areaId: "", //区域id
            handleId: '',//整改类型
            place: '',//位置
            longitude: "",
            latitude: '',
            attachments: [], //	附件数组
            belongTo: "", //是	归属于（0：上报，1：草稿箱）
            beforeAttachment:[],
            middleAttachment:[],
            afterAttachment:[],
            paperworkAttachment:[],
            tempBeforeAttachment:[],
            tempMiddleAttachment:[],
            tempAfterAttachment:[],
            tempPaperworkAttachment:[],
            typeCode:'',
            typeName: '',//一级问题类型名称
        },
    }
);

const showIndex = ref(-1);

const initDataFormMap=(data)=>{
   for (let i in dataFormMap[data]) {
       if(Array.isArray(dataFormMap[data][i])  ) {
        dataFormMap[data][i] = [];
       }else {
        dataFormMap[data][i] = '';

       }
  }
}

export default () => {
    return {
        dataFormMap,
        showIndex,
        initDataFormMap,
    }
}