import React from 'react'
import { StyleSheet, ScrollView, Text, View, Modal, TouchableOpacity, Dimensions, Clipboard, Image, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { Toast, Tabs, DatePicker, List } from 'antd-mobile-rn'
import ModalDropdown from 'react-native-modal-dropdown'
import moment from 'moment'
import AbleCompleteFromUIPop from './AbleCompleteFromUIPop'
import Orientation from 'react-native-orientation-locker'
import ListItems from 'antd-mobile-rn/lib/list/style/index.native'
import Touch from "react-native-touch-once";
const newStyle1 = {}
for (const key in ListItems) {
	if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
		newStyle1[key] = { ...StyleSheet.flatten(ListItems[key]) }
		if (key == 'Item') {
			newStyle1[key].paddingLeft = 0
			newStyle1[key].paddingRight = 0
			newStyle1[key].height = 40
			newStyle1[key].width = 50
			newStyle1[key].overflow = 'hidden'
		}
		newStyle1[key].color = 'transparent'
		newStyle1[key].fontSize = -999
		newStyle1[key].backgroundColor = 'transparent'
		newStyle1[key].borderRadius = 4
	}
}


const { width, height } = Dimensions.get('window')

const RecordsTab = [
	{
		title: '存款',
		text: 'deposit',
		'Category': 'Transaction Record',
		'Action': 'View',
		'Name': 'Deposit_TransactionRecord',
	},
	{
		title: '转账',
		text: 'Transfer',
		'Category': 'Transaction Record',
		'Action': 'View',
		'Name': 'Transfer_TransactionRecord',

	},
	{
		title: '提款',
		text: 'Withdrawal',
		'Category': 'Transaction Record',
		'Action': 'View',
		'Name': 'Withdrawal_TransactionRecord',

	},
]

const DepositStatus = {
	StatusId1: { //'Pending'
		text: '处理中',
		color: '#F0A800',
	}, // Pending
	StatusId2: {// 'Approved'
		text: '存款成功',
		color: '#0CCC3C',
	},
	StatusId3: {//'Rejected'
		text: '存款失败',
		color: '#EB2121'
	},
	StatusId4: { //' Vendor Processing'
		text: '处理中',
		color: '#F0A800',
		// text: '待处理',
		// color: '#00A6FF',
	}
}
const WithdrawalStatusPend = {
	text: '待处理', // 等待浏览
	color: '#009DE3',
	borderColor: '#009DE3',
	backgroundColor: '#fff'
}
const WithdrawalStatusPending = {
	text: '处理中', // 进行中
	color: '#F0A800',
	borderColor: '#009DE3',
	backgroundColor: '#009DE3'
}
const WithdrawalStatus = {
	StatusId1: WithdrawalStatusPend, // Pending 1-待处理
	StatusId2: WithdrawalStatusPending, // Processing 2-处理
	StatusId3: WithdrawalStatusPending, // Vendor Processing
	StatusId4: {//Approved
		text: '提款成功', // 已完成
		color: '#0CCC3C',
		borderColor: '#83E300',
		backgroundColor: '#83E300'
	},
	StatusId5: {//Rejected
		text: '提款失败', // 拒绝
		color: '#EB2121',
		borderColor: '#E30000',
		backgroundColor: '#E30000'
	},
	StatusId6: {//Cancelled
		text: '取消', // 取消
		color: '#EB2121',
		borderColor: '#E30000',
		backgroundColor: '#E30000'
	},
	StatusId7: WithdrawalStatusPending, // Escalated
	StatusId8: WithdrawalStatusPending, // Locked
	StatusId9: WithdrawalStatusPending, // A-Processing
	StatusId10: {
		text: '部分成功', //Partial Approve 部分成功 
		color: '#0CCC3C',
		borderColor: '#83E300',
		backgroundColor: '#83E300'
	}
}
const CTCMethods = {
	OTC: "虚拟币交易所 (OTC)",
	INVOICE: "虚拟币支付 1",
	INVOICE_AUT: "虚拟币支付 2",
	CHANNEL: '极速虚拟币支付'
}
const DeposiBanktList = [
	{
		code: '',
		name: '全部'
	},
	{
		code: 'LB',
		name: '本地银行'
	},
	{
		code: 'OA',
		name: '在线支付宝'
	},
	{
		code: 'BCM',
		name: '快捷支付'
	},
	{
		code: 'BC',
		name: '网银支付'
	},
	{
		code: 'ALB',
		name: '支付宝转账'
	},
	{
		code: 'CTC',
		name: '泰达币'
	},
	{
		code: 'WCLB',
		name: '微信转账'
	},
	{
		code: 'UP',
		name: '银联支付'
	},
	{
		code: 'QQ',
		name: 'QQ支付'
	},
	{
		code: 'JDP',
		name: '京东支付'
	},
	{
		code: 'AP',
		name: 'AstroPay'
	},
	{
		code: 'CC',
		name: '乐卡'
	},
	{
		code: 'OGC',
		name: 'OGC支付'
	},
	{
		code: 'FC',
		name: '快付'
	},
	{
		code: 'WC',
		name: '微信支付'
	},
	{
		code: 'IB',
		name: '易支付/支付宝'
	},
	{
		code: 'QR',
		name: '二维码支付'
	},
	{
		code: 'MD',
		name: '本地银行'
	},
	{
		code: 'PPB',
		name: '网银转账'
	},
	{
		code: 'ALBMD',
		name: '支付宝转账'
	},
	{
		code: 'WLMD',
		name: '微信转账'
	},
	{
		code: 'SR',
		name: '小额存款'
	},
	// {
	// 	code: '',
	// 	name: ''
	// },
]
const DepositName = DeposiBanktList.filter(v => v.code).reduce((obj, v) => {
	obj[v.code] = v.name
	return obj
}, {})
const WithdrawalBankList = [
	{
		code: '',
		name: '全部'
	},
	{
		code: 'LB',
		name: '本地银行转账'
	},
	{
		code: 'CCW',
		name: '泰达币'
	},
]

