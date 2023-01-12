import React from "react";
import {
	TouchableOpacity,
	Platform,
	ToastAndroid,
	BackHandler,
	StyleSheet,
	Text,
	View,
	Clipboard,
	Dimensions,
	NativeModules,
	Image,
	Linking,
	NativeEventEmitter
} from "react-native";
import { Flex, Toast, ActionSheet } from "antd-mobile-rn";
import { connect } from "react-redux";
import DeviceInfo from "react-native-device-info"; //獲取設備信息
import {
	Drawer,
	Stack,
	Scene,
	Router,
	Actions,
	ActionConst,
	Lightbox,
	Modal
} from "react-native-router-flux";
// import EuroCup from '../EuroCup/index'
import DrawerContent from './DrawerContent';
// import EuroCupGroup from '../EuroCup/Group/index'
// import EuroGroupDetail from '../EuroCup/Group/EuroGroupDetail'
// import EuroPlayerDetail from '../EuroCup/Group/EuroPlayerDetail'
import PromotionsDetail from '../EuroCup/Tabs/PromoTab/PromotionsDetail/index'
import PromotionsForm from '../EuroCup/Tabs/PromoTab/PromotionsForm/index'
import PromoRebateHistory from '../EuroCup/Tabs/PromoTab/PromoRebateHistory/index'
import PromotionsRebateDetail from '../EuroCup/Tabs/PromoTab/PromotionsRebateDetail/index'
import PromotionsBank from './Bank/PromotionsBank'
import PromotionsAddress from '../EuroCup/Tabs/PromoTab/PromotionsAddress/index'
import Newaddress  from '../EuroCup/Tabs/PromoTab/PromotionsAddress/Newaddress'
import BTIwebView from '../game/BTIwebView'
import PromoTab from '../EuroCup/Tabs/PromoTab/index'
import Login from "./Login/Login";
import Fogetname from "./Login/Fogetname";
import Home from "./Home";
import LoginOtp from './loginOtp/loginOtp'
import SetLoginOtp from './loginOtp/SetLoginOtp'
import RestPassword from './RestPassword/RestPassword'
import SetVerification from './RestPassword/SetVerification'
import SetPassword from './RestPassword/SetPassword'
import News from './News'
import NewsDetail from './NewsDetail'
import RestrictPage from "./RestrictPage"; //限制页面
import Orientation from "react-native-orientation";
import OrientationAndroid from "react-native-orientation-locker";
import Rules from './Help/Rules'
import Setting from './Setting/Setting'
import SetTingModle from './Setting/SetTingModle'
import DepositCenter from './Bank/DepositCenter'
import CTCpage from './Bank/CTCpage'
import DepositPage from './Bank/DepositPage'
import BankCardVerify from './Bank/BankCardVerify'
import DepositCenterPage from './Bank/DepositCenterPage'
import PPBSecondStep from './Bank/PPBSecondStep'
import SRSecondStep from './Bank/SRSecondStep'
import Transfer from './Bank/transfer'
import BetTutorial from './Betting/tutorial'
import Betting_detail from '../game/Betting-detail/index'
import betRecord from './Betting/betRecord'
import search from './search'
import NotificationDetail from './notificationDetail'
import LoginTouch from "./LoginPage/LoginTouch";
import LoginPattern from "./LoginPage/LoginPattern";
import SetLogin from "./LoginPage/SetLogin"
// import LoginFace from "./LoginPage/LoginFace";
// import LoginPage from "./LoginPage/LoginPage";
import FastLogin from "./LoginPage/FastLogin";

import TabIcon from './tabIcon'
import { logout } from "../actions/AuthAction";
import AnalyticsUtil from "./../actions/AnalyticsUtil";
import Touch from "react-native-touch-once";
const RouterWithRedux = connect()(Router);
import User from './User'
import userInfor from './userInfor'
import useraddress from './useraddress'
import bankcard from './bankcard'
import bankcardDetail from './bankcardDetail'
import recordes from './recordes/recordes'
import withdrawal from './withdrawal'
import recordsDatails from './recordes/recordsDatails'
import NewBank from './NewBank'
import CreatWallet from './CreatWallet'
import Withdrawalverification from './Withdrawalverification'
import Verification from './Verification'
import RedoDepositTransaction from './RedoDepositTransaction'
import withdrawalGuide from './withdrawalGuide'
import withdrawalSuccess from './withdrawalSuccess'
import PoppingGame from './MinGame/PoppingGame/PoppingGame'
const AffCodeAndroid = NativeModules.opeinstall; //android 獲取code 參數
const AffCodeIos = NativeModules.CoomaanTools; //ios 獲取code 參數

