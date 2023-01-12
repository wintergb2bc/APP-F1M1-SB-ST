/*
* vendor設置，單獨分離 token,語言等 環境配置
*
* 在各產品/語言端，視實際狀況修改
*/

// import {fetchRequest} from "../SportRequest";
import {ApiPort} from "../SPORTAPI";
import {vendorStorage} from "./vendorStorage";

//語言配置
export const vendorSettings = {
  LanguageCode: 'CHS',  //中文
  //LanguageCode: 'ENG',  //英文
  //LanguageCode: 'VN',  //越南
  //LanguageCode: 'TH',  //泰文
  //LanguageCode: 'ID',  //印尼
}

//從gateway獲取登入token
export const getTokenFromGatewayImpl = (vendorInstance, brandname = 'fun88') => {
  vendorInstance.loginPromise =  new Promise(function(resolve, reject) {
    let hostname = '';
    if (brandname === 'jbo') {
      hostname = 'imnative';
    }

    if (brandname === 'fun88') {
      hostname = 'imnative';
    }

    fetchRequest( ApiPort.GetIMToken + 'hostname='+hostname+'&', 'GET')
      .then((data) => {

        //console.log('IM token',data);

        if (data.isGameLocked) {
          vendorInstance.isGameLocked = true;
          vendorInstance.loginPromise = null; //結束前清理掉
          reject('game Is Locked');
          return;
        } else {
          vendorInstance.isGameLocked = false;
        }
        if (data.token) {
          vendorStorage.setItem(
            "IM_Token",
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
            "IM_MemberCode",
            JSON.stringify(memberCode)
          );

          vendorInstance.loginPromise = null; //結束前清理掉

          vendorInstance._queryIMmemberType(); //獲取用戶水位

          resolve(data.token);
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

