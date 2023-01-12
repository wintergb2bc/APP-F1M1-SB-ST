import {ACTION_USERSETTING_UPDATE} from '../actions/UserSettingAction';

//用戶設置 全域數據
export const initialState = {
  //盘口显示方式
  ListDisplayType: 1, //1纵向(默認) 2横向
};

const UserSettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_USERSETTING_UPDATE: //更新數據
      //console.log('===usersetting update to : ', action.payload);
      return {...state, ...action.payload};
    default:
      return state;
  }
};

export default UserSettingReducer;