import React from 'react';
import { StyleSheet, Text, TextStyle, Image, Alert, View, ViewStyle, ScrollView, TouchableOpacity, Dimensions, WebView, Platform, FlatList, RefreshControl, Modal,Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast, Flex, Picker, List, Tabs } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import ModalDropdown from 'react-native-modal-dropdown';
import HTMLView from 'react-native-htmlview';
import { GetDateStr } from '../utils/date'
import LivechatDragHoliday from "./LivechatDragHoliday"  //可拖動懸浮
import { connect } from "react-redux";
import Carousel, { Pagination } from 'react-native-snap-carousel'
const {
	width, height
} = Dimensions.get('window')

let bannerData = [
	{cmsImageUrl: require('../images/user/banner1.png')},
	{cmsImageUrl: require('../images/user/banner2.png')},
	{cmsImageUrl: require('../images/user/banner3.png')},
]

class News extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			faceLogin: false,
			bannerData: bannerData,
			bannerIndex: 0,
			refreshing: false,
			TotalMoney: 0,
			isDepositVerificationOTP: false,
			phoneType: 1,
			FirstName: ''
		}
	}


	componentWillMount(props) {
		if (window.ApiPort.UserLogin) {
			// this.getBanner()
			this.checkCustomFlag()
			this.TotalBal()
			Platform.OS == "ios" && this.getFastLogin()
		}
	}

	//isDepositVerificationOTP 是否需要验证手机,还有次数，不进入存款页面，直接进入手机验证
    //User.js,DepositCenter.js, withdrawal.js都是用到
    checkCustomFlag() {
        Toast.loading('加载中。。。', 200000)
        fetchRequest(ApiPort.CustomFlag + 'flagKey=BankCardVerification&', 'GET')
        .then(data => {
			this.checkMember()
            if (data.isSuccess) {
                let result = data.result
                let isDepositVerificationOTP = result.isDepositVerificationOTP? result.isDepositVerificationOTP: false
				this.setState({isDepositVerificationOTP})
                if(isDepositVerificationOTP) {
                    //需要手机验证，才能存款
					this.getVerifyTimes()
                    
                }
            }
        })
        .catch(() => {})
    }
	getVerifyTimes() {
		//获手机验证剩余次数
		fetchRequest(ApiPort.VerificationAttempt + `?serviceAction=DepositVerification&channelType=SMS&`, "GET")
			.then(res => {
				if(res.remainingAttempt == 0) {
					this.setState({phoneType: 3})
				}
			})
			.catch(() => {})
	}

	getFastLogin() {
		//ios获取快速登录方式
		let fastLoginKey = "fastLogin" + userNameDB.toLowerCase();
		let sfastLoginId = "fastLogin" + userNameDB.toLowerCase();
		global.storage
			.load({
				key: fastLoginKey,
				id: sfastLoginId
			})
			.then(ret => {
				this.setState({ faceLogin: true });
			})
			.catch(err => {})
	}
	
	setFastLogin() {
		if (!window.ApiPort.UserLogin) {
			Actions.Login()
			return
		}
		if(this.state.faceLogin) {
			//关闭脸部识别 
			Alert.alert('提醒你', `您已经认证过${DeviceInfoIos? '脸部辨识': '指纹辨识'}，\n可用于下次登入采用${DeviceInfoIos? '脸部辨识': '指纹辨识'}。`,
				[{
					text: '确认',
				},
				// {
				// 	text: '确认', onPress: () => {
				// 		this.setState({faceLogin: false})
				// 		const username = userNameDB.toLowerCase();
				// 		let fastLogin = "fastLogin" + username;
				// 		let sfastLogin = "fastLogin" + username;
				// 		global.storage.remove({
				// 			key: fastLogin,
				// 			id: sfastLogin
				// 		});
				// 	}
				// },
				],
			);
			return
		}

		if(Platform.OS == "ios") {
			//直接去指纹脸部识别设置
			Actions.LoginTouch({username: userNameDB.toLowerCase(),fastChange: true,changeBack: () => { this.setState({faceLogin: true}) }})
		} else {
			//去设定界面
			Actions.SetLogin({username: userNameDB.toLowerCase()})
		}
	}

	getBanner(flag) {
		fetchRequest(window.ApiPort.Banner + `pageType=main&isLogin=${window.ApiPort.UserLogin}&playerPreference=${window.ApiPort.UserLogin ? 'Member' : 'Member'}&`, 'GET').then(data => {
			Toast.hide()
			this.setState({
				bannerData: data
			})
		}).catch(err => {
			Toast.hide()
			this.setState({
				refreshing: false
			})
		})
	}

	//获取所以账户
	TotalBal(flag) {
		if (flag) {
			this.setState({
				refreshing: true
			})
		}
		fetchRequest(window.ApiPort.Balance, "GET").then(data => {
			this.setState({
				refreshing: false
			})
			if (Array.isArray(data) && data.length) {
				let TotalMoney = data.find(v => v.name.toLocaleUpperCase() == "TotalBal".toLocaleUpperCase())
				this.setState({
					TotalMoney: TotalMoney.balance
				})
			}
		}).catch(() => {
			this.setState({
				refreshing: false
			})
		})

	}

	//获取用户信息
	checkMember() {
		Toast.loading('加载中。。。', 200000)
		fetchRequest(ApiPort.Member, 'GET').then(data => {
			Toast.hide()
			let memberInfo = data.result.memberInfo
			if (memberInfo) {
				let FirstName = memberInfo.FirstName
				this.setState({
					FirstName
				})
			}
		}).catch(() => { 
			Toast.hide()
		})
	}


	actionPage(key) {
		if (!window.ApiPort.UserLogin) {
			Actions.Login()
			return
		}
		switch (key) {
			case 'DepositCenter':
				if(window.GetSelfExclusionRestriction('DisableDeposit')) {
					return
				}

				if(!this.state.isDepositVerificationOTP && this.state.FirstName.length > 0) {
					Actions.DepositCenter({ from: 'GamePage' })
					return
				} else {
					Actions.BankCardVerify({
						isDepositVerificationOTP: true, 
						phoneType: this.state.phoneType, 
						checkCustomFlag: () => { this.checkCustomFlag() }
					})
					return
				}
				
				break;
			case 'Transfer':
				if(window.GetSelfExclusionRestriction('DisableFundIn')) {
					return
				}
				Actions.Transfer()
				break;
			case 'News':
				Actions.News()
				break;
			case 'setSystem':
				Actions.Setting({ setType: 'setSystem' })
				break;
			case 'setPush':
				Actions.Setting({ setType: 'setPush' })
				break;
			case 'Rules':
				Actions.Rules()
				break;
			case 'userInfor':
				Actions.userInfor({ checkCustomFlag: () => { this.checkCustomFlag() } })
				break;

			case 'bankcard':
				Actions.bankcard()
				break;

			case 'recordes':
				Actions.recordes()
				break;

			case 'withdrawal':
				Actions.withdrawal()
				break;



			default:
				''
		}
	}

	renderPage(item) {
		return <TouchableOpacity key={item.index} style={[styles.carouselImg]}
		//onPress={this.getBannerAction.bind(this, item)}
		>
			<Image
				resizeMode='stretch'
				style={styles.carouselImg}
				source={item.item.cmsImageUrl} />
		</TouchableOpacity>
	}

	download() {
		let affc = affCodeKex || ''
		if(affc) {
			affc = 'aff=' + affc.replace(/[^\w\.\/]/ig, '')
		}
		Linking.canOpenURL('funpodium-fun88://').then(supported => {
			if (!supported) {
				Linking.openURL('https://www.fun88asia.com/cn/download/app.htm?'+ affc)
			} else {
			   return Linking.openURL('funpodium-fun88://')
			}
		 })
		
	}

	render() {

		const {
			faceLogin,
			TotalMoney,
			bannerData,
			bannerIndex,
			refreshing
		} = this.state;

		return (
			<View style={{ flex: 1, backgroundColor: '#EFEFF4', borderTopRightRadius: 40, borderTopLeftRadius: 40 }}>
				<ScrollView automaticallyAdjustContentInsets={false}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							tintColor={'#25AAE1'}
							onRefresh={() => {
								window.ApiPort.UserLogin && this.TotalBal(true)
							}}
						/>
					}>
					<View style={{
						backgroundColor: '#00A6FF',
						height: 100,
						justifyContent: 'flex-end'
					}}>
						<View style={{
							height: 30,
							backgroundColor: '#EFEFF4',
							borderTopRightRadius: 40, borderTopLeftRadius: 40
						}}>

						</View>
					</View>
					<View style={{
						marginHorizontal: 10,
						marginTop: -60
					}}>
						{
							window.ApiPort.UserLogin
								?
								<View style={{
									backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
									borderRadius: 6, padding: 12, paddingVertical: 20
								}}>
									<View style={{ flexDirection: 'row' }}>

										<View style={{
											backgroundColor: '#EFEFF4',
											borderRadius: 1000,
											width: 44,
											height: 44,
											alignItems: 'center',
											justifyContent: 'center',
											marginRight: 10
										}}>
											<Image resizeMode='stretch' source={require('../images/usericon1.png')} style={{ width: 26, height: 26 }} />
										</View>
										<View>
											<Text style={{ fontWeight: 'bold', marginBottom: 6 }}>{userNameDB}</Text>
											<Text style={{ color: '#999999' }}>总余额 <Text style={{ fontWeight: 'bold', color: '#000' }}>￥ {TotalMoney.toFixed(2)}</Text></Text>
										</View>

									</View>
									<TouchableOpacity
										onPress={() => {
											LiveChatOpenGlobe();
											PiwikEvent('CS', 'Launch', 'LiveChat_ProfilePage')

										}}
									><Image resizeMode='stretch' source={require('../images/cs.png')} style={{ width: 28, height: 28 }} /></TouchableOpacity>

								</View>

								:
								<View style={{
									backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
									borderRadius: 6, padding: 12
								}}>
									<View style={{ flexDirection: 'row' }}>

										<View style={{
											backgroundColor: '#E3E3E8',
											borderRadius: 1000,
											width: 44,
											height: 44,
											alignItems: 'center',
											justifyContent: 'center',
											marginRight: 10
										}}>
											<Image resizeMode='stretch' source={require('../images/usericon11.png')} style={{ width: 26, height: 26 }} />
										</View>
										<View>
											<Text style={{ fontWeight: 'bold', marginBottom: 6, color: '#666666' }}>访客参访中</Text>
											<Touch
												onPress={() => {
													Actions.Login();
													PiwikEvent('Navigation', 'Click', 'Login_Profile Page')
												}}
												style={{
													borderRadius: 4,
													borderWidth: 1,
													borderColor: '#00A6FF',
													paddingTop: 2,
													paddingBottom: 2,
													paddingRight: 6,
													paddingLeft: 6
												}}>
												<Text style={{ color: '#00A6FF' }}>登录/注册</Text>
											</Touch>
										</View>


									</View>
									<TouchableOpacity
										onPress={() => { LiveChatOpenGlobe(); PiwikEvent('CS', 'Launch', 'LiveChat_ProfilePage') }}
									><Image resizeMode='stretch' source={require('../images/cs.png')} style={{ width: 28, height: 28 }} /></TouchableOpacity>

								</View>

						}

						{
							window.ApiPort.UserLogin && Array.isArray(bannerData) && bannerData.length > 0 && <View style={styles.wrapper}>
								<Carousel
									data={bannerData}
									renderItem={this.renderPage.bind(this)}
									sliderWidth={width - 20}
									itemWidth={width - 20}
									autoplay={true}
									loop={true}
									autoplayDelay={500}
									autoplayInterval={4000}
									onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
								/>
								<Pagination
									dotsLength={bannerData.length}
									activeDotIndex={bannerIndex}
									containerStyle={styles.containerStyle}
									dotStyle={styles.dotStyle}
									inactiveDotStyle={styles.inactiveDotStyle}
									inactiveDotOpacity={1}
									inactiveDotScale={0.6}
								/>
							</View>
						}
						<View style={{
							backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
							marginTop: 10,
							borderRadius: 6, padding: 12
						}}>

							<View style={styles.listItem}>
								<Touch onPress={() => {
									this.actionPage('DepositCenter');
									PiwikEvent('Deposit Nav', 'Launch', 'Deposit_ProfilePage')
								}}
									style={styles.iconBtn}>
									<Image resizeMode='stretch' source={require('../images/userFianceIcon1.png')} style={styles.iconBtnImg} />
									<Text style={{ color: '#666666' }}>存款</Text>
								</Touch>
							</View>

							<View style={styles.listItem}>
								<Touch onPress={() => {
									this.actionPage('Transfer');
									PiwikEvent('Transfer Nav', 'Launch', 'Transfer_ProfilePage')
								}}
									style={styles.iconBtn}>
									<Image resizeMode='stretch' source={require('../images/userFianceIcon2.png')} style={styles.iconBtnImg} />
									<Text style={{ color: '#666666' }}>转账</Text>
								</Touch>
							</View>

							<View style={styles.listItem}>
								<Touch onPress={() => { this.actionPage('withdrawal'); PiwikEvent('Withdrawal Nav', 'Launch', 'Withdrawal_ProfilePage') }}
									style={styles.iconBtn}>
									<Image resizeMode='stretch' source={require('../images/userFianceIcon3.png')} style={[styles.iconBtnImg]} />
									<Text style={{ color: '#666666' }}>提款</Text>
								</Touch>
							</View>
						</View>

						<View style={{
							backgroundColor: '#fff', marginTop: 10,
							borderRadius: 6, padding: 12
						}}>
							<View style={styles.managerLists}>
								<Touch style={styles.managerListsTouch} onPress={() => {
									this.actionPage('userInfor');
									PiwikEvent('Account', 'Click', 'Account_ProfilePage')
								}}>
									<View style={styles.managerListsLeft}>
										<Image resizeMode='stretch' source={require('../images/usericon2.png')} style={styles.managerListsImg}></Image>
										<Text style={{
											color: '#666666'
										}}>账户资料</Text>
									</View>
									<Text style={{ color: '#999999' }}>></Text>
								</Touch>
							</View>

							<View style={styles.managerLists}>
								<Touch style={styles.managerListsTouch} onPress={() => {
									this.actionPage('bankcard');
									PiwikEvent('Account', 'Click', 'Bank_Management_ProfilePage')
								}}>
									<View style={styles.managerListsLeft}>
										<Image resizeMode='stretch' source={require('../images/usericon0.png')} style={styles.managerListsImg}></Image>
										<Text style={{
											color: '#666666'
										}}>银行信息</Text>
									</View>
									<Text style={{ color: '#999999' }}>></Text>
								</Touch>
							</View>

							<View style={styles.managerLists}>
								<Touch style={styles.managerListsTouch} onPress={() => {
									this.actionPage('recordes');
									PiwikEvent('Transaction Record', 'Click', 'TransactionRecord_ProfilePage')
								}}>
									<View style={styles.managerListsLeft}>
										<Image resizeMode='stretch' source={require('../images/usericon3.png')} style={styles.managerListsImg}></Image>
										<Text style={{
											color: '#666666'
										}}>交易记录</Text>
									</View>
									<Text style={{ color: '#999999' }}>></Text>
								</Touch>
							</View>

							<View style={styles.managerLists}>
								<Touch style={styles.managerListsTouch} onPress={() => {
									this.setFastLogin();
									PiwikEvent('Transaction Record', 'Click', 'TransactionRecord_ProfilePage')
								}}>
									<View style={styles.managerListsLeft}>
										<Image resizeMode='stretch' source={require('../images/logins.png')} style={styles.managerListsImg}></Image>
										<Text style={{
											color: '#666666'
										}}>{Platform.OS == "ios"? DeviceInfoIos? '脸部辨识认证': '使用指纹辨识':'快速登入'}</Text>
									</View>
									<Text style={{ color: '#999999' }}>{Platform.OS == "ios" && (faceLogin? '启用': '关闭')} ></Text>
								</Touch>
							</View>

							<View style={styles.managerLists}>
								<Touch style={styles.managerListsTouch} onPress={() => {
									this.download();
									PiwikEvent('Download Nav', 'Click', 'MasterApp_Download_Profile')
								}}>
									<View style={styles.managerListsLeft}>
										<Image resizeMode='stretch' source={require('../images/usericon4.png')} style={styles.managerListsImg}></Image>
										<Text style={{
											color: '#666666'
										}}>打开乐天堂APP</Text>
									</View>
									<Text style={{ color: '#999999' }}>></Text>
								</Touch>
							</View>
							{
								window.ApiPort.UserLogin && <TouchableOpacity onPress={() => {
									window.navigateToSceneGlobe && window.navigateToSceneGlobe();

									PiwikEvent('Navigation', 'Click', 'Logout_ProfilePage')
								}}
									style={{ height: 40, alignItems: 'center', justifyContent: 'center', }}>
									<Text style={{ color: '#00A6FF', fontWeight: 'bold', fontSize: 16 }}>登出</Text>
								</TouchableOpacity>
							}

						</View>


					</View>
				</ScrollView>
			</View>
		)
	}


}
const mapStateToProps = state => ({
	userInfo: state.userInfo,
	maintainStatus: state.maintainStatus,
	userSetting: state.userSetting
});

