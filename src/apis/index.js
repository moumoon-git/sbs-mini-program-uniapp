import request from '../utils/request/request.js';

/************************************  城管巡查项目start  *****************************************/
// 巡查项目列表
export const getIinvestigation = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
    ...data,
  };
  return request.post({
    url: '/investigation/investigationTask/selectTaskListByOpenId',
    data: requestData,
  });
};

// 查询巡查任务的项目列表
export const getInvestigationById = (id) => {
  const requestData = {
    id,
  };
  return request.get({
    url: '/investigation/investigationTask/infoById',
    data: requestData,
  });
};

// 巡查的任务详情列表
export const getInvestigationByCodeNum = (codeNum, taskId) => {
  const requestData = {
    codeNum,
    taskId,
    openId: wx.getStorageSync('openId'),
  };
  return request.get({
    url: '/investigation/investigationPoint/infoByCodeNum',
    data: requestData,
  });
};

// 搜索巡查记录
export const searchInvestigationRecord = (data) => {
  const requestData = {
    ...data,
  };
  return request.post({
    url: '/investigation/investigationTask/patrolRecord',
    data: requestData,
  });
};

// 保存巡查项目
export const saveInstanceInfor = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
  };
  Object.assign(requestData, data);
  return request.post({
    url: '/investigation/instanceInfor/save',
    data: requestData,
  });
};

// 修改巡查项目
export const updateInstanceInfor = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
  };
  Object.assign(requestData, data);
  return request.post({
    url: '/investigation/instanceInfor/update',
    data: requestData,
  });
};

// 更新巡查项目列表
export const updateInstanceInforList = (id) => {
  return request.get({
    url: `/investigation/instanceInfor/info/${id}`,
  });
};

// 提交巡查项目
export const submitInvestigation = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
  };
  Object.assign(requestData, data);
  return request.post({
    url: '/investigation/instanceInfor/saveAll',
    data: requestData,
  });
};
// 获取检查清单数据
export const getCheckList = (id) => {
  return request.get({
    url: `/garbageSorting/instanceInfor/detail/${id}`,
  });
};
/************************************  城管巡查项目end  *****************************************/

/************************************  垃圾分类巡查项目start  *****************************************/
// 巡查项目列表
export const getGarbageSortingIinvestigation = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
    ...data,
  };
  return request.post({
    url: '/garbageSorting/investigationTask/selectTaskListByOpenId',
    data: requestData,
  });
};

// 获取操作历史
export const getBrowseHistory = (taskId) => {
  return request.post({
    url: `/garbageSorting/investigationTask/point/getBrowseHistory`,
    data: {
      taskId,
    },
  });
};

// 生成操作历史
export const createBrowseHistory = (data) => {
  return request.post({
    url: `/garbageSorting/investigationTask/point/createBrowseHistory`,
    data,
  });
};

// 查询巡查任务的项目列表
export const getGarbageSortingInvestigationById = (id) => {
  const requestData = {
    id,
  };
  return request.get({
    url: '/garbageSorting/investigationTask/taskinfoById',
    data: requestData,
  });
};

// 查询巡查任务的点列表 分页
export const getGarbageSortinglistPageByTaskId = (requestData) => {
  return request.post({
    url: '/garbageSorting/point/listPageByTaskId',
    data: requestData,
  });
};

// 巡查的任务详情列表
export const getGarbageSortingInvestigationByCodeNum = (codeNum, taskId) => {
  const requestData = {
    codeNum,
    taskId,
    openId: wx.getStorageSync('openId'),
  };
  return request.get({
    url: '/garbageSorting/point/infoByCodeNum',
    data: requestData,
  });
};

// 搜索巡查记录
export const searchGarbageSortingInvestigationRecord = (data) => {
  const requestData = {
    ...data,
  };
  return request.post({
    url: '/garbageSorting/point/recordByTaskId',
    data: requestData,
  });
};
// 查看巡查记录详情
export const getInspeCtionHistory = (data) => {
  const requestData = {
    ...data,
  };
  return request.get({
    url: '/garbageSorting/investigationTask/getInspectRecords?',
    data: requestData,
  });
};
// 保存巡查项目
export const saveGarbageSortingInstanceInfor = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
  };
  Object.assign(requestData, data);
  return request.post({
    url: '/garbageSorting/instanceInfor/save',
    data: requestData,
  });
};

