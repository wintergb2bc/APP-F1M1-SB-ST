import React from "react";
import {
	StyleSheet,
	WebView,
	Text,
	View,
	Animated,
	TouchableOpacity,
	Dimensions,
	Image,
	ScrollView,
	Modal,
	Platform,
	NativeModules,
	TextInput,
	KeyboardAvoidingView,
	TouchableHighlight,
	Settings
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import {
	Carousel,
	WhiteSpace,
	WingBlank,
	Flex,
	Toast,
	InputItem,
	ActivityIndicator,
	List,
	Picker
} from "antd-mobile-rn";
const { width, height } = Dimensions.get("window");
import { connect } from "react-redux";
import reactUpdate from 'immutability-helper';
import ModalDropdown from 'react-native-modal-dropdown';
import {
	ACTION_MaintainStatus_SetBTI, ACTION_MaintainStatus_SetIM, ACTION_MaintainStatus_SetSABA
} from '../lib/redux/actions/MaintainStatusAction';
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from '../lib/redux/actions/UserInfoAction';
import VendorBTI from '$LIB/vendor/bti/VendorBTI';
import VendorIM from '$LIB/vendor/im/VendorIM';
import VendorSABA from '$LIB/vendor/saba/VendorSABA';
const newSelsctDate3 = [1, 2, 3, 4, 5]

let gameDBs = [
	{
		id: 'IM',
		name: 'IM',
		count: null,
		sort: 0,
	},
	{
		id: 'SABA',
		name: '沙巴',
		count: null,
		sort: 1,
	},
	{
		id: 'BTI',
		name: 'BTI',
		count: null,
		sort: 2,
	},
]

class HomeHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			BtnPosTop: 0,
			BtnPosLeft: 0,
			gameDB: [...gameDBs],
			nowGame: 'IM',
			nowGameName: 'IM',
			gameMenuState: false,
			balance: '',
			maintenancePopup: false,
			eye: true,
			selfExclusionRestrictionModal: false,
			selfExclusion: '',
		};
		this.IMCountPollingKey = null;
		this.BTICountPollingKey = null;
		this.SABACountPollingKey = null;

		this.timer = null;
		this.isDidUnmount = null; //紀錄是否已unmount，判斷異步動作是否還要執行
		this.trCountDataHasSet = false;
	}
	componentWillMount(props) {
		this.getMaintenanceStatus();
	}
	componentDidMount() {
		this.isDidUnmount = false;
		this.checkCount('IM')
		// this.openDraws()
		if(ApiPort.UserLogin == true) {
			this.props.userInfo_getBalanceSB(true);
		}
	}

	componentWillUnmount() {
		this.isDidUnmount = true;
		//刪除數量輪詢key
		VendorBTI.deletePolling(this.BTICountPollingKey);
		VendorIM.deletePolling(this.IMCountPollingKey);
		VendorSABA.deletePolling(this.SABACountPollingKey);
		clearTimeout(this.timer);
	}

	openDraws() {
		global.storage
		.load({
			key: "drawerOpen",
			id: "drawerOpen"
		})
		.then(res => { })
		.catch(err => {
			setTimeout(() => { Actions.drawerOpen() },1000)
			global.storage.save({
				key: "drawerOpen",
				id: "drawerOpen",
				data: 'drawerOpen',
				expires: 24 * 60 * 60 * 1000
			});
		});
	}
	// 獲取維護資訊
	getMaintenanceStatus = () => {
		const providers = ['SBT', 'IPSB', 'OWS' ]; // BTI, IM, SABA
		let processed = [];

		providers.forEach(function (provider) {
			processed.push(fetchRequest(`${ApiPort.GetProvidersMaintenanceStatus}provider=${provider}&`));
		});

		Promise.all(processed).then((res) => {
			let BTISportStatus;
			let IMSportStatus;
			let SABASportStatus;

			if (res) {
				BTISportStatus =
					res[0].ErrorCode == 0 && res[0].Result && res[0].Result.find((v) => v.PlatformGroup === 'Apps')['IsMaintenance'];
				IMSportStatus =
					res[1].ErrorCode == 0 && res[1].Result && res[1].Result.find((v) => v.PlatformGroup === 'Apps')['IsMaintenance'];
				SABASportStatus =
					res[2].ErrorCode == 0 && res[2].Result &&	res[2].Result.find((v) => v.PlatformGroup === 'Apps')['IsMaintenance'];
				let nowGame = lowerV

				// BTISportStatus = true

				this.props.maintainStatus_setBTI(BTISportStatus === true);
				this.props.maintainStatus_setIM(IMSportStatus === true);
				this.props.maintainStatus_setSABA(SABASportStatus === true);

				//和token獲取狀態一起判斷
				BTISportStatus = this.checkMaintenanceStatus('bti');
				IMSportStatus = this.checkMaintenanceStatus('im');
				SABASportStatus = this.checkMaintenanceStatus('saba');

				// 都在維修
				if (BTISportStatus && IMSportStatus && SABASportStatus) {
					Actions.RestrictPage({ from: 'maintenance' })
					return
				}

				const maintenanceInfoMap = {
					'BTI': {
						sport: 'BTI',
						gameName: 'BTI',
						name: 'BTI体育',
						isMaintenance: BTISportStatus,
					},
					'IM': {
						sport: 'IM',
						gameName: 'IM',
						name: 'IM体育',
						isMaintenance: IMSportStatus,
					},
					'SABA': {
						sport: 'SABA',
						gameName: '沙巴',
						name: '沙巴体育',
						isMaintenance: SABASportStatus,
					},
				}
				//如果有維修 按優先順序選擇 (直接復用上面的數據)
				const sportPriority = [
					maintenanceInfoMap['IM'],
					maintenanceInfoMap['SABA'],
					maintenanceInfoMap['BTI'],
				];
				const minfo = maintenanceInfoMap[nowGame];

				//當前遊戲正在維修
				if (minfo && minfo.isMaintenance) {
					let targetGame = null;
					//按優先順序 找一個 沒在維護中的遊戲
					for(let spinfo of sportPriority) {
						if (!spinfo.isMaintenance) {
							targetGame = spinfo;
							break;
						}
					}
					if (targetGame === null) { //都在維護(理論上不可能跑到這，前面已經先檢查過了)
						Actions.RestrictPage({ from: 'maintenance' })
						return
					} else {
						this.setState(
							{
								maintenancePopup: true,
								maintenanceSport: minfo.name,
								jumpToSport: targetGame.name,
							},
							() => {}
						);

						clearTimeout(this.timer);
						this.timer = setTimeout(() => {
							window.changeGame(targetGame.sport)
							this.setState({
								maintenancePopup: false,
								gameDB:  [...gameDBs].sort((a, b) => a.sort - b.sort),
								nowGame: targetGame.sport,
								nowGameName: targetGame.gameName,
							})
						}, 8000)
					}
				}
			}
		});
	};

	checkMaintenanceStatus = (name) => {
		const { isBTI, isIM, isSABA, noTokenBTI, noTokenIM, noTokenSABA } = this.props.maintainStatus;
		const { isLogin } = this.props.userInfo; //有登入才額外判斷 token獲取狀態
		switch (name) {
			case 'bti':
				return isBTI || (isLogin && noTokenBTI);
			case 'im':
				return isIM || (isLogin && noTokenIM);
			case 'saba':
				return isSABA || (isLogin && noTokenSABA);
			default:
				return false;
		}
	};

	GameMenu(item, euro = false) {
		if (item && this.checkMaintenanceStatus(item.id.toLowerCase())) { return }
		if (this.state.nowGame == item.id) { return }

		if (item.id == 'IM') {
			PiwikEvent('Vendor', 'View', 'TopNav_IM')
		} else if (item.id == 'BTI') {
			PiwikEvent('Vendor', 'View', 'TopNav_BTi')
		} else if (item.id == 'SABA') {
			PiwikEvent('Vendor', 'View', 'TopNav_OW')
		}

		this.setState({
			nowGame: item ? item.id : this.state.nowGame,
			nowGameName: item ? item.name : this.state.nowGameName,
			gameMenuState: euro? false: !this.state.gameMenuState
		})
		window.changeGame && window.changeGame(item.id)
		this.checkCount(item.id)
	}

	getBTIurl() {
		this.setState({gameMenuState: false})
		if(ApiPort.UserLogin == false) {
			Actions.Login()
			return
		}
		let params = {
			'token': ApiPort.Token.split(' ')[1],
			'provider': 'SBT',
			'hostName': common_url,
			'productCode': 'SBT',
			'platform': 'Mobile',
			'mobileLobbyUrl': common_url,
			'sportsMenu': '',
			'bankingUrl': common_url,
			'logoutUrl': common_url + '/accessdenied',
			'supportUrl': common_url
		}
		fetchRequest(ApiPort.Games + 'isDemo=false&', "POST", params)
			.then(data => {
				if(data.gameLobbyUrl) {
					Actions.BTIwebView({gameLobbyUrl: data.gameLobbyUrl})
				} else {
					Toasts.error('网络错误，请重试');
				}
			})
			.catch(() => {})
	}

	checkCount = async (id) =>  {

		//更新滾球數量
		const updateCount = (targetId) => {
			return (pollingResult) => {
				if (this.isDidUnmount) return;

				const SportDatas = pollingResult.NewData;
				let totalRunningCount = 0;
				SportDatas.map((sport) => {
					const runningMarkets = sport.Markets.filter((m) => m.MarketId === 3); //3滾球
					if (runningMarkets && runningMarkets.length > 0) {
						totalRunningCount = totalRunningCount + runningMarkets[0].Count;
					}
				});
				console.log('totalRunningCount',totalRunningCount)
				let targetIndex = -1;
				gameDBs.map((item, index) => {
					if (item.id === targetId) {
						targetIndex = index;
					}
				});
				if (targetIndex > -1) {
					gameDBs[targetIndex].count = totalRunningCount;
					this.setState({ gameDB: [...gameDBs].sort((a, b) => a.sort - b.sort) },() => {
						if (!this.trCountDataHasSet && this.state.gameDB.some(o => o.count !== null)) {
							this.trCountDataHasSet = true;
						}
					});
				}
			};
		};

		const handleInitialCache = (cacheData) => {
			if (this.isDidUnmount) return;

			if (cacheData && (window.initialCache[id].isUsedForHeader !== true)) {
				if (!this.trCountDataHasSet) { //確定沒數據才用
					console.log('=======Header USE API CACHE for trCount=======')
					gameDBs.map((item) => {
						item.count = cacheData.trCount[item.id];
					});
					this.setState({gameDB: [...gameDBs].sort((a, b) => a.sort - b.sort)}, () => {
						this.trCountDataHasSet = true;
					});
				}
				window.initialCache[id].isUsedForHeader = true; //標記為已使用
			} else {
				console.log('=======Header ABORT USE API CACHE=======')
			}
		}

		if(ApiPort.UserLogin !== true){
			//優化Performance:未登入，優先等待並使用 initialCache
			let cacheData = await window.initialCache[id].cachePromise;
			handleInitialCache(cacheData);
		} else {
			//已登入則按原方式 initialCache 和 正常獲取 競速，先拿到的先用
			window.initialCache[id].cachePromise.then(handleInitialCache);
		}


		if (id === 'IM') {
			//選中IM 只刷新BTI/SABA Count
			VendorIM.deletePolling(this.IMCountPollingKey);
			this.BTICountPollingKey = VendorBTI.getSportsPollingGlobal('headerCount', updateCount('BTI'));
			this.SABACountPollingKey = VendorSABA.getSportsPollingGlobal('headerCount', updateCount('SABA'));
		} else if (id === 'BTI') {
			//選中BTI 刷新IM/SABA Count
			VendorBTI.deletePolling(this.BTICountPollingKey);
			this.IMCountPollingKey = VendorIM.getSportsPollingGlobal('headerCount', updateCount('IM'));
			this.SABACountPollingKey = VendorSABA.getSportsPollingGlobal('headerCount', updateCount('SABA'));
		} else if (id === 'SABA') {
			//選中SABA 只刷新IM/BTI Count
			VendorSABA.deletePolling(this.SABACountPollingKey);
			this.IMCountPollingKey = VendorIM.getSportsPollingGlobal('headerCount', updateCount('IM'));
			this.BTICountPollingKey = VendorBTI.getSportsPollingGlobal('headerCount', updateCount('BTI'));
		}
	}


	Jump(key) {
		console.log(key, 'kkkkks')
		if (!ApiPort.UserLogin && key != 'search') {
			Actions.Login()
			return
		}
		Actions[key]({Vendor:window.VendorData});
	}
	getBtnPos = (e) => {
		NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
			this.setState({
				BtnPosTop: py,
				BtnPosLeft: px,
			});
			console.log('pypypypypypypy',py)
		});
	}

	render() {
		//用于点击欧冠切换im
		window.GameMenus = (key) => {
			this.GameMenu(this.state.gameDB[key], true)
		}
		//header和home一起切換
		window.changeGameFullPage = (vendorName) => {
			let targetItem = null;
			this.state.gameDB.map(item => {
				if (item.id == vendorName) {
					targetItem = item;
				}
			})
			if (targetItem) {
				this.GameMenu(targetItem, true) //euro = true表示不展示體育vendor下拉菜單
			}
		}
		//自我锁定弹窗
		window.GetSelfExclusionRestriction = (key) => {

			global.storage
			.load({
				key: 'SelfExclusionRestriction',
				id: 'SelfExclusionRestriction'
			})
			.then(data => {
				if(window.SelfExclusionRestriction[key]) {
					this.setState({ selfExclusionRestrictionModal: true, selfExclusion: data })
				}
			})
			.catch(err => {});

			if(window.SelfExclusionRestriction[key]) {
				return true
			}
			return false
		}
		const {
			nowGame,
			nowGameName,
			gameDB,
			gameMenuState,
			balance,
			eye,
			BtnPosTop,
			BtnPosLeft,
			maintenancePopup,
			selfExclusionRestrictionModal,
			selfExclusion,
		} = this.state;

		return (
			<View>
				<View style={styles.headers}>
					{/* 维护 */}
					<Modal
						animationType="none"
						transparent={true}
						visible={maintenancePopup}
						onRequestClose={() => { }}
					>
						<View style={styles.modals}>
							<View style={styles.modalView}>
								<Image resizeMode='stretch' source={require('../images/maintenance.png')} style={{ width: 76, height: 76 }} />
								<Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>平台维护通知</Text>
								<Text style={{ color: '#999',lineHeight: 22 }}>亲爱的会员，{this.state.maintenanceSport}正在维护，</Text>
								<Text style={{ color: '#999' }}>请稍后回来。我们将在8秒内带您前往{this.state.jumpToSport}。</Text>
							</View>
						</View>
					</Modal>

					<Modal
						animationType="none"
						transparent={true}
						visible={selfExclusionRestrictionModal}
						onRequestClose={() => { }}
					>
						<View style={styles.modals}>
							<View style={styles.selfExclusion}>
								<View style={styles.selfExclusionTitle}>
									<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>自我限制</Text>
								</View>
								{
									selfExclusion != '' &&
									<Text onPress={() => { this.setState({selfExclusionRestrictionModal: false}, () => {
										LiveChatOpenGlobe()
										Actions.home1()
									})}} style={styles.selfExclusionMsg}>
										您在 {selfExclusion.SelfExcludeSetDate.split('T')[0].replace('-', '/')} 已成功设定（{selfExclusion.SelfExclusionSettingID == 3? '永久': (selfExclusion.SelfExcludeDuration + '天')}）自我行为控制，如需要任何帮助，请联系<Text style={{color: '#00A6FF'}}>在线客服</Text>。
									</Text>
								}
								<Touch onPress={() => { this.setState({selfExclusionRestrictionModal: false}) }} style={styles.selfExclusionBtn}>
									<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>知道了</Text>
								</Touch>
							</View>
						</View>
					</Modal>

					{/*左邊遊戲切換*/}
					<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
						<Touch onPress={() => { Actions.drawerOpen() }} style={{ width: 40 }}>
							<Image source={require("../images/drawer/drawer.png")} style={{ height: 32, width: 32 }} />
						</Touch>
						<View onLayout={(e) => this.getBtnPos(e)}>
							<Touch onPress={() => { this.setState({gameMenuState: !gameMenuState}) }} style={styles.gameList}>
								<Text style={styles.GameMenuText}>{nowGameName}</Text>
								<Image source={require("../images/dow.png")} style={{ height: 26, width: 26 }} />
							</Touch>
						</View>
						<Modal
							animationType="none"
							transparent={true}
							visible={gameMenuState}
							onRequestClose={() => { }}
						>
							<View style={styles.gameMenuModals}>
								<TouchableOpacity style={styles.modalMark} onPress={() => { this.setState({ gameMenuState: false }) }}></TouchableOpacity>
								<View style={[styles.Gamedropdown,{top: BtnPosTop, left: BtnPosLeft}]}>
									<Touch onPress={() => { this.setState({gameMenuState: !gameMenuState}) }} style={styles.gameListDown}>
										<Text style={styles.GameMenuTextC}>{nowGameName}</Text>
										<Image source={require("../images/dowBlue.png")} style={{ height: 26, width: 26 }} />
									</Touch>
									{gameMenuState &&
										gameDB.map((item, index) => {
											return (
												item.id != nowGame &&
												<View key={index}>
													<Touch onPress={() => { this.GameMenu(item) }} style={styles.gameListDown}>
														<View>
															<Text style={styles.GameMenuTextB}>{item.name}</Text>
														</View>
														{
															this.checkMaintenanceStatus(item.id.toLowerCase()) ? <View style={styles.maintenance}><Text style={{ color: '#704708' }}>维修</Text></View>
																: <Text style={{color: '#000'}}>{item.count}</Text>
														}
													</Touch>
												</View>
											)
										})
									}
								</View>
							</View>
						</Modal>
					</View>
					{/*左邊遊戲切換*/}


					{/*餘額*/}
					{ApiPort.UserLogin &&
						<View style={styles.MoneyBG}>

							<View style={{
								flexDirection: 'row',
								backgroundColor: '#0895E5',
								height: 30,
								paddingLeft: 8,
								paddingRight: 8,
								borderRadius: 6, justifyContent: 'center',
								alignItems: 'center',
							}}>
								{eye ?

									<View >
										<Touch onPress={() => { this.setState({ eye: eye ? false : true }) }} style={{
											flexDirection: 'row', justifyContent: 'center',
											alignItems: 'center',
										}}>
											{/* <Text style={{ color: '#fff' }}>￥ {balance ? balance : '0.00'}</Text> */}
											<Text style={{ color: '#fff' }}>￥ {this.props.userInfo.balanceSB}</Text>
											<View style={{ left: 5, paddingRight: 5 }}>
												<Image resizeMode='stretch' source={require('../images/head/eye.png')} style={{ width: 13, height: 10 }} />
											</View>
										</Touch>
									</View>

									:
									<Touch onPress={() => { this.setState({ eye: eye ? false : true }) }}>
										<View style={{ left: 5, paddingRight: 5 }}>
											<Image resizeMode='stretch' source={require('../images/head/closeeye.png')} style={{ width: 13, height: 10 }} />

										</View>
									</Touch>
								}
							</View>

						</View>
					}

					{/*右邊按鈕*/}
					<View style={{ alignItems: 'flex-end', flexDirection: 'row', left: 20, width: 120 }}>

						<Touch onPress={() => {this.Jump('betRecord'); PiwikEvent('BetRecord', 'View', 'Topnav_BetRecord')}}>
							<View>
								<Image source={require('../images/head/record.png')} style={{ width: 25, height: 65, top: 5 }} />
							</View>
						</Touch>
						<Touch onPress={() => {this.Jump('search'); PiwikEvent('Search', 'Launch', 'Topnav_Search')}}>
							<View>
								<Image source={require('../images/head/search.png')} style={{ width: 35, height: 60, top: 3 }} />
							</View>
						</Touch>
						<Touch onPress={() => {LiveChatOpenGlobe(); PiwikEvent('Live Chat', 'Launch', 'Topnav_CS')}} style={{width: 30,height: 25}}>
							<View>
								<Image source={require('../images/cs.png')} style={{ width: 25, height: 25, top: -20 }} />
							</View>
						</Touch>

					</View>

				</View>
			</View>
		);
	}
}