const OtherTranferName = {
	WITHDRAWING: '提款',
	REBATE: '回扣',
	ADJUSTMENT: '调整',
	CASH: '现金',
	BONUS: '红利',
	REWARD_POINT: '奖励积分',
	PLAYER_BONUS: '会员红利',
	BONUS_ADJUSTMENT: '红利调整'
}
const WithdrawalName = WithdrawalBankList.filter(v => v.code).reduce((obj, v) => {
	obj[v.code] = v.name
	return obj
}, {})

const LBMethods = {
	// LOCALBANK: 'Ngân Hàng Địa Phương',
	MOMOLOCAL: 'Chuyển Từ Ví Momo​'
}

class RecordsContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			recordIndex: this.props.recordIndex || 0,
			dateFrom: moment().subtract(6, 'days').format('YYYY-MM-DD'),
			dateTo: moment().subtract(0, 'days').format('YYYY-MM-DD'),
			depositListIndex: 0,
			depositRecordsList: '',
			withdrawalListIndex: 0,
			withdrawalRecordsList: '',
			tranferRecordsList: '',
			ScrollTop: false,


			fromBalanceInfor: [],
			toBalanceInfor: [],
			fromWalletIndex: 0,
			toWalletIndex: 0,
			balanceInfor: [],
			arrowFlag1: false,
			arrowFlag2: false,


			isShowPisker: false,
			isCopy: false,
			bankIndex: -9999999999,
			isDefault7: true,
			minDate: moment().subtract(89, 'days').format('YYYY-MM-DD'),
			IsAbleCompleteFromUIPop: false,
			AbleCompleteFromData: '',
			rebateAmountPop: '',
			rebateAmountPopMsg: '额外奖励错误',
		}
	}

	componentDidMount(props) {
		Orientation.lockToPortrait() //鎖定屏幕
		this.changeBettingHistoryDatesIndex(this.state.recordIndex)
		this.TotalBal()


		this.getDepositWithdrawalsRecords(true)
	}


	TotalBal() {
		fetchRequest(window.ApiPort.Balance, "GET").then(data => {
			//debugger;
			// if (balanceInforData.length <= 0) return
			let balanceInfor = [{ localizedName: '全部', name: '' }, ...data.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL')]
			//let PreferWallet = this.props.memberInforData.PreferWallet.toLocaleUpperCase()
			//let toWalletIndex = balanceInfor.findIndex(v => v.name === PreferWallet)
			this.setState({
				balanceInfor,
				fromWalletIndex: 0,
				fromBalanceInfor: balanceInfor,
				toWalletIndex: 0,
				toBalanceInfor: balanceInfor,
			})

		})
	}

	changeBettingDatePicker(type, date) {
		const { dateTo, dateFrom } = this.state
		let flag = false
		if (type === 'dateFrom') {
			if ((new Date(moment(date).format('YYYY-MM-DD'))).getTime() > (new Date(dateTo)).getTime()) {
				Toasts.fail('开始日期不能大于结束日期', 2)
				return
			} else {
				this.setState({
					currentDateLabel: moment().diff(moment(date), 'days')
				})

				flag = Math.abs(moment(date).diff(moment(dateTo), 'day')) >= 6
			}
		}
		if (type === 'dateTo') {
			if ((new Date(moment(date).format('YYYY-MM-DD'))).getTime() < (new Date(dateFrom)).getTime()) {
				Toasts.fail('开始日期不能大于结束日期', 2)
				return
			}
			flag = Math.abs(moment(date).diff(moment(dateFrom), 'day')) >= 6
		}

		//flag && Toasts.fail('日期必须在7天内。')

		this.setState({
			[type]: moment(date).format('YYYY-MM-DD'),
			isDefault7: false,
		}, () => {
			//!flag &&
			(this.state.recordIndex == 1 ? this.getTranferRecords() : this.getDepositWithdrawalsRecords(true))
		})
	}


	DatePickerCommon() {
		const { dateTo, dateFrom, minDate, isDefault7 } = this.state
		const CalendarImg = !isDefault7 ? require('../../images/calendar0.png') : require('../../images/calendar1.png')
		return <View>
			<View style={[styles.bettingDatePicker, { borderColor: isDefault7 ? '#D7D7DB' : '#00A6FF' }]}>
				<DatePicker
					title='选择日期'
					mode='date'
					value={new Date(dateFrom)}
					minDate={new Date(minDate)}
					maxDate={new Date()}
					onChange={this.changeBettingDatePicker.bind(this, 'dateFrom')}
					format='MM/DD/YYYY'
				>
					<List.Item styles={StyleSheet.create(newStyle1)}>
						<View style={[styles.datePickerWrapView, {
							borderColor: isDefault7 ? '#707070' : '#00A6FF',
						},
						]}>
							<Text style={[styles.bettingDate, { color: isDefault7 ? '#707070' : '#00A6FF' }]}>{moment(dateFrom).format('MM/DD')}</Text>

						</View>
					</List.Item>
				</DatePicker>
				<Text style={{ color: isDefault7 ? '#707070' : '#00A6FF' }}>至</Text>
				<DatePicker
					title='选择日期'
					mode='date'
					value={new Date(dateTo)}
					minDate={new Date(minDate)}
					maxDate={new Date()}
					onChange={this.changeBettingDatePicker.bind(this, 'dateTo')}
					format='MM/DD/YYYY'
				>
					<List.Item styles={StyleSheet.create(newStyle1)}>
						<View style={[styles.datePickerWrapView, {
							borderColor: isDefault7 ? '#707070' : '#00A6FF',
						},
						]}>
							<Text style={[styles.bettingDate, { color: isDefault7 ? '#707070' : '#00A6FF' }]}>{moment(dateTo).format('MM/DD')}</Text>

						</View>
					</List.Item>
				</DatePicker>

				<Image source={CalendarImg} resizeMode='stretch' style={{ width: 20, height: 18, marginRight: 10, marginLeft: 5 }}></Image>
			</View>
		</View>
	}



	getDepositWithdrawalsRecords(flag1) {
		const { recordIndex, dateFrom, dateTo, depositListIndex, withdrawalListIndex } = this.state

		if (flag1) {
			this.setState({
				depositRecordsList: null,
				withdrawalRecordsList: null
			})
		}

		const tempData = RecordsTab[recordIndex]
		let flag = tempData.text === 'deposit'
		let bankCode = flag ? DeposiBanktList[depositListIndex].code : WithdrawalBankList[withdrawalListIndex].code
		let bankcoeStr = bankCode ? bankCode : ''
		flag1 && Toast.loading('加载中,请稍候...', 2000)
		fetchRequest(window.ApiPort.BankingHistory + 'transactionType=' + tempData.text + '&paymentMethod=' + bankcoeStr + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo + '&', 'GET').then(data => {
			Toast.hide()
			if (data.historyList) {
				if (flag) {
					let depositRecordsList = data.historyList
					depositRecordsList.forEach(v1 => {
						v1.depositWithdrawalsName = DepositName[v1.PaymentMethodId]
						//v1.StatusId = 1
					})
					this.setState({
						depositRecordsList
					})
				} else {
					let withdrawalRecordsList = data.historyList
					withdrawalRecordsList.forEach(v1 => {
						v1.depositWithdrawalsName = WithdrawalName[v1.PaymentMethodId]
					})
					this.setState({
						withdrawalRecordsList
					})
				}
			} else {
				this.setState({
					depositRecordsList: [],
					withdrawalRecordsList: []
				})
				if (data.errorMessage.ClassName) {
					//api错误处理
					Toasts.fail('网络错误，请稍后重试')
					return
				}
				let errorMessage = data.errorMessage
				errorMessage && Toasts.fail(errorMessage, 1.5)
			}
		}).catch(error => {
			Toast.hide()
		})
	}

	getTranferRecords() {
		const { fromBalanceInfor, fromWalletIndex, toBalanceInfor, toWalletIndex, dateFrom, dateTo } = this.state
		this.setState({
			tranferRecordsList: null
		})

		Toast.loading('加载中,请稍候...', 2000)
		fetchRequest(window.ApiPort.TransferApplicationsByDate + '?fromWallet=' + '' + '&toWallet=' + '' + '&dateFrom=' + dateFrom + ' 00:00:00.000&dateTo=' + dateTo + ' 23:59:59.000&', 'GET').then(data => {
			Toast.hide()
			this.setState({
				tranferRecordsList: data
			})
		}).catch(error => {
			Toast.hide()
		})
	}

	_onOrientationChange(curOrt) {
		Orientation.lockToPortrait()
	}


	changeBettingHistoryDatesIndex(i) {
		this.setState({
			recordIndex: i,
			depositListIndex: 0,
			withdrawalListIndex: 0,
			// fromWalletIndex: 0,
			// toWalletIndex: 0,
			tranferRecordsList: '',
			withdrawalRecordsList: '',
			depositRecordsList: ''
		}, () => {
			this.state.recordIndex == 1 ? this.getTranferRecords() : this.getDepositWithdrawalsRecords(true)
		})


		let tempRecordsTab = RecordsTab[i]
		tempRecordsTab && PiwikEvent(tempRecordsTab.Category, tempRecordsTab.Action, tempRecordsTab.Name)
	}

	changeWalletIndex(wallet, index) {
		this.setState({
			[wallet]: index
		})
	}



	changeArrowStatus(tag, arrowFlag) {
		this.setState({
			[tag]: arrowFlag
		})
	}

	async copyTXT(txt, bankIndex) {
		Clipboard.setString(txt)

		Toasts.success('复制成功', 1.5)


		this.setState({
			bankIndex,
			isCopy: true
		})


		setTimeout(() => {
			this.setState({
				bankIndex: -9999999999,
				isCopy: false
			})
		}, 1500);
	}

	serch7days() {
		this.setState({
			dateFrom: moment().subtract(6, 'days').format('YYYY-MM-DD'),
			dateTo: moment().subtract(0, 'days').format('YYYY-MM-DD'),
			isDefault7: true,
		}, () => {
			this.state.recordIndex == 1 ? this.getTranferRecords() : this.getDepositWithdrawalsRecords(true)
		})
	}

	//存款确认到账data
	AbleCompleteFromData(AbleCompleteFromData) {
		this.setState({ AbleCompleteFromData, IsAbleCompleteFromUIPop: true })
	}


	render() {
		const { isDefault7, bankIndex, isCopy, isShowPisker,
			arrowFlag2, balanceInfor, tranferRecordsList, fromWalletIndex, toWalletIndex, toBalanceInfor, fromBalanceInfor, withdrawalRecordsList, recordIndex, dateFrom, dateTo, depositListIndex, depositRecordsList, withdrawalListIndex, ScrollTop, IsAbleCompleteFromUIPop, rebateAmountPopMsg, rebateAmountPop, AbleCompleteFromData } = this.state
		//console.log(withdrawalRecordsList.map(v => v.IsUploadSlip))
		return <View style={[styles.viewContainer, { backgroundColor: true ? '#EFEFF4' : '#000' }]}>
			{/* 提款确认到账弹窗 */}
			<AbleCompleteFromUIPop
				AbleCompleteFromData={AbleCompleteFromData}
				IsAbleCompleteFromUIPop={IsAbleCompleteFromUIPop}
				recordes={'recordes'}
				PopChange={() => {
					//关闭
					this.setState({ IsAbleCompleteFromUIPop: false })
				}}
				getDepositWithdrawalsRecords={() => {
					this.getDepositWithdrawalsRecords()
				}}
				changeBettingHistoryDatesIndex={() => {
					this.changeBettingHistoryDatesIndex(1)
				}}
			/>

			<Modal visible={isShowPisker} transparent={true} animationType='fade'>
				<TouchableHighlight
					onPress={() => {
						this.setState({
							isShowPisker: false
						})
					}}
					style={{
						flex: 1,
						backgroundColor: 'rgba(0, 0, 0, .4)',
						width,
						height,
						position: 'absolute',
						left: 0,
						right: 0,
						zIndex: 10000,
						justifyContent: 'flex-end'
					}}>
					<View style={{
						backgroundColor: '#EFEFF4',
						paddingTop: 15,
						paddingHorizontal: 10,
						borderTopRightRadius: 20,
						borderTopLeftRadius: 20,
						height: recordIndex == 0 ? height * .8 : 'auto',
						paddingBottom: recordIndex == 0 ? 0 : 40
					}}>
						<Text style={{
							textAlign: 'center',
							fontSize: 16,
							paddingBottom: 25,
							color: '#000000',
							fontWeight: '600'
						}}>{
								recordIndex == 0 && '存款方式'
							}
							{
								recordIndex == 2 && '取款方式'
							}</Text>
						<ScrollView

							automaticallyAdjustContentInsets={false}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
						>
							<View >


								<View>
									{
										(recordIndex == 0 ? DeposiBanktList : WithdrawalBankList).map((v, i) => {
											return <TouchableOpacity style={{
												flexDirection: 'row',
												backgroundColor: '#fff',
												height: 42,
												marginBottom: 5,
												borderRadius: 8,
												alignItems: 'center',
												paddingHorizontal: 15,
												justifyContent: 'space-between'
											}}
												onPress={() => {
													if (recordIndex == 0) {
														this.setState({
															depositListIndex: i,
															isShowPisker: false
														}, () => {
															this.getDepositWithdrawalsRecords(true)
														})
													} else {
														this.setState({
															withdrawalListIndex: i,
															isShowPisker: false
														}, () => {
															this.getDepositWithdrawalsRecords(true)
														})
													}



												}}
											>
												<Text style={{ color: '#999999' }}>{v.name}</Text>

												<View style={{
													borderRadius: 10000,
													alignItems: 'center',
													justifyContent: 'center',
													borderWidth: 1,
													borderColor: (recordIndex == 0 ? depositListIndex : withdrawalListIndex) == i ? '#00A6FF' : '#BCBEC3',
													width: 20,
													height: 20,
													backgroundColor: (recordIndex == 0 ? depositListIndex : withdrawalListIndex) == i ? '#00A6FF' : '#fff'
												}}>
													{
														(recordIndex == 0 ? depositListIndex : withdrawalListIndex) == i && <View style={{
															borderRadius: 10000,
															width: 10,
															height: 10,
															backgroundColor: '#fff'
														}}></View>
													}
												</View>
											</TouchableOpacity>
										})
									}
								</View>
							</View>
						</ScrollView>
					</View>

				</TouchableHighlight>
			</Modal>
			<ScrollView
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				onScroll={(e) => {
					let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
					if (offsetY > 80 && !ScrollTop) {
						this.setState({ ScrollTop: true })
					}
					if (offsetY < 80 && ScrollTop) {
						this.setState({ ScrollTop: false })
					}
				}}
				scrollEventThrottle={16}
				ref={res => { this._ScrollTop = res }}
			>
				<Tabs
					tabs={RecordsTab}
					page={recordIndex}
					swipeable={false}
					renderTabBar={tabProps => (
						<View style={[
							styles.bettingWraps,
							{
								borderColor: true ? 'transparent' : '#646464',
								backgroundColor: true ? '#00A6FF' : '#212121',

							}
						]}>
							{
								tabProps.tabs.map((v, i) => {
									let flag = i * 1 === recordIndex * 1
									return <TouchableOpacity
										key={v.key || i}
										style={[styles.bettingBox, {
											backgroundColor: '#00A6FF',
											borderBottomWidth: 2,
											borderBottomColor: flag ? '#FFFFFF' : '#00A6FF'
										}]}
										onPress={() => {
											const { goToTab, onTabClick } = tabProps
											this.changeBettingHistoryDatesIndex(i)
										}}
									>
										<Text style={[{
											color: flag ? '#FFFFFF' : '#B4E4FE',
											fontWeight: flag ? 'bold' : 'normal',
											fontSize: 14
										}]}>{v.title}</Text>
									</TouchableOpacity>
								})}
						</View>
					)}
				>
					{/* 充值记录 */}
					<View style={styles.recordContainer}>
						<View style={[styles.fillterBox]}>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										isShowPisker: true
									})
								}}
								style={styles.toreturnModalDropdownTextWrap}>
								<Text style={[styles.toreturnModalDropdownText, { color: true ? '#707070' : '#fff' }]}>{DeposiBanktList[depositListIndex].name}</Text>
								<Image
									resizeMode="stretch"
									source={false ? require("../../images/up.png") : require("../../images/down.png")}
									style={{
										width: 16,
										height: 16,
									}}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									this.serch7days()
								}}
								style={[styles.toreturnModalDropdownTextWrap, {
									width: 'auto', marginHorizontal: 8, paddingHorizontal: 10,
									borderColor: isDefault7 ? '#00A6FF' : '#D7D7DB'
								}]}>
								<Text style={{ color: isDefault7 ? '#00A6FF' : '#707070' }}>近7天</Text>
							</TouchableOpacity>
							{
								this.DatePickerCommon()
							}
						</View>
						<View>
							{
								Array.isArray(depositRecordsList)
								&&
								(

									depositRecordsList.length > 0 ? depositRecordsList.map((item, index) => {
										return <TouchableOpacity
											onPress={() => {
												Actions.recordsDatails({
													recordsDatails: item,
													datailsType: 'deposit',
													getDepositWithdrawalsRecords: () => {
														this.getDepositWithdrawalsRecords()
													}
												})

											}}
											//onPress={() => { Actions.recordsDatails({ recordsDatails: item, datailsType: 'deposit' }) }}
											style={[styles.deposiBanktList, {
												borderTopColor: true ? '#fff' : '#5C5C5C',
												backgroundColor: true ? '#fff' : '#212121',
												paddingBottom: 10
											}]}
											key={index}>
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
												<View>
													<Text style={[styles.recordBoxText, { color: true ? '#000' : '#fff', fontSize: 14 }]}>{item.PaymentMethodName}
														{

															item.PaymentMethodId.toLocaleUpperCase() == 'CTC' && <Text style={[styles.recordBoxText, { color: true ? '#000' : '#fff', fontSize: 14 }]}>
																{`(${CTCMethods[item.MethodType.toLocaleUpperCase()]})`}
															</Text>
														}
													</Text>


												</View>

												<Text style={[styles.depositStatusBoxText, { color: DepositStatus[`StatusId${item.StatusId}`].color, fontSize: 12 }]}>{DepositStatus[`StatusId${item.StatusId}`].text}</Text>
											</View>

											<Text style={[styles.recordBoxText, { color: '#BCBEC3', marginTop: 10 }]}>{moment(item.SubmittedAt).format('YYYY-MM-DD HH:mm')}</Text>


											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
												<View style={{ flexDirection: 'row', alignItems: 'center' }}>
													<Text style={styles.recordBoxTextId}>{item.TransactionId}</Text>
													<TouchableOpacity
														hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
														onPress={this.copyTXT.bind(this, item.TransactionId, index)}
														style={{
															paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginLeft: 15
														}}>
														<Text style={{ color: '#25AAE1', fontSize: 12 }}>复制</Text>
													</TouchableOpacity>
													{
														bankIndex == index && <View style={{
															width: 14, height: 14,
															backgroundColor: '#00A6FF', alignItems: 'center', justifyContent: 'center', borderRadius: 1000
														}}>
															<Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>
														</View>
													}

												</View>

												{
													(item.StatusId == 1 || item.StatusId == 4) && item.MethodType == 'CHANNEL' ?
														<Text style={{ color: '#000', textAlign: 'right' }}>-</Text>
														:
														<Text style={styles.recordBoxTextAmount}>
															<Text style={{ fontSize: 14 }}>￥</Text>{item.Amount}
														</Text>
												}
											</View>



										</TouchableOpacity>
									})
										:
										<View style={{ alignItems: 'center', marginTop: 180 }}>
											<Image source={require('../../images/norecord.png')} resizeMode='stretch'
												style={{ width: 80, height: 80 }}></Image>
											<Text style={{ color: '#CCCCCC', marginTop: 20 }}>暂无数据</Text>
										</View>
								)

							}
						</View>
					</View>

					{/* 转账记录 */}
					<View style={styles.recordContainer}>
						<View style={[styles.fillterBox]}>
							<TouchableOpacity
								onPress={() => {
									this.serch7days()
								}}
								style={[styles.toreturnModalDropdownTextWrap, {
									width: 'auto', marginHorizontal: 8, paddingHorizontal: 10,
									borderColor: isDefault7 ? '#00A6FF' : '#D7D7DB'
								}]}>
								<Text style={{ color: isDefault7 ? '#00A6FF' : '#707070' }}>近7天</Text>
							</TouchableOpacity>

							{
								this.DatePickerCommon()
							}
						</View>

						<View>
							{
								(
									Array.isArray(tranferRecordsList)
									&&
									(
										tranferRecordsList.length > 0 ? tranferRecordsList.map((item, index) => {
											let tempFromWalletName = balanceInfor.find(v => v.name === item.creditAccount.toLocaleUpperCase())
											let fromWalletName = tempFromWalletName ? tempFromWalletName.localizedName : (OtherTranferName[item.creditAccount.toLocaleUpperCase()] ? OtherTranferName[item.creditAccount.toLocaleUpperCase()] : item.creditAccount.toLocaleUpperCase())
											let tempToWalletName = balanceInfor.find(v => v.name === item.debitAccount.toLocaleUpperCase())
											let toWalletName = tempToWalletName ? tempToWalletName.localizedName : (OtherTranferName[item.debitAccount.toLocaleUpperCase()] ? OtherTranferName[item.debitAccount.toLocaleUpperCase()] : item.debitAccount.toLocaleUpperCase())

											return(
											item.remark != '\"转账失败!\"' &&
											<View
												style={[styles.deposiBanktList, {
													borderTopColor: true ? '#fff' : '#5C5C5C',
													backgroundColor: true ? '#fff' : '#212121'
												}]}
												key={index}>
												<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Text style={[styles.recordBoxText, { color: true ? '#000' : '#fff', fontSize: 14 }]}>
															{fromWalletName}
														</Text>
														<Image source={require('../../images/tranferion.png')} resizeMode='stretch' style={{ width: 25, height: 20 }}></Image>
														<Text style={[styles.recordBoxText, { color: true ? '#000' : '#fff', fontSize: 14 }]}>
															{toWalletName}
														</Text>
													</View>

													<Text style={[styles.depositStatusBoxText, { color: item.status == 1 ? '#0CCC3C' : '#EB2121', fontSize: 12 }]}>{item.status == 1 ? '转账成功' : '转账失败'}</Text>
												</View>

												<Text style={[styles.recordBoxText, { color: true ? '#999' : 'rgba(255, 255, 255, .5)', marginTop: 10 }]}>{moment(item.transactionDate).format('YYYY-MM-DD HH:mm')}</Text>

												<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Text style={styles.recordBoxTextId}>{item.id}</Text>


													</View>


													<Text style={styles.recordBoxTextAmount}>
														<Text style={{ fontSize: 14 }}>￥</Text>{item.amount}
													</Text>
												</View>
											</View>
											)
										})
											:
											<View style={{ alignItems: 'center', marginTop: 180 }}>
												<Image source={require('../../images/norecord.png')} resizeMode='stretch'
													style={{ width: 80, height: 80 }}></Image>
												<Text style={{ color: '#CCCCCC', marginTop: 20 }}>暂无数据</Text>
											</View>
									)
								)

							}
						</View>
					</View>

					{/* 提款记录 */}
					<View style={styles.recordContainer}>
						<View style={[styles.fillterBox]}>

							<TouchableOpacity
								onPress={() => {
									this.setState({
										isShowPisker: true
									})
								}}
								style={styles.toreturnModalDropdownTextWrap}>
								<Text style={[styles.toreturnModalDropdownText, { color: true ? '#707070' : '#fff' }]}>{WithdrawalBankList[withdrawalListIndex].name}</Text>
								<Image
									resizeMode="stretch"
									source={false ? require("../../images/up.png") : require("../../images/down.png")}
									style={{
										width: 16,
										height: 16,
									}}
								/>
							</TouchableOpacity>



							<TouchableOpacity
								onPress={() => {
									this.serch7days()
								}}
								style={[styles.toreturnModalDropdownTextWrap, {
									width: 'auto', marginHorizontal: 8, paddingHorizontal: 10,
									borderColor: isDefault7 ? '#00A6FF' : '#D7D7DB'
								}]}>
								<Text style={{ color: isDefault7 ? '#00A6FF' : '#707070' }}>近7天</Text>
							</TouchableOpacity>

							{
								this.DatePickerCommon()
							}

						</View>

						<View>
							{

								(
									Array.isArray(withdrawalRecordsList)
									&&
									(
										withdrawalRecordsList.length > 0 ? withdrawalRecordsList.map((item, index) => {
											return <TouchableOpacity
												onPress={() => {
													Actions.recordsDatails({
														recordsDatails: item,
														datailsType: 'withdrawal',
														getDepositWithdrawalsRecords: () => {
															this.getDepositWithdrawalsRecords()
														},
														changeBettingHistoryDatesIndex: (keys) => {
															this.changeBettingHistoryDatesIndex(keys)
														}
													})
												}}
												style={[styles.deposiBanktList, {
													borderTopColor: true ? '#fff' : '#5C5C5C',
													backgroundColor: true ? '#fff' : '#212121'
												}]}
												key={index}>
												<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
													<View>
														<Text style={[styles.recordBoxText, { color: true ? '#000' : '#fff', fontSize: 14 }]}>
															{item.PaymentMethodName}
															{/* {item.PaymentMethodId == 'LB' ? '-' + item.MethodType : ''} */}
														</Text>
													</View>

													<Text style={[styles.depositStatusBoxText, { color: WithdrawalStatus[`StatusId${item.StatusId}`].color, fontSize: 12 }]}>{WithdrawalStatus[`StatusId${item.StatusId}`].text}</Text>
												</View>

												<Text style={[styles.recordBoxText, { color: true ? '#999' : 'rgba(255, 255, 255, .5)', marginTop: 10 }]}>{moment(item.SubmittedAt).format('YYYY-MM-DD HH:mm')}</Text>


												<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Text style={styles.recordBoxTextId}>{item.TransactionId}</Text>
														<TouchableOpacity
															hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
															onPress={this.copyTXT.bind(this, item.TransactionId, index)}
															style={{
																paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginLeft: 15
															}}>
															<Text style={{ color: '#25AAE1', fontSize: 12 }}>复制</Text>
														</TouchableOpacity>
														{
															bankIndex == index && <View style={{
																width: 14, height: 14,
																backgroundColor: '#00A6FF', alignItems: 'center', justifyContent: 'center', borderRadius: 1000
															}}>
																<Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>
															</View>
														}

													</View>


													<Text style={styles.recordBoxTextAmount}>
														<Text style={{ fontSize: 14 }}>￥</Text>{item.Amount}
													</Text>
												</View>
												{
													item.IsAbleCompleteFromUI &&
													<View style={styles.confirmView}>
														{
															Boolean(item.ReasonMsg) &&
															<View style={styles.confirmMsg}>
																<Image
																	source={require('../../images/warnBlue.png')}
																	resizeMode='stretch'
																	style={{ width: 14, height: 14 }}
																/>
																<Text style={styles.confirmText}>{item.ReasonMsg}</Text>
																<View style={styles.confirmArrow} />
															</View>
														}
														<Touch style={styles.confirmBtn} onPress={() => { this.AbleCompleteFromData(item) }}>
															<Text style={{ fontSize: 12, color: '#fff' }}>确认到账</Text>
														</Touch>
													</View>
												}
											</TouchableOpacity>
										})
											:
											<View style={{ alignItems: 'center', marginTop: 180 }}>
												<Image source={require('../../images/norecord.png')} resizeMode='stretch'
													style={{ width: 80, height: 80 }}></Image>
												<Text style={{ color: '#CCCCCC', marginTop: 20 }}>暂无数据</Text>
											</View>
									)

								)
							}
						</View>
					</View>



				</Tabs>
			</ScrollView>
			{
				ScrollTop &&
				<View style={styles.goTop}>
					<Touch onPress={() => {
						this._ScrollTop && this._ScrollTop.scrollTo({ x: 0, y: 0 })
						this.setState({ ScrollTop: false })
					}}>
						<Image resizeMode='stretch' source={require('../../images/goTop.png')} style={{ width: 80, height: 80 }} />
					</Touch>
				</View>
			}
		</View>
	}
}