// 修改巡查项目
export const updateGarbageSortingInstanceInfor = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
  };
  Object.assign(requestData, data);
  return request.post({
    url: '/garbageSorting/instanceInfor/update',
    data: requestData,
  });
};

// 更新巡查项目列表
export const updateGarbageSortingInstanceInforList = (id) => {
  return request.get({
    url: `/garbageSorting/instanceInfor/info/${id}`,
  });
};

// 提交巡查项目
export const submitGarbageSortingInvestigation = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
  };
  Object.assign(requestData, data);
  return request.post({
    url: '/garbageSorting/instanceInfor/saveAll',
    data: requestData,
  });
};

// 获取菜单权限列表
export const getMenuByCode = (code) => {
  return request.get({
    url: '/mail/mailcontactor/getMenuByCode',
    data: { code },
  });
};

// 获取点信息
export const getHeaderInfo = (codeNum, pointTypeNum) => {
  return request.post({
    url: '/garbageSorting/point/getPointByCodeNum',
    data: { codeNum, pointTypeNum },
  });
};

/************************************  垃圾分类巡查项目end  *****************************************/

/************************************  问题报告start  *****************************************/
// 获取问题区域列表树
export const getInvestigationTaskGroupListTree = () => {
  return request.get({
    url: '/investigation/investigationTaskGroup/listTree',
  });
};

// 获取问题类型列表树
export const getInvestigationGroupListTree = () => {
  return request.get({
    url: '/investigation/investigationGroup/listTree',
  });
};

// 确认提交上报
export const saveProblemReporting = (data) => {
  return request.post({
    url: '/investigation/problemreporting/save',
    data,
  });
};
/************************************  问题报告end  *****************************************/

/************************************  垃圾分类问题报告start  *****************************************/
// 获取问题区域列表树
export const getGarbageSortingTaskGroupListTree = () => {
  return request.get({
    url: '/garbageSorting/group/listTree',
  });
};

// 获取问题类型列表树
export const geGarbageSortingGroupListTree = () => {
  return request.get({
    url: '/work/workProperty/tree',
    data: { module: 1, platformId: wx.getStorageSync('platformId') },
  });
};

//获取隐患类型
export const getListTree = () => {
  return request.get({
    url: '/disasterMitigation/ledgerType/listTree',
  });
};
//获取隐患来源值
export const getHiddenSourceId = () => {
  return request.get({
    url: '/disasterMitigation/hiddenLedger/getHiddenSourceId',
  });
};
//保存隐患数据
export const handleSave = (data) => {
  return request.post({
    url: `/disasterMitigation/hiddenLedger/save`,
    data
  });
}
//获取上报记录
export const handleListPage = (data) => {
  return request.post({
    url: `/disasterMitigation/hiddenLedger/listPage`,
    data
  });
}

/************************************  垃圾分类问题报告end  *****************************************/

/************************************  打卡签到start  *****************************************/
// 城管获取巡查点列表
export const getCGWxPointList = (data,header) => {
  return request.post({
    url: `/investigation/investigationPoint/wxPointList`,
    header,
    data
  });
};

// 垃圾分类获取巡查点列表
export const getLJWxPointList = (search) => {
  return request.post({
    url: `/garbageSorting/investigationTask/pointList`,
    data: {
      search,
    },
  });
};

// 打卡签到保存
export const saveSignIn = (data) => {
  return request.post({
    url: `/garbageSorting/garbageSortingPunchIn/save`,
    data,
  });
};

// 打卡签到记录列表
export const getRecordList = () => {
  return request.post({
    url: `/garbageSorting/garbageSortingPunchIn/listByOne`,
  });
};
// 获取签到记录
export const getSignecord = (data) => {
  const requestData = {
    ...data,
  };
  return request.post({
    url: `/garbageSorting/garbageSortingPunchIn/list`,
    data: requestData,
  });
};
// 获取签到详情
export const getSignDetail = (data) => {
  const requestData = {
    ...data,
  };
  return request.post({
    url: `/garbageSorting/garbageSortingPunchIn/listByContactor`,
    data: requestData,
  });
};
// 打卡签到记录详情
export const getRecordDeatail = (id) => {
  return request.get({
    url: `/garbageSorting/garbageSortingPunchIn/info/${id}`,
  });
};

/************************************  打卡签到end  *****************************************/

/************************************  收桶打卡签到start  *****************************************/

//获取所有人打卡记录
export const getClockInRecord = (data) => {
  return request.post({
    url: `/garbageSorting/clockIn/listByDate`,
    data,
  });
};

