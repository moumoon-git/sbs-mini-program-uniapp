/*
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-26 15:39:29
 * @LastEditTime: 2022-03-26 15:58:34
 */
/**
    * @description:设置标签
    * @param {Array} arr 要处理的标签数组
    */
export function getLabel(arr) {
    console.log(arr,'数据')
    const colorArr = ["#0091FF", "#FF7A45", "#685FCF", "#0BD295"];
    const backgroundArr = ["#E6EFFF", "#FFBB96", "#E9EDFF", "#D6FBEF"];
    let topicArr =devertSrcArr(arr, 4);
    topicArr.forEach((item) => {
        item.forEach((item2, index) => {
            item2.color = colorArr[index];
            item2.background = backgroundArr[index];
        });
    });
    return (topicArr = topicArr.flat(2));
}
/**
 * @description:要处理的数组长度
 * @param {Array} arr 要处理的数组
 *  @param {Number} num 要获取的数组长度
 */
function devertSrcArr(arr, num) {
    const result = [];
    for (let i = 0; i < arr.length; i += num) {
        result.push(arr.slice(i, i + num));
    }
    return result;
}