export default Records = connect(
	(state) => {
		return {
			balanceInforData: state.balanceInforData,
			memberInforData: state.memberInforData,
		}
	}, (dispatch) => {
		return {
			//getBalanceInforAction: () => dispatch(getBalanceInforAction())
		}
	}
)(RecordsContainer)








const styles = StyleSheet.create({
	confirmBtn: {
		padding: 8,
		backgroundColor: '#00A6FF',
		borderRadius: 5,
	},
	confirmArrow: {
		position: 'absolute',
		right: -16,
		width: 0,
		height: 0,
		zIndex: 99,
		borderWidth: 10,
		borderTopColor: "transparent",
		borderLeftColor: "#FFF4D0",
		borderBottomColor: "transparent",
		borderRightColor: "transparent",
	},
	confirmView: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
	},
	confirmMsg: {
		padding: 5,
		backgroundColor: '#FFF4D0',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginRight: 12,
	},
	confirmText: {
		color: '#3F3F41',
		fontSize: 12,
		paddingLeft: 5,
	},
	goTop: {
		position: 'absolute',
		bottom: 50,
		zIndex: 9999,
		right: 0,
	},
	viewContainer: {
		flex: 1,
		position: 'relative',

		backgroundColor: '#EFEFF4'
	},
	recordContainer: {
		marginHorizontal: 10
	},
	recordBoxImg: {
		position: 'absolute',
		left: 0,
		width: 26,
		height: 26,
	},
	recordBoxImg1: {
		position: 'absolute',
		right: 10,
		width: 14,
		height: 14,
	},
	deposiBanktList: {
		backgroundColor: '#fff',
		// width: width,
		// marginHorizontal: -10,
		marginBottom: 10,
		paddingTop: 10,
		paddingBottom: 15,
		paddingHorizontal: 10,
		justifyContent: 'center',
		borderTopWidth: 1,
		borderRadius: 10
	},
	recordBoxText: {
		color: '#9B9B9B',
		fontSize: 12
	},
	recordBoxTextId: {
		fontSize: 12,
		color: '#BCBEC3',
		paddingTop: 8,
	},
	recordBoxTextAmount: {
		fontSize: 18,
		textAlign: 'right',
		color: '#000',
	},
	recordBox1: {
		width: width - 20,
		position: 'relative',
		alignItems: 'center',
		marginBottom: 20
	},
	recordBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 2
	},
	recordBox2: {
		width: width - 20
	},
	serchBtnBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10
	},
	fillterBox: {
		paddingTop: 8,
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		marginBottom: 15,
		flexDirection: 'row'
	},
	serchBtn: {
		height: 36,
		backgroundColor: '#25AAE1',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},
	serchBtnText: {
		color: '#fff'
	},
	recordIconBox: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	},
	recordIcon: {
		width: 16,
		height: 16,
		marginRight: 6
	},
	recordIconText: {
		color: '#26ADE6',
		fontSize: 11
	},
	toreturnModalDropdownList: {
		height: 30,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	bettingWraps: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		overflow: 'hidden',
	},
	bettingBox: {
		height: 36,
		justifyContent: 'center',
		flexDirection: 'row',
		width: (width - 20) / 3,
		alignItems: 'center',
	},
	toreturnModalDropdown: {
		height: 40,
		borderRadius: 4,
		marginTop: 8,
		borderWidth: 1,
		justifyContent: 'center',
	},
	toreturnDropdownStyle: {
		marginTop: 10,
		width: width - 36,
		shadowColor: '#DADADA',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4
	},
	toreturnModalDropdownTextWrap: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: '#D7D7DB',
		borderWidth: 1,
		height: 36,
		borderRadius: 600000,
		width: 110
	},
	toreturnModalDropdownText: {
		fontSize: 13,
	},
	depositStatusBox: {
		position: 'absolute',
		right: 10,
		bottom: 10,
		flexDirection: 'row',
		height: 30,
		width: 180,
		alignItems: 'center',
		borderRadius: 100,
		justifyContent: 'center',
		// paddingHorizontal: 15
	},
	depositStatusBox1: {
		position: 'absolute',
		right: 10,
		bottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 100,
		justifyContent: 'center',
		backgroundColor: '#83E300',
		paddingHorizontal: 15,
		paddingVertical: 4,
		marginLeft: 10
	},
	depositStatusBoxText: {
		color: '#fff',
		fontSize: 11,
		fontWeight: 'bold'
	},
	depositStatusImg: {
		marginRight: 5,
		width: 15,
		height: 15
	},
	tranferWallet: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tranferWalletModalDropdown: {
		width: (width - 36) / 2.05,
		marginHorizontal: 0
	},
	tranferWalletModalDropdownStyle: {
		width: (width - 36) / 2.05,
	},
	recordText: {
		marginTop: 100,
		textAlign: 'center'
	},

	bettingDatePicker: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 100000,
		borderColor: '#00A6FF',
		borderWidth: 1,
		height: 36
	},
	datePickerWrapView: {
		width: 50,
		// backgroundColor: 'red',
		flexDirection: 'row',
		height: 36,
		// paddingLeft: 10,
		// paddingRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
		// borderRadius: 4,
		// borderRadius: 100000,
		// width: 70
	},
	calendarImg: {
		width: 20,
		height: 20,
		position: 'absolute',
		right: 8
	},
	recordStyle: {
		borderRadius: 4,
		borderWidth: 1,
		width: (width - 36) / 2.05,
	}
})