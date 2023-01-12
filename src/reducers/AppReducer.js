import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import SceneReducer from './SceneReducer';
import GameReducer from './GameReducer';


import UserInfoReducer from '../lib/redux/reducers/UserInfoReducer';
import BetCartReducer from '../lib/redux/reducers/BetCartReducer';
import MaintainStatus from '../lib/redux/reducers/MaintainStatusReducer';
import RouterLogReducer from "../lib/redux/reducers/RouterLogReducer";
import UserSettingReducer from "../lib/redux/reducers/UserSettingReducer";

const AppReducer = combineReducers({
  auth: AuthReducer,
  profile: ProfileReducer,
  scene: SceneReducer,
  GameReducer,
  userInfo: UserInfoReducer,
  betCartInfo: BetCartReducer,
	maintainStatus: MaintainStatus,
	routerLog: RouterLogReducer,
  userSetting: UserSettingReducer,
});

export default AppReducer;