// 获取当前打卡人的当天打卡记录
export const getClockInRecordByPoint = (data) => {
  return request.get({
    url: `/garbageSorting/clockIn/listByPoint`,
    data,
  });
};

//打卡
export const saveClockIn = (data) => {
  return request.post({
    url: `/garbageSorting/clockIn/save`,
    data,
  });
};
/************************************  收桶打卡签到end  *****************************************/
/************************************  垃圾收运登记start  *****************************************/
//获取垃圾收运列表数据
export const getWasteCollection = (data) => {
  return request.post({
    url: `/garbage/kitchenRegister/listPage`,
    data,
  });
};

//保存收运内容
export const saveKitchenRegister = (data) => {
  return request.post({
    url: `/garbage/kitchenRegister/save`,
    data,
  });
};

/************************************  垃圾收运登记end  *****************************************/

/************************************  投诉建议start  *****************************************/
// 获取推广图片
export const getBannerPictures = (platformId) => {
  return request.get({
    url: `/garbageSorting/point/getPropaganda`,
    data: { platformId },
  });
};
// 提交建议
export const saveComplaintsSuggestions = (data) => {
  return request.post({
    url: `/garbageSorting/complaintsSuggestions/save`,
    data,
  });
};

/************************************  投诉建议end  *****************************************/

/************************************  账号注册 start *****************************************/
//获取平台标题
export const getPlatformTitle = (userId) => {
  return request.get({
    url: `/sys/platform/queryByUserId`,
    data: { userId },
  });
};

// 账号注册
export const getRegister = (data) => {
  return request.post({
    url: `/mail/mailcontactor/wxSaveOutreachContacts`,
    data,
  });
};
// 新增用户需调用的接口
export const getOutreachContactsRole = (codeNum) => {
  return request.get({
    url: `/mail/mailcontactor/getOutreachContactsRole/${codeNum}`,
  });
};
//判断有没有邀请权限
export const getContactsRole = (codeNum) => {
  return request.get({
    url: `/mail/mailcontactor/getContactsRole/${codeNum}`,
  });
};

/************************************  账号注册end  *****************************************/

/************************************  问题上报 start *****************************************/
//获取问题类型数据
export const getAreaTree = () => {
  return request.get({
    url: `/reporting/type/listTree`,
  });
};
//获取整改类型数据
export const getRectificationType = (data, header) => {
  return request.post({
    url: `/reporting/reportingDictionaryByCode`,
    header,
    data,
  });
};
//保存问题上报
export const getReportData = (data) => {
  return request.post({
    url: `/reporting/save`,
    data,
  });
};
//获取学校或企业数据
export const getSchoolData = (data, header) => {
  return request.post({
    url: `/reporting/schoolCompany/listAll`,
    header,
    data,
  });
};

//获取问题上报详情
export const getReportingDetail = (id) => {
  return request.get({
    url: `/reporting/info/${id}`,
  });
};

//获取问题上报详情
export const updateStatus = (data) => {
  return request.post({
    url: `/reporting/updateStatus`,
    data,
  });
};
export const getSublevel=(data)=>{
  return  request.get({
    url:`/reporting/type/getChildrenTypeById?id=${data}`,
  })
}

/************************************  问题上报  *****************************************/
// 工单选择
export const getWechatListByChargeMan = () => {
  return request.post({
    url: `/work/workSheet/getWechatListByChargeMan`,
    data: {
      page: 1,
      limit: 1000,
      groupIds: [],
      startTime: '',
      endTime: '',
      module: '',
      property: '',
      status: '0',
      type: '',
      search: '',
    },
  });
};

/************************************  志愿服务 start *****************************************/

//获取自己服务数
export const getFrequency = () => {
  return request.get({
    url: `/disasterMitigation/serviceRequirements/getFrequency`,
  });
};

//获取平台的待服务需求
export const getPendingService = (data) => {
  return request.post({
    url: `/disasterMitigation/serviceRequirements/getPendingService`,
    data,
  });
};

//获取平台的服务需求列表 / 服务清单
export const getServiceRequirementsListPage = (data) => {
  return request.post({
    url: `/disasterMitigation/serviceRequirements/listPage`,
    data,
  });
};

//获取平台的服务需求列表 / 服务清单
export const getServiceRequirementsInfo = (infoObj) => {
  return request.get({
    url: `/disasterMitigation/serviceRequirements/info/${infoObj.requireId}?lng=${infoObj.longitude}&lat=${infoObj.latitude}`,
  });
};

