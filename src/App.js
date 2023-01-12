import React, { Component } from "react";
import {
	AppRegistry,
	Dimensions,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
	Linking
} from "react-native";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import CodePush from "react-native-code-push";
import AppReducer from "./reducers/AppReducer";
import Service from "./actions/Service"; //請求
import Domain from "./Domain"; //域名
import Api from "./actions/Api"; //api
import storage from "./actions/Storage";
import localStorage from "./actions/localStorage";
import AnalyticsUtil from "./actions/AnalyticsUtil"; //友盟
import {timeout_fetch} from "./lib/SportRequest";
import HostConfig from "./lib/Host.config";
import EventData from "./lib/vendor/data/EventData";
import Main from "./containers/Main";
import { Toast, Modal, Progress } from "antd-mobile-rn";
import SplashScreen from "react-native-splash-screen";
import {Toasts} from './containers/Toast'
import Orientation from "react-native-orientation-locker";
import LivechatMain from './containers/LivechatMain';  // 第三方遊戲預加載 永遠都在層級
const store = createStore(AppReducer, applyMiddleware(thunk));

//codepush key線上
const IosLive = "";
const AndroidLive = "";

const { width, height } = Dimensions.get("window");

//字體不跟者 手機設置改變
Text.defaultProps = Object.assign({}, Text.defaultProps, {
	allowFontScaling: false
});
//文字显示不全
const defaultFontFamily = {
	...Platform.select({
		android: { fontFamily: '' }
	})
};
const oldRender = Text.render;
Text.render = function(...args) {
	const origin = oldRender.call(this, ...args);
	return React.cloneElement(origin, {
		style: [defaultFontFamily, origin.props.style]
	});
};

class App extends Component<{}> {
	constructor() {
		super();
		this.state = {
			progress: "",
			restartAllowed: true,
			updataTexe: "",
			update: "",
			updataGo: false,
			codePushProgress: "更新进度: 0%", //更新進度
			CodeKey: Platform.OS === "android" ? CodePushKeyAndroid : CodePushKeyIOS,
			isMandatory: false, //是否強制更新
			percent: 0,
			CloseVersion: false,
			CodePushLoading: '',
			CheckUptate: false,
		};
	}

	//添加此代码
	delayed() {
		SplashScreen.hide();
	}

	componentWillMount() {
		global.Toasts = Toasts;
		setTimeout(() => {
			this.delayed();
		}, 1000); //啟動圖消失
		CodePush.disallowRestart(); //禁止重启
		CodePush.checkForUpdate(this.state.CodeKey).then(update => {
			this.apk_package = update; // 更新状态等信息
			console.log(update);
			if (update) {
				this.state.isMandatory = update.isMandatory;
				this.state.update = update;
				if (update.isMandatory == true) {
					this.syncImmediate();
					//this.onButtonClick2(update)
					return;
				}
				this.syncImmediate();
				//console.log(update)
				// 有可用的更新，这时进行一些控制更新提示弹出层的的操作
			} else {
				// 没有可用的更新
				this.setState({CheckUptate: true})
			}
		});

		this.CloseVersion();
		setInterval(() => {
			this.CloseVersion();
		}, 10000);

		const defaultCachePromise = new Promise(resolve => null);

		window.initialCache = {};
		['IM','SABA','BTI'].map(s => {
			window.initialCache[s] = {isUsed: false, isUsedForHeader: false, cachePromise: defaultCachePromise};
		})

		//獲取初始緩存數據
		window.getInitialCache = (VendorName) => {
			window.initialCache[VendorName].cachePromise = timeout_fetch(
				fetch(HostConfig.Config.CacheApi + '/cache/v2/' + VendorName.toLowerCase())
				,3000 //最多查3秒，超過放棄
			)
				.then(response => response.json())
				.then(jsonData => {
					let newData = {};
					newData.trCount = jsonData.trCount;
					newData.count = jsonData.count;
					newData.list = jsonData.list.map(ev => EventData.clone(ev)); //需要轉換一下

					console.log('===get initialCache of',VendorName,newData);

					return newData;
				})
				.catch((e) => {
					console.log('===== cached '+VendorName+' data has exception',e);
					window.initialCache[VendorName].isUsed = true; //報錯 就標記為已使用
				})
			return window.initialCache[VendorName].cachePromise;
		}

		//獲取首屏緩存服務器數據(IM)
		window.getInitialCache('IM')
			.finally(() => {
				//等IM獲取到，才獲取其他Vendor
				['SABA','BTI'].map(VendorName => {
					window.getInitialCache(VendorName);
				})
			})

		//獲取歐洲杯聯賽id
		// timeout_fetch(
		// 	fetch(HostConfig.Config.CacheApi + '/ec2021leagues')
		// 	,3000 //最多查3秒，超過放棄
		// )
		// 	.then(response => response.json())
		// 	.then(jsonData => {
		// 		window.EuroCup2021LeagueIds = jsonData.data;
		// 	})
		// 	.catch((e) => {
		// 		console.log('===== get EURO league IDs has exception',e);
		// 	})
	}

