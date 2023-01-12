/**
 * 游戏相关的全局状态
 */

// IPSB------IM体育
// SBT-------BTi体育

const IPSB_ERR = "IPSB_ERR"; //异常 (errcode == 2001)
const IPSB_MAINTAIN = "IPSB_MAINTAIN"; //维护中
const SBT_ERR = "SBT_ERR"; //异常 (errcode == 2001)
const SBT_MAINTAIN = "SBT_MAINTAIN"; //维护中
const GAME_MAINTAIN = "GAME_MAINTAIN"; //维护中

const initialState = {
  ipsbErr: false,
  ipsbMaintain: false,
  sbtErr: false,
  sbtMaintain: false,
  gameMaintain: false //是否显示游戏维护弹窗
};

/** Action Creator */
export function gameStatus(type, status) {
  return { type, payload: { status } };
}

/**  reducer */
export default function GameReducer(state = initialState, { type, payload }) {
  switch (type) {
    case IPSB_ERR:
      return { ...state, ipsbErr: payload.status };
    case IPSB_MAINTAIN:
      return { ...state, ipsbMaintain: payload.status };
    case SBT_ERR:
      return { ...state, sbtErr: payload.status };
    case SBT_MAINTAIN:
      return { ...state, sbtMaintain: payload.status };
    case GAME_MAINTAIN:
      return { ...state, gameMaintain: payload.status };
    default:
      return state;
  }
}