//获取上报记录列表
export const getServiceRecord = (data) => {
  return request.post({
    url: `/disasterMitigation/serviceRecord/listPage`,
    data,
  });
};

//更改服务状态
export const changeStatus = (data) => {
  return request.post({
    url: `/disasterMitigation/serviceRequirements/changeStatus`,
    data,
  });
};


//保存上报记录
export const serviceRecordSave = (data) => {
  return request.post({
    url: `/disasterMitigation/serviceRecord/save`,
    data,
  });
};

/************************************  志愿服务 end  *****************************************/

/************************************  任务管理 start *****************************************/
// 获取任务管理总数
export const getCount = (data) => {
  return request.post({
    url: `/disasterMitigation/taskInstance/applet/count`,
    data
  });
};
//获取任务管理进行中、已完成列表数据-分页
export const getListAll = (data) => {
  return request.post({
    url: `/disasterMitigation/taskInstance/applet/listPage`,
    data
  });
};

//获取任务清单数据-分页
export const getDetailedAccount = (data) => {
  return request.post({
    url: `/disasterMitigation/task/listPage`,
    data
  });
};
//获取任务管理详情
export const getDetailed= (id,user) => {
  return request.get({
    url: `/disasterMitigation/taskInstance/info/${id}?user=${user}`,
  });
};
//获取风险隐患、脆弱人群列表

export const getListPage= (data) => {
  return request.post({
    url: `/disasterMitigation/taskInstanceInfor/listPage`,
    data
  });
};

//获取巡查记录
export const getPatrolRecord= (data) => {
  return request.post({
    url: `/disasterMitigation/taskInstanceInforRecord/listByInforId`,
    data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
  });
};
//获取风险隐患详情
export const getDangerList= (id) => {
  return request.get({
    url: `/disasterMitigation/hiddenLedger/info/${id}`,
  });
};
//获取脆弱人群详情
export const getCareList= (id) => {
  return request.get({
    url: `/disasterMitigation/dmpCaringPeople/info/${id}`,
  });
};

//提交任务记录
export const handleSaveList= (data) => {
  return request.post({
    url: `/disasterMitigation/taskInstanceInforRecord/save`,
    data,
  });
};
//任务启动/停止
export const handleSwitch= (data) => {
  return request.post({
    url: `/disasterMitigation/task/updateStatus`,
    data,
  });
};

/************************************  任务管理 end *****************************************/

/************************************  关爱互助 start  *****************************************/
//获取关爱互助本人发布的需求
export const getSelfPublish= (id) => {
  return request.get({
    url: `/disasterMitigation/serviceRequirements/getSelfPublish`,
  });
};
//关爱互助取消服务
export const handleDelete= (data) => {
  return request.post({
    url: `/disasterMitigation/serviceRequirements/changeStatus`,
    data
  });
};
//用户选择的需求类型数据
export const getSysDictionaryListByCode= () => {
  return request.get({
    url: `/sys/sysdictionary/getSysDictionaryListByCode?code=service_requirements_type`,
  });
};

//添加脆弱人群
export const getPeopleList= (data) => {
  return request.post({
    url: `/disasterMitigation/dmpCaringPeople/getPeopleList`,
    data
  });
};

//发布需求
export const getServiceRequirements= (data) => {
  return request.post({
    url: `/disasterMitigation/serviceRequirements/save`,
    data
  });
};
//获取小程序历史发布用户
export const getReleaseHistoryUser= () => {
  return request.get({
    url: `/disasterMitigation/serviceRequirements/getReleaseHistoryUser`,
  });
};
//
//校验求助人员是否已存在未完成需求
export const getServiceRequirementsCheck= (data) => {
  return request.get({
    url: `/disasterMitigation/serviceRequirements/check`,
    data
  });
};
/************************************  关爱互助 end  *****************************************/

/************************************  宣传公告 start  *****************************************/
//获取宣传公告tabs
export const getInformationType= () => {
  return request.get({
    url: `/sys/sysdictionary/getSysDictionaryListByCode?code=information_type`,
  });
};

//获取宣传公告数据列表
export const getPublicityEducationData= (data) => {
  return request.post({
    url: `/disasterMitigation/publicityEducation/applet/listPage`,
    data
  });
};
//获取通知总数
export const getNoticeCount= () => {
  return request.get({
    url: `/appManagement/smallRoutine/noticeCount`,
  });
};



/************************************  宣传公告 end  *****************************************/