export default connect(mapStateToProps)(News);



const styles = StyleSheet.create({
	topNav: {
		width: width,
		height: 50,
		backgroundColor: '#00a6ff',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnType: {
		backgroundColor: '#7676801F',
		borderRadius: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnList: {
		width: 110,
		backgroundColor: '#00A6FF',
		borderRadius: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnTxt: {
		textAlign: 'center',
		lineHeight: 32,
	},
	redIcon: {
		width: 5,
		height: 5,
		borderRadius: 5,
		backgroundColor: 'red',
		marginLeft: 10,
	},
	magTab: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		height: 35,
		width: width,
		backgroundColor: '#00a6ff',
	},
	magTabList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 32,
		paddingLeft: 10,
		paddingRight: 10,
		borderBottomColor: '#fff',
		borderBottomWidth: 0,
	},
	messageItem: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 15,
		borderRadius: 8,
		padding: 10,
		backgroundColor: '#fff',
	},
	listItem: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		width: (width - 20 - 24) / 3
	},
	iconBtnImg: {
		width: 40, height: 40, marginBottom: 4
	},
	managerLists: {
		flexDirection: 'row'
	},
	managerListsTouch: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: '#EFEFF4',
		paddingBottom: 12,
		marginBottom: 10
	},
	managerListsLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	managerListsImg: {
		width: 24,
		height: 26,
		marginRight: 12
	},
	carouselImg: {
		width: width - 20,
		height: (width - 20) * .314,
		borderRadius: 4
	},
	wrapper: {
		height: (width - 20) * .314,
		margin: 10,
		marginBottom: 0,
		overflow: 'hidden',
		borderRadius: 6,
	}, containerStyle: {
		paddingVertical: 2,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 5
	},
	dotStyle: {
		width: 20,
		height: 10,
		borderRadius: 5,
		marginHorizontal: 3,
		backgroundColor: '#00CEFF'
	},
	inactiveDotStyle: {
		width: 10,
		backgroundColor: '#fff'
	},
});