/*
 * @Author: your name
 * @Date: 2021-12-02 10:40:10
 * @LastEditTime: 2021-12-02 16:06:38
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sbs-mini-program-uniapp\src\pages\garbageClassification\siginByMap\components\SignRecord\tool\comm.js
 */

// 获取当前的之前的时间
export function funGetDateStr(count) {
    let tempObj = {
        nowTime: '',
        startTime: '',
        endTime: ''
    }
    let currentDate = new Date(); //当前日期
    let tempTime = currentDate.getDate();
    currentDate.setDate(tempTime + count); //获取p_count天后的日期
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; //获取当前月份的日期
    const day = currentDate.getDate();
    tempObj = {
        nowTime: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
            }`,
        startTime: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
            }`,
        endTime: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
            }`
    }
    return tempObj;

}
/**
 * 获得相对当月AddMonthCount个月的起止日期
 * AddMonthCount为0 代表当月 为-1代表上一个月 为1代表下一个月 以此类推
 * ***/
export function getCurrentMonth(AddMonthCount) {
    let tempObj = {
        monthTime: '',
        startYear: '',
        endYear: ''
    }
    //获取当前时间
    let currentDate = new Date();
    let month = currentDate.getMonth() + AddMonthCount;
    if (month < 0) {
        const n = parseInt(-month / 12);
        month += n * 12;
        currentDate.setFullYear(currentDate.getFullYear() - n);
    }
    currentDate = new Date(currentDate.setMonth(month));
    //获得当前月份0-11
    const currentMonth = currentDate.getMonth();
    //获得当前年份4位年
    const currentYear = currentDate.getFullYear();
    //获得上一个月的第一天
    const currentMonthFirstDay = new Date(currentYear, currentMonth, 1);
    //获得上一月的最后一天
    const currentMonthLastDay = new Date(currentYear, currentMonth + 1, 0);
    tempObj = {
        monthTime: `${currentMonthLastDay.getFullYear()}.${currentMonthLastDay.getMonth() + 1}`,
        startMonth: `${getDateStr(currentMonthFirstDay)}`,
        endMonth: `${getDateStr(currentMonthLastDay)}`
    }
    return tempObj;

}
/**
 * 获得相对当前周AddWeekCount个周的起止日期
 * AddWeekCount为0代表当前周  为-1代表上一个周  为1代表下一个周以此类推
 * **/
export function getMonthDate(AddWeekCount) {
    let monthDate = {
        weekDate: '',
        startWeek: "",
        endWeek: "",
    };
    //一天的毫秒数
    let millisecond = 1000 * 60 * 60 * 24;
    //获取当前时间
    let currentDate = new Date();
    //相对于当前日期AddWeekCount个周的日期
    currentDate = new Date(
        currentDate.getTime() + millisecond * 7 * AddWeekCount
    );
    //返回date是一周中的某一天
    let week = currentDate.getDay();
    //返回date是一个月中的某一天
    let month = currentDate.getDate();
    //减去的天数
    let minusDay = week != 0 ? week - 1 : 6;
    //获得当前周的第一天
    let currentWeekFirstDay = new Date(
        currentDate.getTime() - millisecond * minusDay
    );
    //获得当前周的最后一天
    let currentWeekLastDay = new Date(
        currentWeekFirstDay.getTime() + millisecond * 6
    );
    let weekData = `${currentWeekFirstDay.getFullYear()}.${currentWeekFirstDay.getMonth() + 1
        }.${currentWeekFirstDay.getDate()}-${currentWeekLastDay.getMonth() + 1
        }.${currentWeekLastDay.getDate()}`;

    monthDate = {
        weekDate: weekData,
        startWeek: getDateStr(currentWeekFirstDay),
        endWeek: getDateStr(currentWeekLastDay),
    };

    return monthDate;

}

export function getCurrentWeek() {
    let obj = {
        year: '',
        month: '',
        day: '',
        start: '',
        end: '',
    }
    //获取当前时间
    let currentDate = new Date();
    //返回date是一周中的某一天
    let week = currentDate.getDay();
    //返回date是一个月中的某一天
    let month = currentDate.getDate();
    //一天的毫秒数
    let millisecond = 1000 * 60 * 60 * 24;
    //减去的天数
    let minusDay = week != 0 ? week - 1 : 6;
    //alert(minusDay);
    //本周 周一
    let monday = new Date(currentDate.getTime() - (minusDay * millisecond));
    //本周 周日
    let sunday = new Date(monday.getTime() + (6 * millisecond));
    let startYear = monday.getFullYear();
    let startMonth = monday.getMonth() + 1;
    let startDay = monday.getDate();
    let endYear = sunday.getFullYear();
    let endMonth = sunday.getMonth() + 1;
    let endDay = sunday.getDate();
    let outputTime = startYear + '.' + add0(startMonth) + '.' + add0(startDay);
    let exportTime = add0(endMonth) + '.' + add0(endDay)
    let start = startYear + '-' + add0(startMonth) + '-' + add0(startDay);//开始
    let end = endYear + '-' + add0(endMonth) + '-' + add0(endDay);//结束
    obj = {
        time: `${outputTime}-${exportTime}`,
        start: start,
        end: end,
    }
    return obj;
}

function add0(m) {
    return m < 10 ? '0' + m : m
};
/**
 * @param {Number} date,添加的个数
 * @description 获取当前日期yy-mm-dd
 */
function getDateStr(date) {
    let year = "";
    let month = "";
    let day = "";
    let now = date;
    year = "" + now.getFullYear();
    if (now.getMonth() + 1 < 10) {
        month = "0" + (now.getMonth() + 1);
    } else {
        month = "" + (now.getMonth() + 1);
    }
    if (now.getDate() < 10) {
        day = "0" + now.getDate();
    } else {
        day = "" + now.getDate();
    }
    return year + "-" + month + "-" + day;
}
/*
 * @param
 * @description 获取当天的年月日
*/
export function presentTime() {
    let year = "";
    let month = "";
    let day = "";
    let now = new Date();
    year = "" + now.getFullYear();
    if (now.getMonth() + 1 < 10) {
        month = "0" + (now.getMonth() + 1);
    } else {
        month = "" + (now.getMonth() + 1);
    }
    if (now.getDate() < 10) {
        day = "0" + now.getDate();
    } else {
        day = "" + now.getDate();
    }
    return year + "-" + month + "-" + day;
}
/*
 * @param
 * @description 获取当前月份的第一天和最后一天
*/
export function nowMonth() {
    let nowdays = new Date();
    let year = nowdays.getFullYear();
    let month = nowdays.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    let firstDayOfCurMonth = `${year}-${month}-01`;
    let lastDay = new Date(year, month, 0);
    let lastDayOfCurMonth = `${year}-${month}-${lastDay.getDate()}`;
    let tempObj = {
        firstDayOfCurMonth: firstDayOfCurMonth,
        lastDayOfCurMonth: lastDayOfCurMonth,
    }
    return tempObj

}