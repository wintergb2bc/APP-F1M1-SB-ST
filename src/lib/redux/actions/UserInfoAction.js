import {initialState} from "../reducers/UserInfoReducer";
// import { fetchRequest } from '$LIB/SportRequest';
import { ApiPort } from '$LIB/SPORTAPI';
import {Decimal} from "decimal.js";

export const ACTION_USERINFO_UPDATE = 'ACTION_USERINFO_UPDATE';

//用戶登入
export const ACTION_UserInfo_login = (username) => {
  const payload = Object.assign(initialState,
    {
    isLogin: true,
    username: username,
  });

  const action = {
    type: ACTION_USERINFO_UPDATE,
    payload: payload,
  };

  return action;
}

//用戶登出
export const ACTION_UserInfo_logout = () => {
  const action = {
    type: ACTION_USERINFO_UPDATE,
    payload: initialState,
  };

  return action;
}

export const ACTION_UserInfo_updateBalanceSB = (newBalanceSB) => {
  const action = {
    type: ACTION_USERINFO_UPDATE,
    payload: {balanceSB: newBalanceSB},
  };

  return action;
}

//查詢SB餘額(因為需要展示 總餘額，所以這個API直接 改查全部餘額)
export const ACTION_UserInfo_getBalanceSB = (forceUpdate = false) => {
  //直接改查全部
  return ACTION_UserInfo_getBalanceAll(forceUpdate);

  // return (dispatch, getState) => {
  //   if (!getState().userInfo.isLogin) return Promise.resolve(); //沒登入不用處理
  //
  //   //10秒節流，避免短時間頻繁調用
  //   if (global._getBalanceSB_throttle_handle && !forceUpdate) {
  //     //console.log('===太頻繁...跳過getBalanceSB...')
  //     return Promise.resolve();
  //   }
  //
  //   if (!forceUpdate) {
  //     global._getBalanceSB_throttle_handle = setTimeout(function () {
  //       clearTimeout(global._getBalanceSB_throttle_handle);
  //       global._getBalanceSB_throttle_handle = null;
  //       //console.log('===clear getBalanceSB handle', JSON.stringify(global._getBalanceSB_throttle_handle));
  //     }, 10 * 1000); //10秒節流
  //   }
  //
  //   const updateGettingBalance = {
  //     type: ACTION_USERINFO_UPDATE,
  //     payload: {isGettingBalance: true},
  //   };
  //
  //   dispatch(updateGettingBalance);
  //
  //   return fetchRequest(ApiPort.GETBalanceSB, 'GET').then((data) => {
  //
  //     let payload = {
  //       balanceSB: 0,
  //       isGettingBalance: false,
  //     }
  //
  //     data.map(item => { //查單個，會返回兩個？第一個還是null？神API
  //       if (item && item.name && (item.name.toUpperCase() === 'SB')) {
  //         payload.balanceSB = item.balance;
  //       }
  //     });
  //
  //     const action = {
  //       type: ACTION_USERINFO_UPDATE,
  //       payload: payload,
  //     };
  //
  //     return dispatch(action);
  //   }).catch(error => {
  //     const updateGettingBalance = {
  //       type: ACTION_USERINFO_UPDATE,
  //       payload: {isGettingBalance: false},
  //     };
  //     return dispatch(updateGettingBalance);
  //   });
  // }
}

//查詢全部餘額
export const ACTION_UserInfo_getBalanceAll = (forceUpdate = false) => {
  return (dispatch, getState) => {
    if (!getState().userInfo.isLogin) return Promise.resolve(); //沒登入不用處理

    //10秒節流，避免短時間頻繁調用
    if (global._getBalanceAll_throttle_handle && !forceUpdate) {
      //console.log('===太頻繁...跳過getBalanceAll...')
      return Promise.resolve();
    }

    if (!forceUpdate) {
      global._getBalanceAll_throttle_handle = setTimeout(function () {
        clearTimeout(global._getBalanceAll_throttle_handle);
        global._getBalanceAll_throttle_handle = null;
        //console.log('===clear getBalanceAll handle', JSON.stringify(global._getBalanceAll_throttle_handle));
      }, 10 * 1000); //10秒節流
    }

    const updateGettingBalance = {
      type: ACTION_USERINFO_UPDATE,
      payload: {isGettingBalance: true},
    };

    dispatch(updateGettingBalance);

    return fetchRequest(ApiPort.GETALLBalance, 'GET').then((data) => {
      let payload = {
        allBalance: [],
        balanceTotal: 0,
        balanceSB: 0,
        isGettingBalance: false,
      }

      if (data && data.length > 0) {
        payload.allBalance = data;
        //返回是數組
        //balance: 3795.51
        //category: "TotalBal"
        //localizedName: "总余额"
        //name: "TotalBal"
        //state: "Available"

        const safeNumber = (x,precision=2) => {
          if (!x) {
            return 0;
          }

          return new Decimal(new Decimal(x).toFixed(precision).toString()).toNumber();
        }

        //順便更新 總餘額 和 sb餘額
        data.map(item => {
          item.balance = safeNumber(item.balance);

          //更新總餘額
          if (item && item.name && (item.name.toUpperCase() === 'TOTALBAL')) {
            payload.balanceTotal = item.balance;
          }
          //更新主账户
          if (item && item.name && (item.name.toUpperCase() === 'MAIN')) {
            window.MAIN = item.balance;
          }
          ///更新sb餘額
          if (item && item.name && (item.name.toUpperCase() === 'SB')) {
            payload.balanceSB = item.balance;
          }
        });
      }

      const action = {
        type: ACTION_USERINFO_UPDATE,
        payload: payload,
      };

      return dispatch(action);
    }).catch(error => {
      const updateGettingBalance = {
        type: ACTION_USERINFO_UPDATE,
        payload: {isGettingBalance: false},
      };
      return dispatch(updateGettingBalance);
    });
  }
}