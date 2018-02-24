//工具方法
import { setCookie, getCookie,delCookie} from './cookieop'
// 校验是否是手机号
function mailboxvalidation(val) {
        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(val)) {
            return false;
        } else {
            return true;
        }
    }

//element ui验证方法
function checktelnum(rule, value, callback) {
    // console.log(1)
    if (!value) {
        return callback(new Error('手机号不能为空'));
    }
    if (!mailboxvalidation(value)) {
        callback(new Error('请输入正确手机号'));
        return;
    }
    callback();
}

function checkusername(rule, value, callback) {
    // console.log(1)
    if (!value) {
        return callback(new Error('姓名不能为空'));
    }
    callback();
}

function checkusernamelogin(val){
    if(!val){
        return false;
    }
    return true;
}

function checkfilename(rule, value, callback){
    if (!value) {
        return callback(new Error('姓名不能为空'));
    }
    callback();
}

let auth = {
    // areaCode: userinfo.areaCode,//如果是超级管理员是any
    // areaName: userinfo.areaName,
    // username: userinfo.name,
    // userid: userinfo.userId,
    // jurisdiction: userinfo.authorityLevel
    isLogin() {
        return !!getCookie('userid');
    },
    loginIn(userinfo) {
        setCookie('userid',userinfo.id);
        setCookie('areaCode',userinfo.areaCode);
        setCookie('username',userinfo.name);
        setCookie('jurisdiction',userinfo.authorityLevel);
        setCookie('phone',userinfo.phone);
    },
    getLoginInfo(){
        return {
            userid:getCookie('userid'),
            areaCode:getCookie('areaCode'),
            username:getCookie('username'),
            jurisdiction:getCookie('jurisdiction'),
            phone:getCookie('phone')
        }
    },
    logOut() {
        delCookie('userid');
        delCookie('areaCode');
        delCookie('username');
        delCookie('jurisdiction');
        delCookie('phone');
    }
}


function conventJurisdiction(val){
    let jurisdictionName=['超级管理员','地区管理员','地区使用者'];
    return jurisdictionName[val];
}

//格式化日期
function normalTime(date){
  if(date) {
    let oDate=new Date();
    oDate.setTime(date);
    let Y = oDate.getFullYear() + '-';
    let M = (oDate.getMonth() + 1 < 10 ? '0' + (oDate.getMonth() + 1) : oDate.getMonth() + 1) + '-';
    let D = (oDate.getDate() < 10 ? '0' + (oDate.getDate()) : oDate.getDate()) + ' ';
    let h = (oDate.getHours() < 10 ? '0' + oDate.getHours() : oDate.getHours()) + ':';
    let m = (oDate.getMinutes() < 10 ? '0' + oDate.getMinutes() : oDate.getMinutes()) + ':';
    let s = (oDate.getSeconds() < 10 ? '0' + oDate.getSeconds() : oDate.getSeconds());
    return Y + M + D + h + m + s;
  }
}
// 格式化大小
function toSize(val){
  console.log(val.fileSize);
  let fileSizeByte = val.fileSize*1024;
  let fileSizeMsg = "";
  // console.log(fileSizeByte);
  if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
  else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
  else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
  else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
  else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  else fileSizeMsg = "文件超过1TB";
  return fileSizeMsg;
}
function toFileSize(val){
    console.log(val.fileSize);
    let fileSizeByte = val.fileSize*1024;
    let fileSizeMsg = "";
    // console.log(fileSizeByte);
    if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
    else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
    else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
    else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
    else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    else fileSizeMsg = "文件超过1TB";
    if(fileSizeMsg == '0.00KB'){
        fileSizeMsg = '-'
    }
    return fileSizeMsg;
}
// 文件类型文字
function toType(val) {
  let level = val.fileType;
  switch (level) {
    case 0:
      return 'pdf';
      break;
    case 1:
      return 'mp4';
      break;
  }
}
export {
    mailboxvalidation,
    checktelnum,
    checkusername,
    auth,
    normalTime,
    checkusernamelogin,
    checkfilename,
    conventJurisdiction,
    toType,
    toSize,
    toFileSize
}
