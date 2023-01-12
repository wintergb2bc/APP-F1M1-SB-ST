import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Alert,
	Image,
	ImageBackground,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	NativeModules,
	Clipboard,
	AppState,
	BackHandler,
	Linking,
	Modal,
	ScrollView
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
	Button,
	Progress,
	WhiteSpace,
	WingBlank,
	InputItem,
	Toast,
	Flex
} from "antd-mobile-rn";
import CheckBox from "react-native-check-box";
import Video from "react-native-video";
import LivechatDragHoliday from "../LivechatDragHoliday"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { login } from "../../actions/AuthAction";
import VendorIM from '$LIB/vendor/im/VendorIM'
import VendorBTI from '$LIB/vendor/bti/VendorBTI';
import VendorSABA from '$LIB/vendor/saba/VendorSABA';
import AnalyticsUtil from "../../actions/AnalyticsUtil"; //友盟
import UmengAnalytics from "react-native-umeng-analytics";
import Touch from "react-native-touch-once";
import PushUtil from "../../actions/PushUtil"; //友盟 push 推送
import DeviceInfo from "react-native-device-info"; //獲取設備信息
import {
	ACTION_MaintainStatus_NoTokenBTI,
	ACTION_MaintainStatus_NoTokenIM,
	ACTION_MaintainStatus_NoTokenSABA,
} from '../../lib/redux/actions/MaintainStatusAction';
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from '../../lib/redux/actions/UserInfoAction';
import { ACTION_UserSetting_Update } from '../../lib/redux/actions/UserSettingAction'
import IovationX from "./../../actions/IovationNativeModule"; //android 拿黑盒子
import {
	namereg,
	passwordReg,
	phoneReg,
	emailReg,
	email_reg,
	email_reg_2,
	affReg
} from "../../actions/Reg";
import aes from 'crypto-js/aes';
import CryptoJS from "crypto-js";
import pkcs7 from 'crypto-js/pad-pkcs7';
import base64 from 'crypto-js/enc-base64';
import md5 from "crypto-js/md5";
import { parses } from '../../actions/parses';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { urlToPathAndParams } from "react-navigation/src/routers/pathUtils";

const AffCodeAndroid = NativeModules.opeinstall; //android 獲取code 參數
const AffCodeIos = NativeModules.CoomaanTools; //ios 獲取code 參數