//  监听原生 UM push  监听外部通知 benji 9/14
const { CheckInvoice } = NativeModules;
const checkInvoiceEmitter = CheckInvoice ? new NativeEventEmitter(CheckInvoice) : ''


const { width, height } = Dimensions.get("window");
let PushNative = NativeModules.PushNative;    //push跳转到原生ios里面
// piwik
window.PiwikEvent = (track, action, name) => {

	//這是給piwik sdk 追蹤
	if (Platform.OS === "android") {
		NativeModules.opeinstall.PiwikTackEvent('Tarck', track, action, name);
	}
	if (Platform.OS === "ios") {
		PushNative.PiwikTackEvent('data', { track, action, name });
	}
}
window.PiwikMenberCode = (data) => {
	if (Platform.OS === "android") {
		NativeModules.opeinstall.PiwikTackEvent('menberCode', data, 'menberCode', 'menberCode');
	}
	if (Platform.OS === "ios") {
		PushNative.PiwikTackMemberCode('data', { track: data });
	}
}
window.PiwikVersion = (data) => {
	if (Platform.OS === "android") {
		NativeModules.opeinstall.PiwikTackEvent('APPVER', data, ' ', ' ');
	}
	if (Platform.OS === "ios") {
		PushNative.PiwikTackVersion('data', { track: data });
	}
}