	componentDidMount() {
		// Orientation.lockToPortrait();
		CodePush.allowRestart(); //在加载完了，允许重启

	}


	CloseVersion() {
		//關閉版本
		fetch('https://www.zdhrb64.com/CMSFiles/F1APP/FUNSBUpdate.json?v=' + Math.random(), {
			method: "GET"
		})
			.then(response => (headerData = response.json()))
			.then(responseData => {
				// 获取到的数据处理
				///console.log('AAAA2222')
				//console.log(responseData.version)

				if (UpdateV != responseData.version) {
					if (Platform.OS === "ios") {
						if (responseData.ios == true) {
							this.setState({
								CloseVersion: true
							});
						}
					}

					if (Platform.OS === "android") {
						if (responseData.android == true) {
							this.setState({
								CloseVersion: true
							});
						}
					}
				}
			})
			.catch(error => {
				// 错误处理
				//	console.log(error)
			});
	}

	codePushStatusDidChange(syncStatus) {
		switch (syncStatus) {
			case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
				this.setState({ syncMessage: "检查更新" });
				break;
			case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
				this.setState({ syncMessage: "下载包  " });
				break;
			case CodePush.SyncStatus.AWAITING_USER_ACTION:
				this.setState({ syncMessage: "Awaiting user action" });
				break;
			case CodePush.SyncStatus.INSTALLING_UPDATE:
				this.setState({ syncMessage: "正在安装更新" });
				break;
			case CodePush.SyncStatus.UP_TO_DATE:
				this.setState({ syncMessage: "App up to date.", progress: false });
				break;
			case CodePush.SyncStatus.UPDATE_IGNORED:
				this.setState({ syncMessage: "更新被用户取消", progress: false });
				break;
			case CodePush.SyncStatus.UPDATE_INSTALLED:
				this.setState({
					syncMessage: "Update installed and will be applied on restart.",
					progress: false,
					updataGo: false
				});
				break;
			case CodePush.SyncStatus.UNKNOWN_ERROR:
				this.setState({
					syncMessage: "一个未知的错误 发生ddde eeexxx",
					progress: false,
					updataGo: false
				});
				break;
		}
	}

	codePushDownloadDidProgress(progress) {
		let percent = parseInt(
			(progress.receivedBytes / progress.totalBytes) * 100
		);
		this.setState({
			percent: percent // 为了显示进度百分比
		});

		// console.log(percent)
		if (this.state.isMandatory == false) {
			if (percent === 100) {
				setTimeout(() => {
					this.onButtonClick2();
				}, 3000);
			}
		}

		this.setState({ progress });
	}

	toggleAllowRestart() {
		this.state.restartAllowed
			? CodePush.disallowRestart()
			: CodePush.allowRestart();

		this.setState({ restartAllowed: !this.state.restartAllowed });
	}