const { width, height } = Dimensions.get("window");

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkName: false,
			type: this.props.type || "login",
			emptyLogName: '',
			emptyLogMsg: '',
			loginUsername: "",
			loginPwd: "",
			loginPwdS: "",
			registerUsername: "",
			registerPwd: "",
			registerRePwd: "",
			emailAddress: "",
			checkBox1: false,
			affCodeEditable: affCodeKex? false: true,
			version: Rb88Version,
			affCode: affCodeKex? affCodeKex: '', //代理號(用户主动输入)
			Devicetoken: "", //用戶唯一識別
			userMAC: "", //mac
			seeLoginPwd: false,
			seeRegPwd: false,
			seeRegRePwd: false,
			registerNumber: "", //注册手机号
			showRegTipPopUp: false, //注册提示弹窗
			emptyLogNameST: false, // 登录-用户名格式。
			// invalidLogName:false,// 登录-错误的用户名。
			emptyLogPwd: false, // 登录-空密码。
			emptyLogPwdST: false, // 登录-空密码。
			// invalidLogPwd:false, // 登录-错误的密码。
			emptyRegName: false, // 注册-空用户名。
			invalidRegName: false, // 注册-错误格式的用户名。
			emptyRegPhone: false, // 注册-空手机号码
			invalidRegPhone: false, // 注册-错误的手机号码
			invalidRegPwd: false, // 注册-错误的密码
			differentRegPwd: false, // 注册-不一致的密码
			emptyEmail: false, //注册--请输入邮箱地址
			invalidRegEmail: false,//注册--邮箱地址不正确
			invalidAff: false, //注册--推荐代码格式不符
			canLogin: false,
			canReg: false,
			registerPadding: false,
			CMS_GameProvidersList: [],
			registerBottom: false,
			showTerms: false,
			getGameKey: 0,
			CatgoryData: '',//游戏分类
			ProvidersData: '',//游戏供应商
			showPatternPage: false, //弹出图案登录
			showTouchPage: false, //弹出脸部识别或指纹
			isLogin: false,//是否登录，
			getUniqueId: '',
		};

		this.login = this.login.bind(this); //登錄
		this.foget = this.foget.bind(this); //忘記用戶名
	}

	componentWillMount() {

		// this.setState({ loginUsername: 'funtest991' });
		// this.setState({ loginPwd: 'today1234', canLogin: true });


		//mobile传token登陆
		isMobileOpen && this.mobileOpen()
		//获取记住用户名密码
		this.getUserName()
		// 获取MAC
		this.getMACAddress();
		// 获取DeviceToken
		this.getDeviceToken();
		// 获取代理码
		this.getAffliCode();
		//首次啟動APP 寫入友盟
		this.wiriteInUM();
		//otp获取设备参数
		this.getUniqueId()
	}

	componentDidMount() {
		lookBox = false; // 先去瞧瞧
		BankCardPhoneVerify = false//判断姓名银行卡手机验证是否通过，未登出前就不需要再验证
	}

	componentWillUnmount() {
		if(this.props.from && this.props.from == 'Betting-detail' && !this.state.isLogin) {
			//没有登录返回要回复横屏
			window.removeOrientation && window.removeOrientation()
		}
	}

	_onOrientationChange() {
	}
	getUniqueId() {
		global.storage
		.load({
			key: "getUniqueId",
			id: "getUniqueId"
		})
		.then(getUniqueId => {
			this.setState({getUniqueId})
		})
		.catch(err => {})
	}
	getDeviceSignatureBlackBox() {
		let uniqueId = this.state.getUniqueId
		if(uniqueId == '') {
			uniqueId = DeviceInfo.getUniqueId()
		}
		if (uniqueId && uniqueId.length <= 15) {
			uniqueId = '0' + DeviceInfo.getUniqueId()
		}
		let GUID = uuidv4()
		let keyHex = CryptoJS.enc.Utf8.parse('@NcRfTjWnZr4u7x!A%D*G-KaPdSgVkYp');
		if(window.common_url.indexOf('staging') > -1) {
			//测试key
			keyHex = CryptoJS.enc.Utf8.parse('WmZq4t7w!z%C*F-JaNdRgUkXp2r5u8x/');
		}
		let ivHex = CryptoJS.lib.WordArray.create(new Uint8Array(parses(GUID)));
		let texts = moment().utc().toISOString().split('.')[0] + 'Z'+ uniqueId
		let messageHex = CryptoJS.enc.Utf8.parse(texts);
		let encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
			"iv": ivHex,
			"mode": CryptoJS.mode.CBC,
			"padding": CryptoJS.pad.Pkcs7
		});
		var boxValue = GUID + encrypted.ciphertext.toString(base64);
		uniqueId && global.storage.save({
			key: "getUniqueId",
			id: "getUniqueId",
			data: uniqueId,
			expires: null
		});
		return boxValue
	}

	getUserName() {
		//获取记住用户名密码
		global.storage
			.load({
				key: "username",
				id: "usernameID"
			})
			.then(ret => {
				this.setState({ loginUsername: ret });
				userNameDB = ret
				global.storage
				.load({
					key: `lockLogin${ret.toLowerCase()}`,
					id: `lockLogin${ret.toLowerCase()}`,
				})
				.then(val => {
					lockLogin = Number(val)
				})
				.catch(err => {})

				//九宫格锁定次数
				global.storage
				.load({
					key: `lockPattern${ret.toLowerCase()}`,
					id: `lockPattern${ret.toLowerCase()}`,
				})
				.then(val => {
					LoginPatternNum = Number(val)
				})
				.catch(err => {})
				//指纹脸部锁定次数
				global.storage
				.load({
					key: `lockTouch${ret}`,
					id: `lockTouch${ret}`,
				})
				.then(val => {
					LoginTouchNum = Number(val)
				})
				.catch(err => {})




			})
			.catch(err => {})

			global.storage
			.load({
				key: "password",
				id: "passwordID"
			})
			.then(ret => {
				this.setState({ loginPwd: ret, canLogin: true, checkName: true });
			})
			.catch(err => {})
	}
	stripscript(s) {
		//過濾openinstall affcode
		var pattern = new RegExp(
			"[`affCode~!@#$^&*()=|{}':;', \n\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]"
		);
		var rs = "";
		for (var i = 0; i < s.length; i++) {
			rs = rs + s.substr(i, 1).replace(pattern, "");
		}
		return rs;
	}


	// 获取MAC
	getMACAddress = () => {
		if (Platform.OS === "android") {
			window.DeviceInfoIos = false;
			DeviceInfo.getMacAddress().then(mac => {
				//拿mac地址
				this.setState({
					userMAC: mac
				});
				window.userMAC = mac;
			});
		} else {
			//ios手机型号是有指纹的
			let iphoneXMax = [
				"iPhone 5",
				"iPhone 5s",
				"iPhone 6",
				"iPhone 6s",
				"iPhone 6s Plus",
				"iPhone 7",
				"iPhone 7 Plus",
				"iPhone 8",
				"iPhone 8 Plus",
				"iPhone SE"
			];
			const getModel = DeviceInfo.getModel();
			if (iphoneXMax.indexOf(getModel) > -1) {
				window.DeviceInfoIos = false;
			}
		}
	};

	// 获取DeviceToken
	getDeviceToken = () => {
		PushUtil.getDeviceToken()
			.then(token => {
				///獲取用戶唯一參數 devicetoken
				this.setState({
					Devicetoken: token
				}, () => {
					this.NotificationOne();
				});
				window.Devicetoken = token;
				//第一次開啟app 註冊友盟個推
				// this.NotificationOne();
			})
			.catch(err => {
				//第一次開啟app 註冊友盟個推
				this.NotificationOne();
			});
	};
	// 获取代理码
	getAffliCode() {
		if (Platform.OS === "android") {
			setTimeout(() => {
				if (AffCodeAndroid.getAffCode) {
					//新加的原生參數,如果沒有則拿url 代理號
					AffCodeAndroid.getAffCode(dict => {
						if (dict.CODE != "" && dict.CODE) {
							affCodeKex = dict.CODE;
							this.setState({
								affCodeEditable: false,
								affCode: affCodeKex
							});
						} else {
							this.getAff()
						}
					});
				} else {
					this.getAff()
				}
			}, 1000);
		} else {
			setTimeout(() => {
				if (AffCodeIos.getAffCode) {
					//新加的原生參數,如果沒有則拿url 代理號
					AffCodeIos.getAffCode((error, event) => {
						if (error) {
							//console.log(error)
						} else {
							if (event != "") {
								affCodeKex = event; // 有默認代理號直接拿
								this.setState({
									affCodeEditable: false,
									affCode: affCodeKex
								});
							} else {
								this.getAff()
							}
						}
					});
				} else {
					this.getAff()
				}
			}, 1000);
		}
	};

	getAff() {
		global.storage
		.load({
			key: "affCodeSG",
			id: "affCodeSG"
		})
		.then(ret => {
			affCodeKex = ret;
			this.setState({
				affCode: ret,
				affCodeEditable: false,
			})
		})
		.catch(err => {
			Clipboard.getString().then( (content)=>{
				if(content.indexOf('affcode&')== 0 ){
					let Acode =content.split('affcode&')[1]
					affCodeKex = Acode
					this.setState({
						affCode: Acode,
						affCodeEditable: false,
					})
					if(Acode) {
						global.storage.save({
							key: "affCodeSG", // 注意:请不要在key中使用_下划线符号!
							id: "affCodeSG", // 注意:请不要在id中使用_下划线符号!
							data: Acode,
							expires: null
						});
					}
				}
			}, (error)=>{
			console.log('error:'+error);
			})
		});
	}

	//mobile传token登陆
	mobileOpen() {
		let data = this.props.openList
		//   sb20://token=aaa&rtoken=bbb&deeplink=im&sid=2&eid=45678&lid=89012

		if (data.token) {
			ApiPort.Token = "Bearer " + data.token; // 寫入用戶token  token要帶Bearer
			ApiPort.ReToken = data.rtoken; // 寫入用戶token  token要帶Bearer

			this.setState({isLogin: true})
			this.props.userInfo_getBalanceSB(true); //redux 獲取SB餘額
			ApiPort.UserLogin = true;
			global.localStorage.setItem('loginStatus','1')
			AnalyticsUtil.onEvent("login");
			this.getUser('mobileOpen')
			//获取用户配置
			this.getSeting()



		}
	}
	//mobile打开登陆获取用户信息写入
	getMemberCode(data) {
		this.NotificationLogin(data.MemberCode);
		userNameDB = data.UserName;


		this.props.userInfo_login(data.UserName); //redux 紀錄登入態
		localStorage.setItem('memberCode', JSON.stringify(data.MemberCode));
		//追蹤membercode piwik
		setTimeout(() => {
			PiwikMenberCode(data.MemberCode)
			PiwikVersion(Rb88Version)
		}, 1000);

		isGameLock = data.IsGameLock; //用戶能不能玩遊戲
		memberCode = data.MemberCode; //寫入用戶 memberCode

		let openList = this.props.openList
		let memberDataLogins = {
			accessToken: {
				access_token: openList.token,
				refresh_token: openList.rtoken
			},
			memberInfo: {
				memberCode: data.MemberCode
			}
		}
		window.memberDataLogin = memberDataLogins;

		AnalyticsUtil.onEventWithMap("UseToken", {
			UseToken:
				data.MemberCode +
				" / Devicetoken:" +
				this.state.Devicetoken
		});
		AnalyticsUtil.onEventWithMap("memberCodeX", {
			memberCode:
				data.MemberCode + " / Platform:" + Platform.OS
		});

		//IM登入
		const IMloginPromise = VendorIM.getTokenFromGateway()
			.then((token) => {
				this.props.maintainStatus_noTokenIM(false);
			})
			.catch((e) => {
				this.props.maintainStatus_noTokenIM(true);
				console.log('im login failed', e);
			});
		//BTI登入
		const BTIloginPromise = VendorBTI.getTokenFromGateway()
			.then((token) => {
				this.props.maintainStatus_noTokenBTI(false);
			})
			.catch((e) => {
				this.props.maintainStatus_noTokenBTI(true);
				console.log('bti login failed', e);
			});
		//SABA登入
		const SABAloginPromise = VendorSABA.getTokenFromGateway();
			//沙巴特殊，不需要檢查noToken
			// .then(token => {
			// 	this.props.maintainStatus_noTokenSABA(false);
			// })
			// .catch((e) => {
			// 	this.props.maintainStatus_noTokenSABA(true);
			// 	console.log('saba login failed', e);
			// });

		setTimeout(() => {
			Toast.hide();
			let username = "loginok";
			let password = "loginok";
			this.props.login({ username, password });
		}, 2000);

		setTimeout(() => {
			openList.deeplink && window.openApp && window.openApp(openList.deeplink, openList.sid, openList.eid, openList.lid)
		}, 3000);
	}

	//首次啟動APP 寫入友盟
	wiriteInUM = () => {
		global.storage
			.load({
				key: "OpenAPPready",
				id: "123"
			})
			.then(ret => { })
			.catch(err => {
				setTimeout(() => {
					AnalyticsUtil.onEventWithMap("StartAPP", { affCode: affCodeKex });
				}, 3000);

				global.storage.save({
					key: "OpenAPPready", // 注意:请不要在key中使用_下划线符号!
					id: "123", // 注意:请不要在id中使用_下划线符号!
					data: "",
					expires: null
				});
			});
	};



	NotificationOne() {
		//第一次用app 友盟個推註冊
		let date = {
			os: Platform.OS == "ios" ? "iOS" : "Android",
			osVersionCode: DeviceInfo.getVersion(),
			osVersionNumber: DeviceInfo.getSystemVersion(),
			deviceModel: Platform.OS === "android" ? DeviceInfo.getModel() : "",
			serialNumber: Platform.OS === "android" ? DeviceInfo.getSerialNumber() : "",
			deviceManufacturer: Platform.OS == "ios" ? DeviceInfo.getManufacturerSync() || DeviceInfo.getManufacturer() : 'Google',
			pushNotificationPlatform: "umeng+",
			deviceToken: this.state.Devicetoken,
			imei: "",
			macAddress: this.state.userMAC,
			memberCode: "",
			packageName: Platform.OS == "ios" ? "nettium.fun.native" : "nettium.fun.native"
		};
		fetchRequest(ApiPort.NotificationOne, "POST", date)
			.then(data => {
				// console.log('PasswordErrPasswordErrPasswordErr1111111')
			})
			.catch(error => { });
	}

	NotificationLogin(user) {
		//登錄註冊友盟推送
		let date = {
			topics: "",
			pushNotificationPlatform: "umeng+",
			deviceToken: this.state.Devicetoken,
			packageName: Platform.OS == "ios" ? "nettium.fun.native" : "nettium.fun.native",
			imei: "",
			macAddress: this.state.userMAC,
			memberCode: user,
			serialNumber:
				Platform.OS === "android" ? DeviceInfo.getSerialNumberSync() || DeviceInfo.getSerialNumber() : "",
			os: Platform.OS == "ios" ? "iOS" : "Android"
		};
		fetchRequest(ApiPort.NotificationOne, "PATCH", date)
			.then(res => { })
			.catch(error => { });
	}

	handleLoginInput(key, value) {
		this.setState({ [key]: value }, () => {
			this.verifyLoginDetail(key)
		});
	}

	handleRegisterInput(key, value) {
		this.setState({ [key]: value }, () => {
			this.verifyRegisterDetail(key)
		});
	}

	// 登录前先校验登录信息
	verifyLoginDetail(key) {
		const { loginUsername, loginPwd } = this.state;

		let canLogin = true;
		let emptyLogMsg = ''
		if (!namereg.test(loginUsername) && key == 'loginUsername') {
			canLogin = false
			emptyLogMsg = '请输入正确的用户名'
		}
		userNameDB = loginUsername

		if (!passwordReg.test(loginPwd) && key == 'loginPwd') {
			emptyLogMsg = false;
			emptyLogMsg = '请输入正确的密码。'
		}
		this.setState({ canLogin, emptyLogMsg });

	}
	// 注册前先校验信息
	verifyRegisterDetail(key) {
		const {
			registerUsername,
			registerPwd,
			registerNumber,
			emailAddress,
		} = this.state;

		let canReg = true;

		//用户名
		if (registerUsername != '' && !namereg.test(registerUsername)) {
			this.setState({ invalidRegName: true });
			canReg = false;
		} else {
			this.setState({ invalidRegName: false });
		}
		//密码
		if (registerPwd != '' && !passwordReg.test(registerPwd)) {
			this.setState({ invalidRegPwd: true });
			canReg = false;
		} else {
			this.setState({ invalidRegPwd: false });
		}
		//手机号码
		if (registerNumber != '' && !phoneReg.test(registerNumber)) {
			this.setState({ invalidRegPhone: true });
			canReg = false;
		} else {
			this.setState({ invalidRegPhone: false });
		}
		//邮箱
		// if (emailAddress != '' && !emailReg.test(emailAddress)) {
		const mailPrefixLessThanThree = emailAddress.split("@")[0].length < 3;
		const dian = emailAddress.split("@")[0].indexOf('.') > -1
    	if (emailAddress!= '' && (!email_reg.test(emailAddress) || !email_reg_2.test(emailAddress) || mailPrefixLessThanThree || dian)) {
			this.setState({ invalidRegEmail: true });
			canReg = false;
		} else {
			this.setState({ invalidRegEmail: false });
		}

		if (!registerUsername || !registerPwd || !registerNumber || !emailAddress) {
			canReg = false
		}
		this.setState({ canReg });

	}

	//获取用户配置
	getSeting() {
		fetchRequest(ApiPort.GetMemberNotificationSetting, 'GET')
		.then((res) => {
			if (res && res.memberCode && res.notificationSetting) {
				localStorage.setItem('NotificationSetting-' + res.memberCode, JSON.stringify(res.notificationSetting));
				this.props.userSetting_updateListDisplayType(res.notificationSetting.listDisplayType)
				global.storage.save({
					key: "setTing",
					id: "setTing",
					data: res.notificationSetting,
					expires: null
				});
			}
		})
		.catch((e) => { });
	}

	/**
	 *
	 * @param {string} key 登录类型:直接登录/注册登录/快速登录
	 * @param boolean flag:true表示注册时调用的登录
	 */
	login(fastLogin) {

		const {
			type,
			loginUsername,
			loginPwd,
			registerUsername,
			registerPwd,
			canLogin,
		} = this.state;


		global.Restrict = false//点击登陆可以跳转维护
		if (!canLogin && type == 'login') return;

		let username, password;
		if (type == "login") {
			// 直接登录时的用户名和密码
			username = loginUsername;
			password = loginPwd;
		} else {
			// 注册时的用户名和密码
			username = registerUsername;
			password = registerPwd;
		}
		userNameDB = username;
		DeviceSignatureBlackBox = this.getDeviceSignatureBlackBox()
		let date = {
			deviceSignatureBlackbox: DeviceSignatureBlackBox,
			hostName: common_url,
			captchaId: "30172f1a-c2c9-4fb7-afaf-2a4eb9391e44",
			captchaCode: "999999",
			grantType: "password",
			clientId: "Fun88.CN.App",
			clientSecret: "FUNmuittenCN",
			username,
			password,
			scope: "Mobile.Service offline_access",
			appId: "net.GB2BC.FUN88",
			siteId: Platform.OS === "android" ? 36 : 35,
			e2: E2Backbox || ""
		};
		Toast.loading("登录中,请稍候...", 20);
		PiwikEvent('Login', 'Submit', 'Login')
		fetchRequest(ApiPort.login, "POST", date)
			.then(data => {

				if (data.accessToken) {
					this.setState({isLogin: true})
					this.NotificationLogin(data.memberDetails.memberCode);
					userNameDB = data.memberDetails.userName;

					this.props.userInfo_login(data.memberDetails.userName); //redux 紀錄登入態
					this.props.userInfo_getBalanceSB(true); //redux 獲取SB餘額

					localStorage.setItem('memberCode', JSON.stringify(data.memberDetails.memberCode));
					ApiPort.Token =
						data.accessToken.token_type + " " + data.accessToken.access_token; // 寫入用戶token  token要帶Bearer
					ApiPort.ReToken = data.accessToken.refresh_token; // 寫入用戶token  token要帶Bearer
					isGameLock = data.memberDetails.isGameLock; //用戶能不能玩遊戲
					memberCode = data.memberDetails.memberCode; //寫入用戶 memberCode
					window.memberDataLogin = data;

					ApiPort.UserLogin = true;
					global.localStorage.setItem('loginStatus','1')
					AnalyticsUtil.onEvent("login");
					AnalyticsUtil.onEventWithMap("UseToken", {
						UseToken:
							data.memberDetails.memberCode +
							" / Devicetoken:" +
							this.state.Devicetoken
					});
					AnalyticsUtil.onEventWithMap("memberCodeX", {
						memberCode:
							data.memberDetails.memberCode + " / Platform:" + Platform.OS
					});
					global.storage.save({
						key: `lockLogin${username}`,
						id: `lockLogin${username}`,
						data: 0,
						expires: null
					});
					lockLogin = 0
					//获取用户配置
					this.getSeting()
					//追蹤membercode piwik
					setTimeout(() => {
						PiwikMenberCode(data.memberDetails.memberCode)
						PiwikVersion(Rb88Version)
					}, 1000);

					//　檢測國家
					if (data.memberDetails.currency.toLowerCase() !== 'cny') {
						Toast.hide();
						Toasts.error('不支援的国家');
						setTimeout(() => {
							LiveChatOpenGlobe()
						}, 1500);
						return;
					}

					// 檢測封鎖的玩家
					if (data.memberDetails.isGameLock) {
						Toast.hide();
						Toasts.error('封锁的帐户');
						setTimeout(() => {
							LiveChatOpenGlobe()
						}, 1500);
						return;
					}

					if (data.memberDetails.revalidate == true) {
						//重置密码
						this.getUser('revalidate')
						return
					}

					if (data.memberDetails.loginOTP == true) {
						//需要去做手机邮箱验证
						this.getUser('loginOTP')
						return
					}
					this.getUser()
					this.GetSelfExclusionRestriction()

					//IM登入
					const IMloginPromise = VendorIM.getTokenFromGateway()
						.then((token) => {
							this.props.maintainStatus_noTokenIM(false);
						})
						.catch((e) => {
							this.props.maintainStatus_noTokenIM(true);
							console.log('im login failed', e);
						});
					//BTI登入
					const BTIloginPromise = VendorBTI.getTokenFromGateway()
						.then((token) => {
							this.props.maintainStatus_noTokenBTI(false);
						})
						.catch((e) => {
							this.props.maintainStatus_noTokenBTI(true);
							console.log('bti login failed', e);
						});
					//SABA登入
					const SABAloginPromise = VendorSABA.getTokenFromGateway();
						//沙巴特殊，不需要檢查noToken
						// .then(token => {
						// 	this.props.maintainStatus_noTokenSABA(false);
						// })
						// .catch((e) => {
						// 	this.props.maintainStatus_noTokenSABA(true);
						// 	console.log('saba login failed', e);
						// });

					this.keepNamePassw(username, password)

					//保存快捷登陆方式的密码 ，快速登录使用
					let fastLoginKey = "fastLoginPass" + username.toLowerCase();
					let sfastLoginId = "fastLoginPass" + username.toLowerCase();
					global.storage.save({
						key: fastLoginKey,
						id: sfastLoginId,
						data: password,
						expires: null
					});

					if(fastLogin) {
						//快速登陆验证密码成功
						window.FastLoginErr = false
						window.FastLoginBack && window.FastLoginBack()
						return
					} else {
						LoginPatternNum = 0
						LoginTouchNum = 0
					}

					setTimeout(() => {
						Toast.hide();
						let username = "loginok";
						let password = "loginok";
						this.props.login({ username, password });
					}, 2000);

				} else {
					if(fastLogin && data.error_details && data.error_details.Code == 'MEM00059') {
						//快速 登陆提示
						Toast.hide();
						Alert.alert('密码错误', '用户名或密码无效。',[{text: '确定'}]);
						return
					}
					let errors = JSON.parse(data.content);
					if (errors.error_details) {
						this.setState({ emptyLogMsg: errors.error_details.Message })
					} else {
						this.setState({ emptyLogMsg: '用户名称或密码错误！请重新输入！' })
					}
					Toast.hide();
				}
			})
			.catch(error => {
				Toast.hide();
			});
	}

	//  注册
	postRegist() {
		const {
			registerUsername,
			registerPwd,
			registerNumber,
			emailAddress,
			canReg,
		} = this.state;

		if (!canReg) return;

		let affc = affCodeKex || this.state.affCode
		affc = affc.replace(/[^\w\.\/]/ig, '')
		DeviceSignatureBlackBox = this.getDeviceSignatureBlackBox()
		let date = {
			deviceSignatureBlackbox: DeviceSignatureBlackBox,
			BrandCode: 'FUN88',
			Email: emailAddress,
			HostName: common_url,
			Language: "zh-cn",
			MediaCode: '',
			mobile: "86-" + registerNumber,
			password: registerPwd,
			Referer: '',
			RegWebsite: Platform.OS === "android" ? 36 : 35,
			userName: registerUsername,
			AffiliateCode: affc, //判断用户是否有填写推荐码
			blackBoxValue: Iovation,
			e2BlackBoxValue: E2Backbox,
		};

		Toast.loading("注册中...", 20);
		PiwikEvent('Register', 'Submit', 'Register')
		fetchRequest(ApiPort.MemberRestricted, "POST", date)
			.then(data => {

				Toast.hide();
				if (data.isSuccess == true) {
					Toasts.success("注册成功", 2);

					AnalyticsUtil.onEventWithMap("registered", {
						affCode: affCodeKex || this.state.affCode
					});

					// 注册成功且登录
					this.login();

				} else {
					if (data.result.Code == "MEM00041") {
						Toasts.fail("邮箱地址已注册", 2);
						return;
					}
					if (data.result.Code == "MEM00026") {
						Toasts.fail("用户名已注册", 2);
						return;
					}
					Toasts.fail(data.message, 2);
				}
			})
			.catch(err => {
				Toast.hide();
				Toasts.fail("注册失败", 3);
				console.log(err);
			});
	}


	//获取用户信息
	getUser(key) {
		let mag = key == 'mobileOpen'? '登录中,请稍候...': "加载中,请稍候..."
		key && Toast.loading(mag, 300);
		fetchRequest(ApiPort.Member, "GET")
			.then(data => {
				key && Toast.hide();
				if (data && data.result) {
					key == 'mobileOpen' && this.getMemberCode(data.result.memberInfo)
					global.storage.save({
						key: "memberInfo",
						id: "memberInfo",
						data: data.result.memberInfo,
						expires: null
					});
					localStorage.setItem('memberInfo', JSON.stringify(data.result.memberInfo));
					if (key == 'loginOTP') {
						Actions.LoginOtp({ memberInfo: data.result.memberInfo });
					} else if (key == 'revalidate') {
						Actions.RestPassword({ memberInfo: data.result.memberInfo });
					}
				}
			})
			.catch(error => {
				Toast.hide();
			});
	}
	//是否自我锁定账户
	GetSelfExclusionRestriction() {
		global.storage.remove({
			key: "SelfExclusionRestriction",
			id: "SelfExclusionRestriction"
		});
		window.SelfExclusionRestriction = false

		fetchRequest(ApiPort.GetSelfExclusionRestriction, "GET")
		.then((res) => {
			let result = res.result || ''
			if(res.isSuccess && result) {
				if(result.DisableDeposit || result.DisableFundIn || result.DisableBetting) {
					//自我锁定,投注锁定，存款锁定，转账锁定
					window.SelfExclusionRestriction = {
						DisableBetting: result.DisableBetting || false,
						DisableDeposit: result.DisableDeposit || false,
						DisableFundIn: result.DisableFundIn || false,
					}
					
					global.storage.save({
						key: 'SelfExclusionRestriction',
						id: 'SelfExclusionRestriction',
						data: res.result,
						expires: null
					});
				}
			}

		})
		.catch(() => {})
	}
	keepfastLogin(username, password) {
		//快速登陆记住用户名密码
		let passwordKey = "passwordKey" + username.toLowerCase();
		let passwordID = "passwordID" + username.toLowerCase();
		global.storage.save({
			key: passwordKey,
			id: passwordID,
			data: password,
			expires: null
		});
	}
	fastLogins(key) {
		const loginUsername = this.state.loginUsername.toLowerCase();
		let fastLoginKey = "fastLogin" + loginUsername;
		let sfastLoginId = "fastLogin" + loginUsername;
		let emptyLogMsg = ''
		if (!namereg.test(loginUsername)) {
			canLogin = false
			emptyLogMsg = '请输入正确的用户名'
			this.setState({canLogin, emptyLogMsg})
			return
		}

		global.storage
			.load({
				key: fastLoginKey,
				id: sfastLoginId
			})
			.then(data => {
				if(key == data) {
					//已经有登陆记录，直接跳转登陆
					Actions.FastLogin({ username: this.state.loginUsername.toLowerCase(),FastLogin: data });
				} else {
					//	有登陆记录，但是Android选择有两种 ，选中不是缓存的跳转重新设定
					Actions[key]({ username: this.state.loginUsername.toLowerCase() });
				}
			})
			.catch(err => {
				//	没有登陆记录，跳转设置
				Actions[key]({ username: this.state.loginUsername.toLowerCase() });
			});

	}

	keepNamePassw(username, password) {
		//记住我
		if(this.state.checkName){
			global.storage.save({
				key: "username",
				id: "usernameID",
				data: username,
				expires: null
			});
			global.storage.save({
				key: "password",
				id: "passwordID",
				data: password,
				expires: null
			});
		} else{
			global.storage.remove({
				key: "username",
				id: "usernameID"
			});
			global.storage.remove({
				key: "password",
				id: "passwordID"
			});
		}
	}

	//忘記密碼 名字
	foget() {
		PiwikEvent('ForgetPW_loginpage')
		Actions.Fogetname()
	}

	eyes(key) {
		this.setState({
			[key]: !this.state[key]
		});
	}


	// 切换类型:登录/注册
	toggleType(type) {
		this.setState({
			type,
			emptyLogName: '',
			emptyLogNameST: false, // 登录-用户名格式。
			// invalidLogName:false,// 登录-错误的用户名。
			emptyLogPwd: false, // 登录-空密码。
			emptyLogPwdST: false, // 登录-空密码。
			// invalidLogPwd:false, // 登录-错误的密码。
			emptyRegName: false, // 注册-空用户名。
			invalidRegName: false, // 注册-错误格式的用户名。
			emptyRegPhone: false, // 注册-空手机号码
			invalidRegPhone: false, // 注册-错误的手机号码
			invalidRegPwd: false, // 注册-错误的密码
			differentRegPwd: false, // 注册-不一致的密码
			canLogin: false,
			canReg: false
		});
		if (type == "register") {
			AnalyticsUtil.onEvent("register");
		}
	}

	lockLogin(num) {
		//指纹脸部识别，call一次密码api可以识别3次，
		// android指纹错误1次call一次
		//ios指纹错误1次call3次
		//ios脸部错误1次call2次

		lockLogin += 1

		let apiUrl = common_url + '/api/Login?siteId=31&api-version=1.0&brand=FUN88&Platform=ios'
		let  header = {
			"Content-Type": "application/json; charset=utf-8",
			"Culture": "zh-cn"
		};
		let params = {
			hostName: common_url,
			captchaId: "30172f1a-c2c9-4fb7-afaf-2a4eb9391e44",
			captchaCode: "999999",
			grantType: "password",
			clientId: "Fun88.CN.App",
			clientSecret: "FUNmuittenCN",
			username: this.state.loginUsername,
			password: '001123qpounfaj',
			scope: "Mobile.Service offline_access",
			appId: "net.GB2BC.FUN88",
			siteId: Platform.OS === "android" ? 36 : 35,
			e2: E2Backbox || ""
		};
		const fetchData = {
		  method: 'POST',
		  headers: header,
		  body: JSON.stringify(params),
		}
		return fetch(apiUrl, fetchData)
		  .then((response) => response.json())
		  .then(jsonData => {

			if(jsonData.error_details && jsonData.error_details.Code == "MEM00060") {
				lockLogin = 6

				// Alert.alert('密码错误', '提交次数上限为五次，已超过尝试的限制，请联系客服！',
				// [{ text: '确定', onPress: () => {LiveChatOpenGlobe()} }],);
			} else {
				num > 1 && this.lockLogin(num - 1)
			}
			global.storage.save({
				key: `lockLogin${this.state.loginUsername}`,
				id: `lockLogin${this.state.loginUsername}`,
				data: lockLogin,
				expires: null
			});
		  })
	}

	render() {
		const {
			checkName,
			version,
			loginUsername,
			loginPwd,
			registerUsername,
			registerPwd,
			registerRePwd,
			emailAddress,
			registerNumber,
			type,
			seeLoginPwd,
			seeRegPwd,
			seeRegRePwd,
			affCode,
			emptyLogName,
			emptyLogNameST,
			emptyLogPwd,
			emptyLogPwdST,
			emptyRegName,
			invalidRegName,
			emptyRegPhone,
			invalidRegPhone,
			invalidRegPwd,
			differentRegPwd,
			emptyEmail,
			invalidRegEmail,
			invalidAff,
			registerBottom,
			canLogin,
			affCodeEditable,
			canReg,
			registerPadding,
			showPatternPage,
			showTouchPage,
			showTerms,
			emptyLogMsg,
		} = this.state;
		window.LockLoginFun = (num) => {
			this.lockLogin(num)
		}
		window.VerifyLodin = () => {
			let username = "loginok";
			let password = "loginok";
			this.props.login({ username, password });
		}


		window.AccountFailureLogin = (loginPwd) => {
			//账号验证-密码修改直接登录
			this.setState({loginPwd}, () => {
				this.login();
			})

		}

		// 切换到注册
		window.Logonregist = () => {
			this.setState({
				type: "register"
			});
		};

		window.PasswordErr = () => {
			Toast.hide();
			this.setState({ emptyLogMsg: '用户名称或密码错误！请重新输入！' })
		}

		//指纹脸部九宫格快捷登陆
		window.fastLogin = (loginUsername, loginPwd, key) => {
			this.setState({
				type: 'login',
				loginUsername,
				loginPwd,
				canLogin: true,

			}, () => {
				//key,快捷登陆方式，登陆成功保存本地
				this.login(key)
			})

		}

		return (
			<KeyboardAwareScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
				<ImageBackground
					source={require("../../images/login/bg.png")}
					style={styles.bgView}
				>
					<View style={{ height: DeviceInfoIos ? 50 : 10 }}></View>
					<View style={styles.loginNav}>
						<View>
							<Touch onPress={() => { Actions.pop() }}>
								<Image resizeMode='stretch' source={require('../../images/icon-back.png')} style={{ width: 30, height: 30 }} />
							</Touch>
						</View>
						<View>
							<Touch onPress={() => { LiveChatOpenGlobe(); PiwikEvent('LiveChat', 'Launch', 'LoginPage') }}>
								<Image resizeMode='stretch' source={require('../../images/cs.png')} style={{ width: 30, height: 30 }} />
							</Touch>
						</View>
					</View>
				</ImageBackground>


				<View style={styles.loginView}>
					<View style={styles.loginType}>
						<Touch style={[styles.loginBtn, { backgroundColor: type == 'login' ? '#00A6FF' : 'transparent' }]} onPress={() => { this.toggleType('login') }}>
							<Text style={[styles.loginTxt, { color: type == 'login' ? '#fff' : '#BCBEC3' }]}>登入</Text>
						</Touch>
						<Touch style={[styles.loginBtn, { backgroundColor: type == 'register' ? '#00A6FF' : 'transparent' }]} onPress={() => { this.toggleType('register') }}>
							<Text style={[styles.loginTxt, { color: type == 'register' ? '#fff' : '#BCBEC3' }]}>注册</Text>
						</Touch>
					</View>

					{
						type == 'login' &&
						<View>
							{
								emptyLogMsg != '' &&
								<View style={styles.errMsg}>
									<Text style={{ color: '#EB2121', lineHeight: 35 }}>{emptyLogMsg}</Text>
								</View>
							}

							<View style={styles.inputView}>
								<Image resizeMode='stretch' source={require('../../images/login/user.png')} style={{ width: 20, height: 20 }} />
								<TextInput
									style={styles.input}
									underlineColorAndroid="transparent"
									value={loginUsername}
									placeholder="用户名"
									placeholderTextColor="#BCBEC3"
									maxLength={14}
									textContentType="username"
									onChangeText={value =>
										this.handleLoginInput("loginUsername", value)
									}
								/>
							</View>

							<View style={styles.inputView}>
								<Image resizeMode='stretch' source={require('../../images/login/password.png')} style={{ width: 20, height: 20 }} />
								<TextInput
									style={styles.input}
									underlineColorAndroid="transparent"
									value={loginPwd}
									placeholder="密码"
									placeholderTextColor="#BCBEC3"
									maxLength={20}
									textContentType="password"
									secureTextEntry={!seeLoginPwd}
									onChangeText={value =>
										this.handleLoginInput("loginPwd", value)
									}
								/>
								<Touch style={styles.eyesBtn} onPress={() => { this.setState({ seeLoginPwd: !this.state.seeLoginPwd }) }}>
									<Image
										resizeMode='stretch'
										source={!seeLoginPwd ? require('../../images/login/close_eye.png') : require('../../images/login/eyse.png')}
										style={{ width: 22, height: 16 }}
									/>
								</Touch>
							</View>

							<View style={styles.checkBoxFlex}>
								<Touch onPress={() => { this.setState({checkName: !checkName}) }} style={styles.checkBoxFlex}>
									{ !checkName && <View style={styles.checkName} />}
									{
										checkName && <Image resizeMode='stretch' source={require('../../images/chengk.png')} style={{ width: 20, height: 20 }} />
									}
									<Text style={{ color: '#666',paddingLeft: 10 }}>记住我</Text>
								</Touch>
								<Touch onPress={() => { Actions.Fogetname() }}>
									<Text style={{ textAlign: 'right', lineHeight: 35, color: '#00A6FF' }}>忘记用户名或密码？</Text>
								</Touch>
							</View>

							<Touch onPress={() => { this.login() }} style={[styles.loginOk, { backgroundColor: canLogin ? '#00A6FF' : '#EFEFF4' }]}>
								<Text style={{ color: canLogin ? '#fff' : '#BCBEC3', textAlign: 'center', lineHeight: 48 }}>登录</Text>
							</Touch>
							<View>
							{
								Platform.OS == "ios" &&
								<View style={styles.faceLogin}>
									<Touch style={styles.faceLogin} onPress={() => {this.fastLogins("LoginTouch")}}>
											<Image
												resizeMode="stretch"
												source={DeviceInfoIos? require("../../images/login/face.png") :require("../../images/login/touch.png")}
												style={{ width: 25, height: 26}}
											/>
											<Text style={{color: '#00A6FF',paddingLeft:10}}>{DeviceInfoIos? '脸部辨识快速登录': '使用指纹辨识'}</Text>
									</Touch>
								</View>
							}
							{
								Platform.OS == "android" &&
								<View style={styles.touchPatten}>
									<Touch style={styles.touchPatten} onPress={() => {this.fastLogins('LoginTouch',1)}}>
										<Image
											resizeMode="stretch"
											source={require("../../images/login/touch.png")}
											style={{ width: 30, height: 25 }}
										/>
										<Text style={{color: '#00A6FF',paddingLeft:5}}>使用指纹辨识</Text>
									</Touch>
									<View style={{width: 1,backgroundColor: '#fff',height: 26}} />
									<Touch style={styles.touchPatten} onPress={() => {this.fastLogins('LoginPattern',2)}}>
										<Image
											resizeMode="stretch"
											source={require("../../images/login/unlock.png")}
											style={{ width: 25, height: 25 }}
										/>
										<Text style={{color: '#00A6FF',paddingLeft:5}}>使用图形密码</Text>
									</Touch>
								</View>
								}
							</View>

							<View style={styles.sponsorship}>
								<View style={styles.sponsorshipList}>
									<Image resizeMode='stretch' source={require('../../images/login/page1.png')} style={{ width: 60, height: 60, marginBottom: 15 }} />
									<Text style={{ color: '#BCBEC3', fontSize: 11 }}>官方球衣赞助商</Text>
									<Text style={{ color: '#BCBEC3', fontSize: 12 }}>纽卡斯尔联足球俱乐部</Text>
								</View>
								<View style={styles.sponsorshipList}>
									<Image resizeMode='stretch' source={require('../../images/login/page2.png')} style={{ width: 60, height: 60, marginBottom: 15 }} />
									<Text style={{ color: '#BCBEC3', fontSize: 11 }}>亚洲官方投注伙伴</Text>
									<Text style={{ color: '#BCBEC3', fontSize: 11 }}>托特纳姆热刺足球俱乐部</Text>
								</View>
							</View>
						</View>
					}
					{
						type == 'register' &&
						<View style={{ paddingBottom: registerPadding ? 150 : 0 }}>
							<View style={styles.inputView}>
								<Image resizeMode='stretch' source={require('../../images/login/user.png')} style={{ width: 20, height: 20 }} />
								<TextInput
									style={styles.input}
									underlineColorAndroid="transparent"
									value={registerUsername}
									placeholder="用户名"
									placeholderTextColor="#BCBEC3"
									maxLength={14}
									textContentType="username"
									onChangeText={value =>
										this.handleRegisterInput("registerUsername", value)
									}
									onFocus={() => { this.setState({ registerPadding: true }) }}
								/>
							</View>
							{
								invalidRegName &&
								<View style={styles.errMsg}>
									<Text style={{ color: '#eb2121', fontSize: 11, lineHeight: 18, padding: 8 }}>用户名长度必须至少有6个字符，不能超过14个字符，仅可使用字母 'A-Z', 'a-z' , 数字 '0-9'。</Text>
								</View>
							}
							<View style={styles.inputView}>
								<Image resizeMode='stretch' source={require('../../images/login/password.png')} style={{ width: 20, height: 20 }} />
								<TextInput
									style={styles.input}
									underlineColorAndroid="transparent"
									value={registerPwd}
									placeholder="密码"
									placeholderTextColor="#BCBEC3"
									maxLength={20}
									textContentType="password"
									secureTextEntry={!seeLoginPwd}
									onChangeText={value =>
										this.handleRegisterInput("registerPwd", value)
									}
								/>
								<Touch style={styles.eyesBtn} onPress={() => { this.setState({ seeLoginPwd: !this.state.seeLoginPwd }) }}>
									<Image
										resizeMode='stretch'
										source={!seeLoginPwd ? require('../../images/login/close_eye.png') : require('../../images/login/eyse.png')}
										style={{ width: 22, height: 16 }}
									/>
								</Touch>
							</View>
							{
								invalidRegPwd &&
								<View style={styles.errMsg}>
									<Text style={{ color: '#eb2121', fontSize: 11, lineHeight: 18, padding: 8 }}>密码必须包含6-20个字符，字符只限于使用字母和数字。（可以包含 ^＃$@ 中的特殊字符）。</Text>
								</View>
							}
							<View style={styles.inputView}>
								<Image resizeMode='stretch' source={require('../../images/login/phone.png')} style={{ width: 20, height: 20 }} />
								<Text style={{color: '#bcbec3', fontSize: 12}}>+ 86</Text>
								<TextInput
									style={styles.input}
									underlineColorAndroid="transparent"
									value={registerNumber}
									placeholder="联系电话"
									placeholderTextColor="#BCBEC3"
									maxLength={11}
									keyboardType="number-pad"
									textContentType="telephoneNumber"
									textContentType="phone-pad"
									onChangeText={value =>
										this.handleRegisterInput("registerNumber", value)
									}
								/>
							</View>
							{
								invalidRegPhone &&
								<View style={styles.errMsg}>
									<Text style={{ color: '#eb2121', fontSize: 11, lineHeight: 18, padding: 8 }}>有效手机号码必须为9-11位数</Text>
								</View>
							}
							<View style={styles.inputView}>
								<Image resizeMode='stretch' source={require('../../images/login/email.png')} style={{ width: 20, height: 20 }} />
								<TextInput
									style={styles.input}
									underlineColorAndroid="transparent"
									value={emailAddress}
									placeholder="电子邮箱"
									placeholderTextColor="#BCBEC3"
									maxLength={30}
									textContentType="email-address"
									onChangeText={value =>
										this.handleRegisterInput("emailAddress", value)
									}
								/>
							</View>
							{
								invalidRegEmail &&
								<View style={styles.errMsg}>
									<Text style={{ color: '#eb2121', fontSize: 11, lineHeight: 18, padding: 8 }}>错误电子邮格式。</Text>
								</View>
							}
							<View style={styles.inputView}>
								<Image resizeMode='stretch' source={require('../../images/login/code.png')} style={{ width: 20, height: 20 }} />
								<TextInput
									editable={affCodeEditable}
									style={styles.input}
									underlineColorAndroid="transparent"
									value={affCode}
									placeholder="推荐代码"
									placeholderTextColor="#BCBEC3"
									maxLength={16}
									textContentType="username"
									onChangeText={value => {
										let val = value.replace(/[^a-zA-Z0-9]/, '')
										this.handleRegisterInput("affCode", val)
									}}
								/>
								<View style={{ position: 'absolute', right: 10 }}><Text style={{ color: '#bcbec3' }}>(非必填)</Text></View>
							</View>
							<Text style={{ color: '#999', fontSize: 12, paddingBottom: 20, paddingTop: 10 }}>
								点击“注册”，即确认您已年满21周岁，且理解并接受我们的
								<Text
									onPress={() => {
										Linking.openURL('https://www.fun8003.com/cn/help/policy-termsandcondition.htm')
									}}
									style={{ color: '#00a6ff' }}>条款</Text>
								与
								<Text
									onPress={() => {
										Linking.openURL('https://www.fun8003.com/cn/help/policy-privacy.htm')
									}}
									style={{ color: '#00a6ff' }} >隐私政策</Text>
							</Text>
							<Touch onPress={() => { this.postRegist() }} style={[styles.loginOk, { backgroundColor: canReg ? '#00A6FF' : '#EFEFF4' }]}>
								<Text style={{ color: canReg ? '#fff' : '#BCBEC3', textAlign: 'center', lineHeight: 48 }}>注册</Text>
							</Touch>
						</View>
					}
				</View>
				{/*客服懸浮球*/}
				{/* <LivechatDragHoliday /> */}
			</KeyboardAwareScrollView>
		);
	}
}

