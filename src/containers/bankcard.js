import React from 'react';
import { StyleSheet, Text, TextStyle, Image, View, ViewStyle, ScrollView, TouchableOpacity, Dimensions, Clipboard, Platform, FlatList, RefreshControl, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast, Carousel, Flex, Picker, List, Tabs, DatePicker } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import ModalDropdown from 'react-native-modal-dropdown';
import { GetDateStr } from '../utils/date'
import LivechatDragHoliday from "./LivechatDragHoliday"  //可拖動懸浮
import { connect } from "react-redux"; import moment from 'moment'
const {
	width, height
} = Dimensions.get('window')


class News extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			bankarr: [
				{
					title: '便捷提款账户'
				},
				{
					title: '泰达币ERC20提款钱包'
				},
				{
					title: '泰达币TRC20提款钱包'
				},
			],
			bankarrIndex: 0,
			ctcWalletList: [],
			ctcWalletList2: [],
			withdrawalsBank: []
		}
	}

	componentDidMount() {
		this.GetCryptoWallet();
		this.getWithdrawalUserBankAction()
	}

	//獲取加密貨幣錢包
	async GetCryptoWallet() {
		Toast.loading('加载中,请稍候...', 2000)
		try {
			const res = await fetchRequest(
				window.ApiPort.CryptoWallet + "?CryptoCurrencyCode=USDT-ERC20&",
				"GET"
			);
			Toast.hide();
			if (res.length > 0) {
				// const banks = this.adjustBanks(res);
				this.setState({ ctcWalletList: res });
			} else {
				this.setState({ ctcWalletList: [] });
			}
		} catch (error) {
			// 获取失败
		} finally {
			this.setState({ loading: false });
		}

		// Toast.loading("", 200);
		try {
			const res = await fetchRequest(
				window.ApiPort.CryptoWallet + "?CryptoCurrencyCode=USDT-TRC20&",
				"GET"
			);
			Toast.hide();
			if (res.length > 0) {
				// const banks = this.adjustBanks(res);
				this.setState({ ctcWalletList2: res });
			} else {
				this.setState({ ctcWalletList2: [] });
			}
		} catch (error) {
			// 获取失败
		} finally {
			this.setState({ loading: false });
		}
	}


	getWithdrawalUserBankAction() {
		Toast.loading('加载中,请稍候...', 2000)
		global.storage.load({
			key: 'withdrawalsUserBank',
			id: 'withdrawalsUserBank'
		}).then(data => {
			dispatch({ type: 'WITHDRAWALUSERBANKACTION', data })
		}).catch(() => {
			dispatch({ type: 'WITHDRAWALUSERBANKACTION', data: [] })
		})

		fetchRequest(window.ApiPort.GetMemberBanks + '?AccountType=Withdrawal&', 'GET').then(res => {
			Toast.hide()
			let withdrawalsBank = res
			//this.changeWithdrawalsBtnStatus()
			let defaultBank = withdrawalsBank.find(v => v.IsDefault)
			if (defaultBank) {
				let defaultBankIndex = withdrawalsBank.findIndex(v => v.IsDefault)
				withdrawalsBank.splice(defaultBankIndex, 1)
				withdrawalsBank.unshift(defaultBank)
			}

			this.setState({
				withdrawalsBank
			})

			global.storage.save({
				key: 'withdrawalsUserBank',
				id: 'withdrawalsUserBank',
				data: withdrawalsBank,
				expires: null
			})
		}).catch((err) => {
			Toast.hide()
		})
	}

	setDefault(id, type) {
		Toast.loading('加载中,请稍候...', 2000)
		fetchRequest(window.ApiPort.PATCHMemberBanksDefault + id + '/SetDefault?', 'PATCH').then(res => {
			Toast.hide()
			if (res.isSuccess == true) {
				Toasts.success('设置成功！')
			} else {
				Toasts.fail('设置失败！')
			}
			this.getWithdrawalUserBankAction()
		}).catch(error => {
			Toast.hide()
		})
	}



	changeRebateDatePicker(day) {
		this.setState({
			birthdayDate: moment(day).format('YYYY-MM-DD')
		})
	}

	changeBnak(bankarrIndex) {
		this.setState({
			bankarrIndex
		})
	}


	//设置默认錢包
	async setDefaultWallet(id) {
		try {
			Toast.loading("设置中,请稍候...", 200);
			const res = await fetchRequest(
				window.ApiPort.CryptoWallet + "/" + id + "/Default?",
				"PATCH"
			);
			Toast.hide();
			if (res.isSuccess == true) {
				this.setState({ settingFlag: false });
				await this.GetCryptoWallet();
				this.setState({
					toastSuccessFlag: true
				});
				setTimeout(() => {
					this.setState({ toastSuccessFlag: false });
				}, 1500);
				// Toasts.success("设置成功！");
			} else {
				this.setState({
					toastErrorFlag: true
				});
				setTimeout(() => {
					this.setState({ toastErrorFlag: false });
				}, 1500);
				// Toasts.fail("设置失败！");
			}
		} catch (error) {
			Toast.hide();
			Toasts.fail("设置失败！");
		}
	}

	copy(txt) {

		try {
			const value = String(txt)
			Clipboard.setString(value);
			Toast.info("已复制", 2);
		} catch (error) {
			//console.log(error);

		}

	}

	render() {
		const {
			withdrawalsBank,
			bankarr,
			bankarrIndex,
			ctcWalletList,
			ctcWalletList2,
		} = this.state;

		return (

			<View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>

				<View style={{ backgroundColor: '#00A6FF', flexDirection: 'row', alignItems: 'center', }}>
					{
						bankarr.map((v, i) => {
							let flag = bankarrIndex == i
							return <TouchableOpacity
								onPress={this.changeBnak.bind(this, i)}
								style={{
									width: i == 0 ? (width / 4) : ((3 * width / 4) / 2),

									alignItems: 'center', justifyContent: 'center', height: 44,
									borderBottomWidth: 3,
									borderBottomColor: flag ? '#FFFFFF' : '#00A6FF'
								}}>
								<Text style={{
									textAlign: 'center',
									color: flag ? '#FFFFFF' : '#B4E4FE',
									fontWeight: flag ? 'bold' : 'normal',
									fontSize: 12
								}}>{v.title}</Text>
							</TouchableOpacity>
						})
					}

				</View>

				<ScrollView
					// style={{ flex: 1 ,backgroundColor:'#171717'}}
					automaticallyAdjustContentInsets={false}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
					{
						console.log(bankarrIndex, withdrawalsBank.length)
					}
					<View style={{ marginHorizontal: 15, marginTop: 20 }}>
						{
							bankarrIndex == 0 && <View>

								{
									withdrawalsBank.length > 0 && withdrawalsBank.map((v, i) => {
										return <TouchableOpacity
											style={{
												backgroundColor: '#fff',
												borderRadius: 4,
												marginBottom: 15,
												padding: 15
											}}
											onPress={() => {
												Actions.bankcardDetail({
													detail: v
												})
											}}>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
												<Text>{v.BankName}</Text>

												{
													v.IsDefault ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<View style={{
															backgroundColor: '#0CCC3C', width: 18, height: 18, borderRadius: 1000,
															marginRight: 5,
															alignItems: 'center', justifyContent: 'center'
														}}>
															<Text style={{ color: '#fff' }}>✓</Text>
														</View>
														<Text style={{ color: '#0CCC3C' }}>默认</Text>
													</View>
														:
														<TouchableOpacity onPress={this.setDefault.bind(this, v.BankAccountID)}>
															<Text style={{ color: '#00A6FF' }}>设置默认</Text>
														</TouchableOpacity>
												}
											</View>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
												<Text>*************{v.AccountNumber.slice(-3)}</Text>

												<Text style={{ backgroundColor: 'grren', color: '#999999' }}>></Text>
											</View>
										</TouchableOpacity>
									})
								}


								{
									withdrawalsBank.length < 3 &&
									<TouchableOpacity
										onPress={() => {
											Actions.NewBank({
												bankType: 'W',
												fromPage: 'withdrawals',
												getWithdrawalUserBankAction: () => {
													this.getWithdrawalUserBankAction()
												}
											})



											PiwikEvent('Account', 'Click', 'Add_BankCard_ProfilePage')
										}}
										style={styles.addBankBtn}>
										<Text style={{ color: '#00A6FF', fontWeight: 'bold' }}>添加银行帐户</Text>
									</TouchableOpacity>}

								<Text style={{
									color: '#999999',
									textAlign: 'center',
									fontSize: 11,
									marginTop: 12
								}}>最多可以添加3张银行卡，如需删除银行卡，请联系<Text onPress={() => {
									LiveChatOpenGlobe()
								}} style={{ color: '#00A6FF' }}>在线客服</Text>。</Text>
							</View>
						}
						{
							bankarrIndex == 1 && <View>
								{
									ctcWalletList.length > 0 && ctcWalletList.map((v, i) => {
										return <TouchableOpacity
											style={{
												backgroundColor: '#fff',
												borderRadius: 4,
												marginBottom: 15,
												padding: 15
											}}
											onPress={() => {
												// Actions.bankcardDetail({
												// 	detail: v
												// })
											}}>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
												<Text>{v.WalletName}</Text>

												{
													v.IsDefault ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<View style={{
															backgroundColor: '#0CCC3C', width: 18, height: 18, borderRadius: 1000,
															marginRight: 5,
															alignItems: 'center', justifyContent: 'center'
														}}>
															<Text style={{ color: '#fff' }}>✓</Text>
														</View>
														<Text style={{ color: '#0CCC3C' }}>默认</Text>
													</View>
														:
														<TouchableOpacity onPress={this.setDefaultWallet.bind(this, v.ID)}>
															<Text style={{ color: '#00A6FF' }}>设置默认</Text>
														</TouchableOpacity>
												}
											</View>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
												<Text style={{ width: width - 120 }}>{v.WalletAddress}</Text>
												<Touch onPress={() => { this.copy(v.WalletAddress) }}>
													<Text style={{ color: '#00a6ff', fontSize: 12 }}>复制</Text>
												</Touch>
											</View>
										</TouchableOpacity>
									})
								}


								{
									ctcWalletList.length < 3 &&
									<TouchableOpacity
										onPress={() => {
											Actions.CreatWallet({
												CoinTypesType: 'USDT-ERC20',
												GetCryptoWallet: (v) => {
													this.GetCryptoWallet(v);
												}
											});

											PiwikEvent('Account', 'Click', 'Add_CryptoWallet_ERC20_ProfilePage')
										}}
										style={styles.addBankBtn}>
										<Text style={{ color: '#00A6FF', fontWeight: 'bold' }}>{`添加 USDT-ERC20 钱包地址`}</Text>
									</TouchableOpacity>}

								<Text style={{
									color: '#999999',
									textAlign: 'center',
									fontSize: 11,
									marginTop: 12
								}}>如您需要更改钱包地址，请联系<Text onPress={() => {
									LiveChatOpenGlobe()
								}} style={{ color: '#00A6FF' }}>在线客服</Text>。</Text>
							</View>
						}

						{
							bankarrIndex == 2 && <View>
								{
									ctcWalletList2.length > 0 && ctcWalletList2.map((v, i) => {
										return <TouchableOpacity
											style={{
												backgroundColor: '#fff',
												borderRadius: 4,
												marginBottom: 15,
												padding: 15
											}}
											onPress={() => {
												// Actions.bankcardDetail({
												// 	detail: v
												// })
											}}>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
												<Text>{v.WalletName}</Text>

												{
													v.IsDefault ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<View style={{
															backgroundColor: '#0CCC3C', width: 18, height: 18, borderRadius: 1000,
															marginRight: 5,
															alignItems: 'center', justifyContent: 'center'
														}}>
															<Text style={{ color: '#fff' }}>✓</Text>
														</View>
														<Text style={{ color: '#0CCC3C' }}>默认</Text>
													</View>
														:
														<TouchableOpacity onPress={this.setDefaultWallet.bind(this, v.ID)}>
															<Text style={{ color: '#00A6FF' }}>设置默认</Text>
														</TouchableOpacity>
												}
											</View>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
												<Text style={{ width: width - 120 }}>{v.WalletAddress}</Text>
												<Touch onPress={() => { this.copy(v.WalletAddress) }}>
													<Text style={{ color: '#00a6ff', fontSize: 12 }}>复制</Text>
												</Touch>
											</View>
										</TouchableOpacity>
									})
								}


								{
									ctcWalletList2.length < 3 &&
									<TouchableOpacity
										onPress={() => {
											Actions.CreatWallet({
												CoinTypesType: 'USDT-TRC20',
												GetCryptoWallet: (v) => {
													this.GetCryptoWallet(v);
												}
											});



											PiwikEvent('Account', 'Click', 'Add_CryptoWallet_TRC20_ProfilePage')
										}}
										style={styles.addBankBtn}>
										<Text style={{ color: '#00A6FF', fontWeight: 'bold' }}>{`添加 USDT-TRC20 钱包地址`}</Text>
									</TouchableOpacity>}

								<Text style={{
									color: '#999999',
									textAlign: 'center',
									fontSize: 11,
									marginTop: 12
								}}>如您需要更改钱包地址，请联系<Text onPress={() => {
									LiveChatOpenGlobe()
								}} style={{ color: '#00A6FF' }}>在线客服</Text>。</Text>
							</View>
						}
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
	addBankBtn: {
		borderWidth: 1,
		borderColor: '#00A6FF',
		borderStyle: 'dashed',
		paddingVertical: 40,
		alignItems: "center",
		borderRadius: 2,
		justifyContent: 'center'
	},
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
		width: 26,
		height: 26,
		marginRight: 12
	}
});