	getUpdateMetadata() {
		CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then(
			(metadata: LocalPackage) => {
				this.setState({
					syncMessage: metadata
						? JSON.stringify(metadata)
						: "Running binary version",
					progress: false
				});
			},
			(error: any) => {
				this.setState({ syncMessage: "Error : " + error, progress: false });
			}
		);
	}

	/** Update is downloaded silently, and applied on restart (recommended) */
	sync() {
		CodePush.sync(
			{},
			this.codePushStatusDidChange.bind(this),
			this.codePushDownloadDidProgress.bind(this)
		);
	}

	syncImmediate() {
		if (this.state.isMandatory == true) {
			CodePush.sync(
				{ installMode: CodePush.InstallMode.IMMEDIATE },
				this.codePushStatusDidChange.bind(this),
				this.codePushDownloadDidProgress.bind(this)
			);
		}

		if (this.state.isMandatory == false) {
			CodePush.sync(
				{ installMode: CodePush.InstallMode.ON_NEXT_RESUME },
				this.codePushStatusDidChange.bind(this),
				this.codePushDownloadDidProgress.bind(this)
			);
		}
	}

	onButtonClick2(msg) {
		// if(this.state.CloseVersion == true){
		//   return;
		// }
		const { update } = this.state;
		let msgt = update.description;
		let msg2 = msgt.split(",").join("\n");
		this.setState({ CodePushLoading: '' })
		Modal.alert("更新提示:", msg2, [
			{
				text: "立即更新",
				onPress: () =>
					setTimeout(() => {
						CodePush.restartApp();
					}, 1000)
			}
		]);
	}

	//手動檢測版本更新
	CheckUptate() {
		if(!this.state.CheckUptate) { return }
		this.setState({CheckUptate: false})

		CodePush.checkForUpdate(this.state.CodeKey).then(update => {
			this.apk_package = update; // 更新状态等信息
			this.state.update = update;

			if (update) {
				// 有可用的更新
				this.syncImmediate();
				this.state.isMandatory = update.isMandatory;
			} else {
				// alert('无版本更新')
				this.setState({CheckUptate: true})
			}
		});
	}

	onButtonClickLogin(msg) {
		if (this.state.CloseVersion == true) {
			return;
		}
		let msgt = msg.description;
		let msg2 = msgt.split(",").join("\n");
		Modal.alert("更新提示:", msg2, [
			{ text: "立即更新", onPress: () => this.syncImmediateLogin() }
		]);
	}

	syncImmediateLogin() {
		if (this.state.isMandatory == true) {
			CodePush.sync(
				{ installMode: CodePush.InstallMode.IMMEDIATE },
				this.codePushStatusDidChange.bind(this),
				this.codePushDownloadDidProgressLogin.bind(this)
			);
			// this.setState({
			//   updataGo:true
			// })
		}

		if (this.state.isMandatory == false) {
			CodePush.sync(
				{ installMode: CodePush.InstallMode.ON_NEXT_RESUME },
				this.codePushStatusDidChange.bind(this),
				this.codePushDownloadDidProgressLogin.bind(this)
			);
		}
	}

	codePushDownloadDidProgressLogin(progress) {
		let percent = parseInt(
			(progress.receivedBytes / progress.totalBytes) * 100
		);
		this.setState({
			percent: percent // 为了显示进度百分比
		});

		if (percent === 100) {
			setTimeout(() => {
				this.onButtonClick2();
			}, 5000);
		}

		this.setState({ progress });
	}

	UpdataApp() {
		//更新版本
		Linking.openURL(`${SBTDomain}/zh/Appinstall.html`);
	}