const mapStateToProps = state => ({
	authToken: state.auth.authToken,
	email: state.auth.email
});

const mapDispatchToProps = dispatch => ({
	login: loginDetails => {
		login(dispatch, loginDetails);
	},
	userInfo_login: username => ACTION_UserInfo_login(username),
	userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
	maintainStatus_noTokenBTI: (isNoToken) => ACTION_MaintainStatus_NoTokenBTI(isNoToken),
	maintainStatus_noTokenIM: (isNoToken) => ACTION_MaintainStatus_NoTokenIM(isNoToken),
	maintainStatus_noTokenSABA: (isNoToken) => ACTION_MaintainStatus_NoTokenSABA(isNoToken),
	userSetting_updateListDisplayType: (currentType) =>	ACTION_UserSetting_Update(currentType),
});


export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
	touchPatten: {
		padding: 10,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	faceLogin:{
		marginTop:  10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	checkName: {
		borderWidth: 1,
		borderColor: '#E3E3E8',
		borderRadius: 4,
		width: 20,
		height: 20,
	},
	checkNameed: {
		width: 20,
		height: 20,
		backgroundColor: '#00A6FF',
		borderRadius: 4
	},
	checkBoxFlex: {
		display: 'flex',
		justifyContent:'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	bgView: {
		height: width * 0.752,
		width: width,
		top: 0,
		left: 0,
	},
	loginNav: {
		width: width,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexDirection: 'row',
		padding: 15,
	},
	loginView: {
		top:-10,
		backgroundColor: '#fff',
		borderTopRightRadius: 15,
		borderTopLeftRadius: 15,
		padding: 20,
		width: width,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loginType: {
		backgroundColor: '#7676801F',
		borderRadius: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 15,
	},
	loginBtn: {
		width: 90,
		backgroundColor: '#00A6FF',
		borderRadius: 50,
	},
	loginTxt: {
		textAlign: 'center',
		lineHeight: 33,
	},
	errMsg: {
		borderRadius: 5,
		backgroundColor: '#FEE5E5',
		marginBottom: 15,
		paddingLeft: 15
	},
	inputView: {
		borderRadius: 8,
		borderColor: '#E6E6EB',
		borderWidth: 1,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: 10,
		paddingRight: 10,
		width: width - 40,
		marginBottom: 15,
	},
	input: {
		width: width * 0.75,
		height:40,
		color: '#000000',
		textAlign: 'left',
		paddingLeft: 15,
		fontSize: 14,
	},
	eyesBtn: {
		position: 'absolute',
		right: 15,
	},
	loginOk: {
		width: width - 40,
		borderRadius: 8,
	},
	sponsorship: {
		marginTop: 25,
		width: width - 40,
		marginBottom: 20,
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
	},
	sponsorshipList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
});
