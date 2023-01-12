/*
* vendor設置，單獨分離 token,語言等 環境配置
*
* 在各產品/語言端，視實際狀況修改
*/

import {fetchRequest} from "../SportRequest";
import {ApiPort} from "../SPORTAPI";
import {vendorStorage} from "./vendorStorage";

//語言配置
export const vendorSettings = {
  LanguageCode: 'zh',  //中文
  //LanguageCode: 'en',  //英文
  //LanguageCode: 'vi',  //越南
  //LanguageCode: 'th',  //泰文
  //LanguageCode: 'in',  //印尼
}

//從gateway獲取登入token
export const getTokenFromGatewayImpl = (vendorInstance, sbt = true,brandname = 'fun88') => {
  vendorInstance.loginPromise =  new Promise(function (resolve, reject) {
    let hostname = '';
    if (brandname === 'jbo') {
      hostname = 'imnative';
    }

    if (brandname === 'fun88') {
      hostname = 'imnative';
    }

    const requestUrl = sbt ? ApiPort.GETSBTToken : ApiPort.GETBTIToken;

    fetchRequest(requestUrl + 'hostname=' + hostname + '&', 'GET')
      .then((data) => {

        //console.log('BTI token', data);

        if (data.isGameLocked) {
          vendorInstance.isGameLock = true;
          vendorInstance.loginPromise = null; //結束前清理掉
          reject('gameIsLoecked');
          return;
        } else {
          vendorInstance.isGameLock = false;
        }
        if (data.token) {
          vendorStorage.setItem(
            "BTI_Token",
            JSON.stringify(data.token)
          );

          let memberCode = ''
          if (brandname === 'jbo') {
            memberCode = data.playerId;
          }

          if (brandname === 'fun88') {
            memberCode = data.memberCode;
          }

          vendorStorage.setItem(
            "BTI_MemberCode",
            JSON.stringify(memberCode)
          );

          //調用BTI接口獲取jwt
          vendorInstance.BTILogin(data.token)
            .then(r => {
              vendorInstance.loginPromise = null; //結束前清理掉
              resolve( { token: data.token, jwt: r});
            })
            .catch(e =>{
              vendorInstance.loginPromise = null; //結束前清理掉
              reject('bti login error');
            });
        } else {
          vendorInstance.loginPromise = null; //結束前清理掉
          reject('no token?');
        }
      })
      .catch((error) => {
        vendorInstance.loginPromise = null; //結束前清理掉
        reject(error);
      })
  });

  return vendorInstance.loginPromise;
}