let backTime = 0;
let time = 0;
const onBackPress = () => {
	if (Actions.state.index == 0) {
		if (Platform.OS === "android") {
			Toast.info("再按一次退出应用", 3);
			if (backTime == 1) {
				BackHandler.exitApp();
			}
			backTime++;
			//BackHandler.exitApp();
			setTimeout(() => {
				backTime = 0;
			}, 3000);

			return true;
		}
	}
	return true;
};

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	componentWillMount(props) {

	}
	componentDidMount() {
		this.getDeviceInfoIos()
		this.openOrientation()
		this.UpushJump();  // UM推送 點擊跳指定頁面
		//喚醒APP 接收參數
		this.CallApp();
		this.getAffliCode()//获取affcdoe
		this.setUMaffCode()
	}

	componentWillUnmount() { }

	CallApp(){
		Linking.getInitialURL().then(url=>{
			//   sb20://token=aaa&rtoken=bbb&deeplink=im&sid=2&eid=45678&lid=89012
			// let url = 'sb20://token=&rtoken=&deeplink=im&sid=1&eid=25813755&lid=19861'
			console.log(url)
			if(url){

				let urlData = url.split('//')[1]
				let list = {}

				urlData && urlData.split('&').forEach((item, i) => {
					list[item.split('=')[0]] = item.split('=')[1] || ''
				})
				if(!list.deeplink || !list.sid) { return }
				window.isMobileOpen = true
				if(list.token) {
					Actions.Login({openList: list})

				} else {

					list.deeplink && window.openApp && window.openApp(list.deeplink, list.sid, list.eid, list.lid)
				}


			//	let vendor,sid,eid,lid
			//	openApp(vendor,sid,eid,lid)
			}
		})
	}

	openOrientation() {
		//锁定竖屏
		if (Platform.OS === "ios") {
			Orientation.lockToPortrait();
		} else {
			OrientationAndroid.lockToPortrait();
		}
	}

	removeOrientation() {
		//移除锁定竖屏
		if (Platform.OS === "ios") {
			Orientation.unlockAllOrientations();
		} else {
			OrientationAndroid.unlockAllOrientations();
		}
	}
	setUMaffCode() {
		setTimeout(() => {
			//首次啟動APP 寫入友盟
			global.storage
				.load({
					key: "OpenAPPready",
					id: "123"
				})
				.then(ret => {
	
				})
				.catch(err => {
					AnalyticsUtil.onEventWithMap("StartAPP", {
						affCode: affCodeKex
					});
					global.storage.save({
						key: "OpenAPPready", // 注意:请不要在key中使用_下划线符号!
						id: "123", // 注意:请不要在id中使用_下划线符号!
						data: '',
						expires: null
					});
				});
		}, 4000);
	}
	// 获取代理码
	getAffliCode() {
		if (Platform.OS === "android") {
			setTimeout(() => {
				if (AffCodeAndroid.getAffCode) {
					//新加的原生參數,如果沒有則拿url 代理號
					AffCodeAndroid.getAffCode(dict => {
						if (dict.CODE != "" && dict.CODE) {
							affCodeKex = dict.CODE;
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
		Clipboard.getString().then( (content)=>{
			if(content.indexOf('affcode&')== 0 ){
				let Acode =content.split('affcode&')[1]
				affCodeKex = Acode
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
	}

	//判断iphonex以上型号
	getDeviceInfoIos = () => {
		if (Platform.OS === "android") {
			window.DeviceInfoIos = false;
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

	UpushJump() {
		//友盟推送接收

		setTimeout(() => {
			if (Platform.OS == "android") {

				//原生事件不存在 終止事件
				if (!AffCodeAndroid.getUMMSG) {
					return
				}
				AffCodeAndroid.getUMMSG(info => {
					console.log(info, 'umMSGAAA')
					if (info.CODE) {
						let msgD = JSON.parse(info.CODE);
						console.log(msgD, 'umMSG')
						if (msgD.url) {

							if (msgD.url == "registered") {
								Logonregist();
							}

							if (msgD.url == "inbox") {
								UmPma = true//全局參數 在home.js執行跳收件箱
								if (ApiPort.UserLogin == true) {  //已登陸狀態
									Actions.news();
									UmPma = false;
								}
							}

						}

					}


				});


			}

			if (Platform.OS == "ios") {

				//獲取原生事件失敗 停止
				if (checkInvoiceEmitter == '') {
					return;
				}
				//  监听iOS原生 UM push  监听外部通知 benji 9/14
				checkInvoiceEmitter.addListener(
					'didReceiveNotification', (info) => {
						//Clipboard.setString(info.aps.alert.jump1)

						if (info.url) {

							if (info.url == "registered") {
								Logonregist();
							}
							if (info.url == "inbox") {
								UmPma = true//全局參數 在home.js執行跳收件箱
								if (ApiPort.UserLogin == true) {  //已登陸狀態
									Actions.news();
									UmPma = false;
								}
							}

						}
					}
				)
			}

		}, 10000)
	}


	navigateToScene(key, item, logoutx) {
		// if(common_url == "https://gateway.rb88.biz"){
		// if (key == "Bettingrecord") {
		// 	Actions.BettingrecordNews();
		// 	return;
		// }
		// //    }

		// if (key == "Registered") {
		// 	this.props.logout();
		// 	setTimeout(() => {
		// 		// Actions.loginS({type:"register"});
		// 		// navigateToSceneGlobe()
		// 		Logonregist && Logonregist();
		// 	}, 50);
		// 	setTimeout(() => {
		// 		Gologin = true;
		// 	}, 2000);
		// 	key = "login";
		// 	return;
		// }
		if(item) {
			setTimeout(() => {
				Toasts.fail(item)
			}, 1500);
		}
		getMiniGames = false
		if (key === "logout") {
			ApiPort.Token = "";
			global.storage.remove({
				key: "memberInfo",
				id: "memberInfos"
			});

			if (logoutx) {
				if (ApiPort.UserLogin == true) {
					// global.storage.remove({
					//   key: "username",
					//   id: "nameTLC"
					// });

					// global.storage.remove({
					// 	key: "password",
					// 	id: "passwordrb88"
					// });
					this.logout();
				}
			}
			global.localStorage.setItem('loginStatus', 0);
			ApiPort.UserLogin = false;
			isMobileOpen = false
			this.props.logout();
			setTimeout(() => {
				Gologin = true;
			}, 2000);
			key = "login";
			AnalyticsUtil.onEvent("logout_sidemenu");
			return;
		}

		Actions[key]({});


	}

	logout() {
		const memberDataLogin = window.memberDataLogin;

		let data = {
			clientId: "Fun88.CN.App",
			clientSecret: "muitten",
			refreshToken: memberDataLogin.accessToken
				? memberDataLogin.accessToken.refresh_token
				: "",
			accessToken: memberDataLogin.accessToken
				? memberDataLogin.accessToken.access_token
				: "",
			memberCode: memberDataLogin.memberInfo
				? memberDataLogin.memberInfo.memberCode
				: "",
			deviceToken: window.Devicetoken,
			packageName: "nettium.fun.native",
			imei: "",
			macAddress: window.userMAC,
			serialNumber: "",
			pushNotificationPlatform: "umeng+",
			os: Platform.OS === "android" ? 'Android' : 'iOS'
		};
		fetchRequest(ApiPort.logout, "POST", data)
			.then(data => {
				//console.log(data)
			})
			.catch(error => {
				Toast.hide();
			});
	}


	render() {
		window.openOrientation = () => {
			this.openOrientation()
		}
		window.removeOrientation = () => {
			this.removeOrientation()
		}


		window.navigateToSceneGlobe = () => {
			this.navigateToScene("logout", "", true);
		};
		window.navigateToSceneGlobeLoginOut = (msg) => {
			this.navigateToScene("logout", msg, true);
		}

		const DrawerImage = () => {
			return (
				<View style={styles.drawerImageComponent}>
					<Image
						source={require("../images/drawer/drawer.png")}
						style={styles.drawerImage}
					/>
				</View>
			);
		};
		const LiveChackIcon = (type) => {
			return (
				<Touch onPress={() => {
					if(type == 'DepositCenter') {
						PiwikEvent('LiveChat', 'Launch', 'Deposit_CS')
					} else if(type == 'Transfer') {
						PiwikEvent('LiveChat', 'Launch', 'Transfer_CS')
					}
					LiveChatOpenGlobe()
				}} style={{ paddingRight: 15 }}>
					<Image
						source={require("../images/cs.png")}
						style={{ width: 30, height: 30 }}
					/>
				</Touch>
			);
		}
		return (
			<RouterWithRedux
				backAndroidHandler={onBackPress}
				onStateChange={() => { }}
			>
				<Modal key="modal" hideNavBar>
					<Lightbox key="lightbox">
						<Stack
							key="root"
							navigationBarStyle={{
								borderBottomWidth: 0,
								backgroundColor: '#00A6FF',
								height: 0
							}}
							headerLayoutPreset="center"
						>
							<Drawer
								key="drawer"
								hideNavBar
								initial={this.props.scene === 'home'}
								headerLayoutPreset="left"
								contentComponent={DrawerContent}
								drawerIcon={<View />}
								drawerWidth={width * 0.8}
								type={ActionConst.REPLACE}
							>
								{/* <Scene
									key="home"
									component={Home}
									navigationBarStyle={styles.navigationBarStyleHeightsmall}
									on={() => { window.homeClick && window.homeClick() }}
								/> */}

								<Scene key="tabbar"
									//hideNavBar
									tabs={true}
									tabBarPosition="bottom"
									showLabel={false}
									tabBarStyle={styles.tabBarStyle}
									tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
									titleStyle={styles.titleStyle}>
									<Scene key="home1"

										// renderRightButton={() => { return <LiveChack /> }}
										component={Home}
										icon={TabIcon}
										onEnter={() => {
											window.CheckUptateGlobe && window.CheckUptateGlobe()
											window.MiniGamesBanners && window.MiniGamesBanners()
											PiwikEvent('Navigation', 'Launch', 'Home_BottomNav')
										}}
										titleStyle={styles.titleStyle} />
									<Scene key="promotion"

										// renderRightButton={() => { return <LiveChack /> }}
										component={PromoTab}
										icon={TabIcon}
										onEnter={() => {
											window.CheckUptateGlobe && window.CheckUptateGlobe()
											PiwikEvent('Profile', 'Launch', 'Profile_BottomNav')
										}}
										titleStyle={styles.titleStyle} />
									<Scene key="personal"

										// renderRightButton={() => { return <LiveChack /> }}
										component={User}
										icon={TabIcon}
										onEnter={() => {
											window.CheckUptateGlobe && window.CheckUptateGlobe()
											PiwikEvent('Profile', 'Launch', 'Profile_BottomNav')
										}}
										titleStyle={styles.titleStyle} />
								</Scene>
							</Drawer>

							{/* <Scene
								hideNavBar
								key="login"
								component={Login}
								title="Login"
								initial={this.props.scene === "login"}
								renderBackButton={() => null} // removing back button
							/> */}

						</Stack>
					</Lightbox>

					<Stack
						key="betRecord"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
							<Scene key="betRecord" component={betRecord} />
					</Stack>

					<Stack
						key="search"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
							<Scene key="search" component={search} />
					</Stack>




					<Stack
						key="Rules"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
							<Scene key="Rules" component={Rules} />
					</Stack>
					<Stack
						key="Login"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
							<Scene key="Login" component={Login} />
					</Stack>

					<Stack
						key="Fogetname"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
						<Scene key="Fogetname" component={Fogetname} />
					</Stack>

					<Scene key="LoginOtp" component={LoginOtp} />
					<Stack
						key="SetLoginOtp"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
						renderRightButton={() => {
							return <LiveChackIcon />;
						}}
					>
						<Scene titleStyle={styles.titleStyle} key="SetLoginOtp" component={SetLoginOtp} title="手机验证" />
					</Stack>
					<Scene key="RestPassword" component={RestPassword} />
					<Stack
						key="SetVerification"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
						renderRightButton={() => {
							return <LiveChackIcon />;
						}}
					>
						<Scene titleStyle={styles.titleStyle} key="SetVerification" component={SetVerification} title="手机验证" />
					</Stack>

					<Stack
						key="RestrictPage"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyle}
						renderLeftButton={() => {
							return (
								<View style={{ width: width, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<Image
										source={require("../images/logio.png")}
										style={{ width: 70, height: 32 }}
									/>
								</View>
							)
						}}
						renderRightButton={() => {
							return <LiveChackIcon />;
						}}
					>
						<Scene key="RestrictPage" component={RestrictPage} />
					</Stack>
					<Stack
						key="SetPassword"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyle}
						renderRightButton={() => {
							return <LiveChackIcon />;
						}}
					>
						<Scene titleStyle={styles.titleStyle} key="SetPassword" component={SetPassword} title="更换密码" />
					</Stack>

					<Stack
						key="News"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
						<Scene key="News" component={News} />
					</Stack>
					<Stack
						key="Betting_detail"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
						<Scene key="Betting_detail" component={Betting_detail} />
					</Stack>

					<Stack
						key="NewsDetail"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="NewsDetail" component={NewsDetail} title="消息详情" />
					</Stack>
					<Stack
						key="Setting"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="Setting" component={Setting} title="系统设置" />
					</Stack>
					<Stack
						key="SetTingModle"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="SetTingModle" component={SetTingModle} title="自定义快捷金额" />
					</Stack>
					<Stack
						key="DepositCenter"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="DepositCenter" component={DepositCenter} title="存款" renderRightButton={() => {
							return <LiveChackIcon type={'DepositCenter'} />;
						}} />
					</Stack>

					<Stack
						key="userInfor"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="userInfor" component={userInfor} title="账户资料" renderRightButton={() => {
							return <LiveChackIcon type={'userInfor'} />;
						}} />
					</Stack>

					<Stack
						key="useraddress"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="useraddress" component={useraddress} title="联系地址" renderRightButton={() => {
							return <LiveChackIcon type={'useraddress'} />;
						}} />
					</Stack>
					<Stack
						key="BankCardVerify"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="BankCardVerify" component={BankCardVerify} title="账户验证" renderRightButton={() => {
							return <LiveChackIcon type={'BankCardVerify'} />;
						}} />
					</Stack>
					<Stack
						key="bankcard"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="bankcard"
						 component={bankcard} title="银行信息" renderRightButton={() => {
							return <LiveChackIcon type={'bankcard'} />;
						}} />
					</Stack>

					<Stack
						key="bankcardDetail"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="bankcardDetail"
						 component={bankcardDetail} title="账户信息" renderRightButton={() => {
							return <LiveChackIcon type={'bankcardDetail'} />;
						}} />
					</Stack>


					<Stack
						key="Verification"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="Verification"
						 component={Verification} renderRightButton={() => {
							return <LiveChackIcon type={'Verification'} />;
						}} />
					</Stack>

					<Stack
						key="withdrawalSuccess"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene title='提款' titleStyle={styles.titleStyle} key="withdrawalSuccess"
						 component={withdrawalSuccess} renderRightButton={() => {
							return <LiveChackIcon type={'withdrawalSuccess'} />;
						}} />
					</Stack>




					<Stack
						key="RedoDepositTransaction"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} title='重新提交存款' key="RedoDepositTransaction"
						 component={RedoDepositTransaction} renderRightButton={() => {
							return <LiveChackIcon type={'RedoDepositTransaction'} />;
						}} />
					</Stack>




					<Stack
						key="withdrawalGuide"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="withdrawalGuide"
						 component={withdrawalGuide} renderRightButton={() => {
							return <LiveChackIcon type={'withdrawalGuide'} />;
						}} />
					</Stack>


					<Stack
						key="recordes"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="recordes"
						 component={recordes} title="交易记录" renderRightButton={() => {
							return <LiveChackIcon type={'recordes'} />;
						}} />
					</Stack>

					<Stack
						key="NewBank"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="NewBank"
						 component={NewBank} title="添加银行账户" renderRightButton={() => {
							return <LiveChackIcon type={'NewBank'} />;
						}} />
					</Stack>


					<Stack
						key="Withdrawalverification"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="Withdrawalverification"
						 component={Withdrawalverification} title="账户验证" renderRightButton={() => {
							return <LiveChackIcon type={'Withdrawalverification'} />;
						}} />
					</Stack>



					<Stack
						key="withdrawal"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="withdrawal"
						 component={withdrawal} title="提款" renderRightButton={() => {
							return <LiveChackIcon type={'withdrawal'} />;
						}} />
					</Stack>


					<Stack
						key="recordsDatails"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="recordsDatails"
						 component={recordsDatails}  renderRightButton={() => {
							return <LiveChackIcon type={'recordsDatails'} />;
						}} />
					</Stack>

					<Stack
						key="CreatWallet"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="CreatWallet"
						 component={CreatWallet}
						// title='添加银行账户'
						  renderRightButton={() => {
							return <LiveChackIcon type={'CreatWallet'} />;
						}} />
					</Stack>
					<Stack
						key="BTIwebView"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="BTIwebView"
						 component={BTIwebView}
						title='BTI'  />
					</Stack>










					<Stack
						key="Transfer"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="Transfer" component={Transfer} title="转账" 	renderRightButton={() => {
							return <LiveChackIcon type={'Transfer'} />;
						}} />
					</Stack>

					<Stack
						key="CTCpage"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="CTCpage" component={CTCpage} title="CTC充值提示" renderRightButton={() => {
							return <LiveChackIcon />;
						}} />
					</Stack>
					<Stack
						key="NotificationDetail"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="NotificationDetail" component={NotificationDetail} title="消息详情" />
					</Stack>

					<Stack
						backButtonImage={require('../images/closeWhite.png')}
						key="DepositPage"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="DepositPage" component={DepositPage} title="第三方充值页面" renderRightButton={() => {
							return <LiveChackIcon />;
						}}/>
					</Stack>
					<Stack
						key="DepositCenterPage"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="DepositCenterPage" component={DepositCenterPage} title="充值第二步" renderRightButton={() => {
							return <LiveChackIcon />;
						}} />
					</Stack>

					<Stack
						key="PPBSecondStep"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="PPBSecondStep" component={PPBSecondStep} title="网银转账" renderRightButton={() => {
							return <LiveChackIcon />;
						}} />
					</Stack>
					<Stack
						key="SRSecondStep"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="SRSecondStep" component={SRSecondStep} title="小额存款" renderRightButton={() => {
							return <LiveChackIcon />;
						}} />
					</Stack>
					<Stack
						key="BetTutorial"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
							<Scene key="BetTutorial" component={BetTutorial} />
					</Stack>
					{/* <Stack
						key="EuroCupGroup"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="EuroCupGroup" component={EuroCupGroup} title="统计" />
					</Stack> */}
					{/* <Stack
						key="EuroGroupDetail"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="EuroGroupDetail" component={EuroGroupDetail} title="队伍详情" />
					</Stack> */}
					{/* <Stack
						key="EuroPlayerDetail"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="EuroPlayerDetail" component={EuroPlayerDetail} title="球员信息" />
					</Stack> */}
					<Stack
						key="PromotionsDetail"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="PromotionsDetail" component={PromotionsDetail} title="优惠详情" />
					</Stack>
					<Stack
						key="PromotionsForm"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="PromotionsForm" component={PromotionsForm} title="查看运送资料" />
					</Stack>
					<Stack
						key="PromoRebateHistory"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="PromoRebateHistory" component={PromoRebateHistory} title="返水历史" />
					</Stack>
					<Stack
						key="PromotionsRebateDetail"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="PromotionsRebateDetail" component={PromotionsRebateDetail} title="好礼详情" />
					</Stack>
					<Stack
						key="PromotionsBank"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="PromotionsBank" component={PromotionsBank} title="优惠申请" renderRightButton={() => {
							return <LiveChackIcon />;
						}} />
					</Stack>
					<Stack
						key="PromotionsAddress"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="PromotionsAddress" component={PromotionsAddress} title="运送详情" />
					</Stack>
					<Stack
						key="Newaddress"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="Newaddress" component={Newaddress} title="填写运送资料" />
					</Stack>


					<Stack
						key="LoginTouch"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="LoginTouch" component={LoginTouch} title="脸部辨识认证" renderRightButton={() => {
							return <LiveChackIcon />;
						}} />
					</Stack>
					<Stack
						key="LoginPattern"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="LoginPattern" component={LoginPattern} title="设定图形密码" renderRightButton={() => {
							return <LiveChackIcon />;
						}} />
					</Stack>
					<Stack
						key="SetLogin"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={styles.navigationBarStyle}
					>
						<Scene titleStyle={styles.titleStyle} key="SetLogin" component={SetLogin} title="快速登入" renderRightButton={() => {
							return <LiveChackIcon />;
						}} />
					</Stack>
					<Stack
						key="FastLogin"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
							<Scene key="FastLogin" component={FastLogin} />
					</Stack>


					{/* <Stack
						key="EuroCup"
						headerLayoutPreset="center"
						navigationBarStyle={styles.navigationBarStyleHeightsmall}
					>
							<Scene key="EuroCup" component={EuroCup} />
					</Stack> */}

					<Stack
						key="PoppingGame"
						headerLayoutPreset="center"
						back
						backButtonTintColor="#fff"
						navigationBarStyle={[styles.navigationBarStyle,{backgroundColor: '#00A6FF'}]}
					>
						<Scene titleStyle={styles.titleStyle} key="PoppingGame" component={PoppingGame} title="FUN庆14周年" renderRightButton={() => {
							return <LiveChackIcon />;
						}}/>
					</Stack>
					
				</Modal>
			</RouterWithRedux>
		);
	}
}

const mapStateToProps = state => {
	return {
		scene: state.scene.scene
	};
};

const mapDispatchToProps = dispatch => ({
	logout: loginDetails => {
		logout(dispatch, loginDetails);
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

const styles = StyleSheet.create({

	routerScene: {
		padding: 0
	},


	drawerImageComponent: {
		width: 32,
		height: "100%",
		justifyContent: "flex-end",
		alignContent: "flex-end",
		alignItems: "flex-end"
	},
	drawerImage: {
		width: 32,
		height: 32,
		bottom: 10
	},
	titleStyle: {
		color: '#fff'
	},
	navigationBarStyle: {
		backgroundColor: '#00a6ff',
		borderBottomWidth: 0,
	},
	navigationBarStyleHeightsmall: {
		backgroundColor: '#00a6ff',
		height:0,
		borderBottomWidth: 0,
	}
});