const mapStateToProps = state => ({
	userInfo: state.userInfo,
	maintainStatus: state.maintainStatus,
});
const mapDispatchToProps = {
	userInfo_login: username => ACTION_UserInfo_login(username),
	userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
	maintainStatus_setBTI: (isMaintenance) => ACTION_MaintainStatus_SetBTI(isMaintenance),
	maintainStatus_setIM: (isMaintenance) => ACTION_MaintainStatus_SetIM(isMaintenance),
	maintainStatus_setSABA: (isMaintenance) => ACTION_MaintainStatus_SetSABA(isMaintenance),
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);

const styles = StyleSheet.create({
	selfExclusionBtn: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		width: width * 0.9 - 30,
		backgroundColor: '#00A6FF',
		borderRadius: 8,
	},
	selfExclusionTitle: {
		borderTopRightRadius: 16,
		borderTopLeftRadius: 16,
		backgroundColor: '#00A6FF',
		width: width * 0.9,
		height: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	selfExclusionMsg: {
		padding: 15,
		paddingBottom: 25,
		paddingTop: 25,
		lineHeight: 18,
		color: '#000',
		fontSize: 13,
	},
	selfExclusion: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.9,
		backgroundColor: '#fff',
		borderRadius: 16,
		paddingBottom: 20,
	},
	maintenance: {
		borderColor: '#FFEDA6',
		borderWidth: 1,
		padding: 3,
		borderRadius: 5,
		backgroundColor: '#FFEDA6',
	},
	modalMark: {
		width: width,
		height: height,
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: -1,
	},
	gameList: {
		width: 90,
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
	},
	gameListDown: {
		width: 90,
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
	},
	headers: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		height: 50,
		width: width,
		backgroundColor: "#00a6ff",
		zIndex: 99,
	},
	modalView: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff',
		borderRadius: 10,
	},
	modals: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0,0.5)",
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	gameMenuModals: {
		flex: 1,
		width: width,
	},
	GameMenu: {
	},
	GameMenuText: {
		lineHeight: 35,
		color: '#fff',
		fontSize: 16,
	},
	GameMenuTextB: {
		lineHeight: 35,
		color: '#000',
		fontSize: 16,
	},
	GameMenuTextC: {
		lineHeight: 35,
		color: '#00A6FF',
		fontSize: 16,
	},
	Gamedropdown: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: 90,
		backgroundColor: "#fff",
		borderRadius: 8,
		position: 'absolute',
		zIndex: 99,
	},
	arrow: {
		top: 9,
		left: 8,
		width: 0,
		height: 0,
		borderTopWidth: 9,
		borderTopColor: '#fff',
		borderRightWidth: 6,
		borderRightColor: 'transparent',
		borderLeftWidth: 6,
		borderLeftColor: 'transparent',
		borderBottomWidth: 7,
		borderBottomColor: 'transparent',
	},
	MoneyBG: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		left: 25,
	},
	dropdown_D_text1: {
		paddingBottom: 3,
		fontSize: 15,
		color: "#00A6FF",
		textAlignVertical: "center",
		lineHeight: 30,
		textAlign: 'center',
	},
	dropdown_D_text2: {
		paddingBottom: 3,
		fontSize: 15,
		color: "#fff",
		textAlignVertical: "center",
		lineHeight: 30,
		textAlign: 'center',
	},
	dropdown_DX_dropdown: {
		height: 40 * 2,
		borderBottomRightRadius: 8,
		borderBottomLeftRadius: 8,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.6,
		shadowRadius: 5,
		shadowColor: "#666",
		elevation: 4,
		backgroundColor: '#fff'
	},
	selectShow: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#fff',
		width: 100,
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
	},
	selectHide: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width: 100,
	},
});