	render() {
		const { updataGo, codePushProgress, percent, CloseVersion, CodePushLoading } = this.state;

		window.CheckUptateGlobe = () => {
			this.CheckUptate();
		};

		return (
			<Provider store={store}>
				<View style={{ flex: 1 }}>
					<Modal
						animationType='none'
						transparent={true}
						visible={CodePushLoading}
						onRequestClose={() => { }}
					>
						<View style={styles.secussModal}>
							<Text style={{ color: '#000', lineHeight: 35, fontSize: 18 }}>版本更新</Text>
							<Text style={{ color: '#222222', padding: 25, }}>{CodePushLoading != '' && CodePushLoading}</Text>
							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity onPress={() => { this.setState({ CodePushLoading: '' }) }}>
									<Text style={{ color: '#222222', padding: 15 }}>退出</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
					<Main />

					<LivechatMain />
					{/*客服懸浮層*/}

					<StatusBar barStyle="light-content" />
					{updataGo == true && <View style={styles.updataBg}></View>}

					{updataGo == true && (
						<View style={styles.popBox}>
							<Text
								style={{
									textAlign: "center",
									paddingTop: 15,
									paddingBottom: 10
								}}
							>
								更新中,请勿关闭APP
              			</Text>
							<View style={{ height: 4, width: width - 40 }}>
								<Progress
									barStyle={{
										backgroundColor: "#005a36",
										borderColor: "#005a36"
									}}
									percent={percent}
								/>
							</View>
							<Text
								style={{
									textAlign: "center",
									paddingTop: 15,
									paddingBottom: 10
								}}
							>
								进度:{percent}%
              				</Text>
						</View>
					)}

					{CloseVersion == true && <View style={styles.updataBg2}></View>}

					{CloseVersion == true && (
						<View style={styles.popBoxS}>
							<View
								style={{
									backgroundColor: "#00A6FF",
									borderTopLeftRadius: 12,
									borderTopRightRadius: 12
								}}
							>
								<Text
									style={{
										textAlign: "center",
										color: "#fff",
										fontSize: 16,
										fontWeight: "bold",
										paddingTop: 10,
										paddingBottom: 10
									}}
								>
									版本升级提示
                				</Text>
							</View>

							<Text
								style={{
									textAlign: "center",
									paddingTop: 15,
									paddingBottom: 5
								}}
							>
								亲爱的会员，此版本已停止使用。
              				</Text>
							<Text
								style={{
									textAlign: "center",
									paddingTop: 5,
									paddingBottom: 10
								}}
							>
								请下载最新APP以继续游戏。
              				</Text>

							<View
								style={{
									backgroundColor: "#00A6FF",
									borderRadius: 12,
									width: 100,
									left: width / 3.3,
									marginTop: 5
								}}
							>
								<TouchableOpacity onPress={() => this.UpdataApp()}>
									<Text
										style={{
											textAlign: "center",
											paddingTop: 10,
											paddingBottom: 10,
											color: "#fff",
											fontWeight: "bold",
											fontSize: 14
										}}
									>
										立即下载
                  					</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</View>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: "#F5FCFF",
		paddingTop: 50
	},
	messages: {
		marginTop: 15,
		color: "#fff",
		textAlign: "center"
	},
	restartToggleButton: {
		color: "blue",
		fontSize: 17
	},
	syncButton: {
		color: "green",
		fontSize: 17
	},
	welcome: {
		fontSize: 20,
		textAlign: "center",
		margin: 20
	},
	popBox: {
		width: width - 40,
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		top: height / 2,
		left: 20,
		borderRadius: 12,
		backgroundColor: "#fff",
		height: 80
	},
	popBoxS: {
		width: width - 40,
		position: "absolute",
		top: height / 2.5,
		left: 20,
		borderRadius: 12,
		backgroundColor: "#fff",
		height: 160
	},

	updataBg: {
		width: width,
		height: height,
		opacity: 0,
		backgroundColor: "#000",
		position: "absolute"
	},
	updataBg2: {
		width: width,
		height: height,
		opacity: 0.5,
		backgroundColor: "#000",
		position: "absolute"
	},
	secussModal: {
		// width: width / 1.2,
		// height: height / 3,
		backgroundColor: '#fff',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},

});

/**
 * Configured with a MANUAL check frequency for easy testing. For production apps, it is recommended to configure a
 * different check frequency, such as ON_APP_START, for a 'hands-off' approach where CodePush.sync() does not
 * need to be explicitly called. All options of CodePush.sync() are also available in this decorator.
 */
let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

App = CodePush(codePushOptions)(App);

export default App;
